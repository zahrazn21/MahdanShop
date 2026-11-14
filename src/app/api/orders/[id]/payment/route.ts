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

    if (typeof receiptImage !== "string" || receiptImage.trim() === "") {
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
        payment: true,
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
    const canSubmitReceipt =
      order.status === "PENDING_PAYMENT" ||
      (order.status === "WAITING_CONFIRMATION" &&
        order.paymentStatus === "REJECTED");

    if (!canSubmitReceipt) {
      return NextResponse.json(
        {
          error: "در وضعیت فعلی سفارش امکان ارسال رسید وجود ندارد",
        },
        {
          status: 400,
        },
      );
    }

    if (order.paymentStatus === "REVIEW") {
      return NextResponse.json(
        {
          error: "رسید این سفارش قبلاً ارسال شده و در انتظار بررسی ادمین است",
        },
        {
          status: 400,
        },
      );
    }
    const payment = await prisma.$transaction(async (tx) => {
      const normalizedPayerName =
        typeof payerName === "string" && payerName.trim() !== ""
          ? payerName.trim()
          : null;

      const normalizedCardLast4 =
        typeof payerCardLast4 === "string" && payerCardLast4.trim() !== ""
          ? payerCardLast4.trim()
          : null;

      let paymentRecord;

      if (order.payment) {
        paymentRecord = await tx.payment.update({
          where: {
            id: order.payment.id,
          },

          data: {
            method: "CARD_TO_CARD",

            status: "PENDING",

            amount: order.totalPrice,

            receiptImage: receiptImage.trim(),

            payerName: normalizedPayerName,

            payerCardLast4: normalizedCardLast4,

            rejectionReason: null,

            reviewedAt: null,

            adminNote: null,
          },
        });
      } else {
        paymentRecord = await tx.payment.create({
          data: {
            orderId: order.id,

            method: "CARD_TO_CARD",

            status: "PENDING",

            amount: order.totalPrice,

            receiptImage: receiptImage.trim(),

            payerName: normalizedPayerName,

            payerCardLast4: normalizedCardLast4,
          },
        });
      }

      await tx.order.update({
        where: {
          id: order.id,
        },

        data: {
          paymentStatus: "REVIEW",

          status: "WAITING_CONFIRMATION",
        },
      });

      return paymentRecord;
    });

    return NextResponse.json(
      {
        success: true,

        paymentId: payment.id,

        orderId: order.id,

        paymentStatus: "REVIEW",

        status: "WAITING_CONFIRMATION",

        message:
          "رسید با موفقیت ارسال شد و پس از بررسی ادمین سفارش شما تأیید خواهد شد.",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("PAYMENT RECEIPT ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message ?? "خطا در ثبت رسید پرداخت",
      },
      {
        status: 500,
      },
    );
  }
}
