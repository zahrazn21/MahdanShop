/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(_req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "لطفاً ابتدا وارد حساب کاربری شوید",
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
          error: "دسترسی به این سفارش ندارید",
        },
        {
          status: 403,
        },
      );
    }
    if (order.paymentStatus !== "REJECTED") {
      return NextResponse.json(
        {
          error: "این پرداخت قابل ارسال مجدد نیست",
        },
        {
          status: 400,
        },
      );
    }

    if (!order.payment) {
      return NextResponse.json(
        {
          error: "اطلاعات پرداخت پیدا نشد",
        },
        {
          status: 404,
        },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          id: order.payment!.id,
        },

        data: {
          status: "PENDING",

          receiptImage: null,

          rejectionReason: null,

          adminNote: null,

          reviewedAt: null,

          payerName: null,

          payerCardLast4: null,
        },
      });

      const updatedOrder = await tx.order.update({
        where: {
          id: order.id,
        },

        data: {
          paymentStatus: "PENDING",

          status: "PENDING_PAYMENT",
        },

        include: {
          payment: true,

          items: true,

          shipments: {
            include: {
              batch: true,

              items: {
                include: {
                  orderItem: true,
                },
              },
            },
          },
        },
      });

      return updatedOrder;
    });

    return NextResponse.json(
      {
        success: true,

        message: "امکان ارسال مجدد رسید فعال شد",

        order: result,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error("RESET PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message ?? "خطا در فعال‌سازی ارسال مجدد رسید",
      },
      {
        status: 500,
      },
    );
  }
}
