/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "برای ارسال رسید ابتدا وارد حساب کاربری شوید",
        },
        {
          status: 401,
        },
      );
    }

    const { id: orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        {
          error: "شناسه سفارش ارسال نشده است",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();
    const { receiptImage, payerName, payerCardLast4 } = body;

    if (
      typeof receiptImage !== "string" ||
      receiptImage.trim() === ""
    ) {
      return NextResponse.json(
        {
          error: "تصویر رسید الزامی است",
        },
        {
          status: 400,
        },
      );
    }
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        shipments: {
          where: {
            shipmentType: "DOMESTIC",
          },

          include: {
            shippingPayments: {
              orderBy: {
                createdAt: "desc",
              },

              take: 10,
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "سفارش پیدا نشد",
        },
        {
          status: 404,
        },
      );
    }
    if (order.userId !== user.id) {
      return NextResponse.json(
        {
          error: "شما به این سفارش دسترسی ندارید",
        },
        {
          status: 403,
        },
      );
    }
    const domesticShipment = order.shipments[0];

    if (!domesticShipment) {
      return NextResponse.json(
        {
          error: "محموله ارسال داخلی برای این سفارش پیدا نشد",
        },
        {
          status: 400,
        },
      );
    }
    if (
      domesticShipment.shippingPaymentStatus !==
      "AWAITING_USER_PAYMENT"
    ) {
      if (
        domesticShipment.shippingPaymentStatus === "PAID"
      ) {
        return NextResponse.json(
          {
            error: "هزینه ارسال این سفارش قبلاً پرداخت شده است",
          },
          {
            status: 400,
          },
        );
      }

      if (
        domesticShipment.shippingPaymentStatus === "EXPIRED"
      ) {
        return NextResponse.json(
          {
            error:
              "مهلت پرداخت هزینه ارسال این سفارش به پایان رسیده است",
          },
          {
            status: 400,
          },
        );
      }

      return NextResponse.json(
        {
          error:
            "در وضعیت فعلی امکان پرداخت هزینه ارسال وجود ندارد",
        },
        {
          status: 400,
        },
      );
    }
    const shippingAmount = domesticShipment.shippingCost;
    if (!shippingAmount || shippingAmount <= 0) {
      return NextResponse.json(
        {
          error: "مبلغ هزینه ارسال معتبر نیست",
        },
        {
          status: 400,
        },
      );
    }
    if (
      domesticShipment.shippingDueAt &&
      domesticShipment.shippingDueAt < new Date()
    ) {
      await prisma.orderShipment.update({
        where: {
          id: domesticShipment.id,
        },

        data: {
          shippingPaymentStatus: "EXPIRED",
        },
      });

      return NextResponse.json(
        {
          error:
            "مهلت یک ماهه پرداخت هزینه ارسال به پایان رسیده است",
        },
        {
          status: 400,
        },
      );
    }
    const pendingPayment =
      domesticShipment.shippingPayments.find(
        (payment) => payment.status === "PENDING",
      );

    if (pendingPayment) {
      return NextResponse.json(
        {
          error:
            "رسید هزینه ارسال قبلاً ارسال شده و در انتظار بررسی ادمین است",
        },
        {
          status: 400,
        },
      );
    }
    const normalizedPayerName =
      typeof payerName === "string" &&
      payerName.trim() !== ""
        ? payerName.trim()
        : null;

    const normalizedCardLast4 =
      typeof payerCardLast4 === "string" &&
      payerCardLast4.trim() !== ""
        ? payerCardLast4.trim()
        : null;
    const shippingPayment = await prisma.$transaction(
      async (tx) => {
        const payment =
          await tx.shippingPayment.create({
            data: {
              shipmentId: domesticShipment.id,
              amount: shippingAmount,
              status: "PENDING",
              receiptImage: receiptImage.trim(),
              payerName: normalizedPayerName,
              payerCardLast4: normalizedCardLast4,
            },
          });
        return payment;
      },
    );

    return NextResponse.json(
      {
        success: true,
        paymentId: shippingPayment.id,
        orderId: order.id,
        shipmentId: domesticShipment.id,
        amount: shippingPayment.amount,
        paymentStatus: "PENDING",
        shippingPaymentStatus: "AWAITING_USER_PAYMENT",
        message:
          "رسید هزینه ارسال با موفقیت ارسال شد و پس از بررسی ادمین تأیید خواهد شد.",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(
      "SHIPPING PAYMENT RECEIPT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error?.message ??
          "خطا در ثبت رسید هزینه ارسال",
      },
      {
        status: 500,
      },
    );
  }
}

