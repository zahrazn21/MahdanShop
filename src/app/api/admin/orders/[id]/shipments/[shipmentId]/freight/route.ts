/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

interface RouteContext {
  params: Promise<{
    id: string;
    shipmentId: string;
  }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "احراز هویت انجام نشده است" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const { id: orderId, shipmentId } = await context.params;

    if (!orderId || !shipmentId) {
      return NextResponse.json(
        { error: "شناسه سفارش یا مرسوله ارسال نشده است" },
        { status: 400 },
      );
    }


    const body = await req.json();

    const {
      actualWeightGram,
      freightRateYuan,
      yuanExchangeRate,
      freightCostToman,
    } = body;

    const cost = Number(freightCostToman);

    if (!Number.isFinite(cost) || cost <= 0) {
      return NextResponse.json(
        { error: "هزینه نهایی باربری باید بیشتر از صفر باشد" },
        { status: 400 },
      );
    }

    const weight =
      actualWeightGram === null ||
      actualWeightGram === undefined ||
      actualWeightGram === ""
        ? null
        : Number(actualWeightGram);

    const rate =
      freightRateYuan === null ||
      freightRateYuan === undefined ||
      freightRateYuan === ""
        ? null
        : Number(freightRateYuan);

    const exchangeRate =
      yuanExchangeRate === null ||
      yuanExchangeRate === undefined ||
      yuanExchangeRate === ""
        ? null
        : Number(yuanExchangeRate);

    if (weight !== null && (!Number.isFinite(weight) || weight <= 0)) {
      return NextResponse.json(
        { error: "وزن واقعی باید بیشتر از صفر باشد" },
        { status: 400 },
      );
    }

    if (rate !== null && (!Number.isFinite(rate) || rate <= 0)) {
      return NextResponse.json(
        { error: "نرخ باربری باید بیشتر از صفر باشد" },
        { status: 400 },
      );
    }

    if (
      exchangeRate !== null &&
      (!Number.isFinite(exchangeRate) || exchangeRate <= 0)
    ) {
      return NextResponse.json(
        { error: "نرخ تبدیل یوان باید بیشتر از صفر باشد" },
        { status: 400 },
      );
    }

    const shipment = await prisma.orderShipment.findFirst({
      where: {
        id: shipmentId,
        orderId,
      },
      include: {
        order: true,
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "مرسوله موردنظر پیدا نشد" },
        { status: 404 },
      );
    }

    if (shipment.shipmentType !== "IMPORTED") {
      return NextResponse.json(
        { error: "ثبت هزینه باربری فقط برای مرسوله وارداتی امکان‌پذیر است" },
        { status: 400 },
      );
    }

    if (shipment.order.paymentStatus !== "PAID") {
      return NextResponse.json(
        {
          error:
            "تا زمانی که پرداخت اولیه سفارش تأیید نشده باشد، امکان ثبت هزینه باربری وجود ندارد",
        },
        { status: 400 },
      );
    }

    if (shipment.freightPaymentStatus === "PAID") {
      return NextResponse.json(
        { error: "هزینه باربری این مرسوله قبلاً پرداخت و تأیید شده است." },
        { status: 409 },
      );
    }

    if (shipment.freightPaymentStatus === "AWAITING_USER_PAYMENT") {
      const existingPendingPayment =
        await prisma.shippingPayment.findFirst({
          where: {
            shipmentId: shipment.id,
            status: "PENDING",
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      if (existingPendingPayment) {
        return NextResponse.json(
          {
            error:
              "هزینه باربری این مرسوله قبلاً اعلام شده و رسید آن در انتظار بررسی است.",
          },
          { status: 409 },
        );
      }

      const existingRejectedPayment =
        await prisma.shippingPayment.findFirst({
          where: {
            shipmentId: shipment.id,
            status: "REJECTED",
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      if (existingRejectedPayment) {
        return NextResponse.json(
          {
            error:
              "هزینه باربری قبلاً اعلام شده است. رسید قبلی رد شده و کاربر باید مجدداً رسید پرداخت ارسال کند.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "هزینه باربری این مرسوله قبلاً اعلام شده است." },
        { status: 409 },
      );
    }

    const updatedShipment = await prisma.orderShipment.update({
      where: {
        id: shipment.id,
      },
      data: {
        ...(weight !== null
          ? { actualWeightGram: Math.round(weight) }
          : {}),
        ...(rate !== null ? { freightRateYuan: rate } : {}),
        ...(exchangeRate !== null
          ? { yuanExchangeRate: Math.round(exchangeRate) }
          : {}),
        freightCostToman: Math.round(cost),
        freightPaymentStatus: "AWAITING_USER_PAYMENT",
        freightReceiptImage: null,
        ...(shipment.status === "WAITING_IMPORT" ||
        shipment.status === "WAITING_FOR_FREIGHT"
          ? { status: "WAITING_FOR_FREIGHT" }
          : {}),
      },
      include: {
        order: true,
        batch: true,
        items: {
          include: {
            orderItem: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "هزینه باربری با موفقیت ثبت شد.",
        shipment: updatedShipment,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("ADMIN REGISTER FREIGHT ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message ?? "خطا در ثبت هزینه باربری",
      },
      { status: 500 },
    );
  }
}