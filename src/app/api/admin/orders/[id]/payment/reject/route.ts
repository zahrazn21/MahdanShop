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
          error: "احراز هویت انجام نشده است",
        },
        {
          status: 401,
        },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        {
          status: 403,
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
    const { reason, adminNote } = body;

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return NextResponse.json(
        {
          error: "علت رد پرداخت الزامی است",
        },
        {
          status: 400,
        },
      );
    }
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
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

      if (!order) {
        throw new Error("سفارش پیدا نشد");
      }
      if (!order.payment) {
        throw new Error("برای این سفارش اطلاعات پرداخت وجود ندارد");
      }

      if (order.payment.status !== "PENDING") {
        throw new Error("این پرداخت قبلاً بررسی شده است");
      }

      if (order.paymentStatus !== "REVIEW") {
        throw new Error("این سفارش در وضعیت بررسی پرداخت نیست");
      }

      if (order.status !== "WAITING_CONFIRMATION") {
        throw new Error("وضعیت سفارش برای رد پرداخت معتبر نیست");
      }
      await tx.payment.update({
        where: {
          id: order.payment.id,
        },

        data: {
          status: "REJECTED",

          rejectionReason: reason.trim(),

          adminNote:
            typeof adminNote === "string" && adminNote.trim() !== ""
              ? adminNote.trim()
              : null,

          reviewedAt: new Date(),
        },
      });
      for (const shipment of order.shipments) {
        if (shipment.shipmentType === "DOMESTIC") {
          await tx.orderShipment.update({
            where: {
              id: shipment.id,
            },

            data: {
              status: "PENDING",

              freightPaymentStatus: "NOT_REQUIRED",
            },
          });
        }

        if (shipment.shipmentType === "IMPORTED") {
          await tx.orderShipment.update({
            where: {
              id: shipment.id,
            },

            data: {
              status: "WAITING_IMPORT",

              freightPaymentStatus: "PENDING",
            },
          });
        }
      }
      return await tx.order.update({
        where: {
          id: order.id,
        },

        data: {
          paymentStatus: "REJECTED",

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
    });
    return NextResponse.json(
      {
        success: true,

        action: "REJECTED",

        message: "پرداخت رد شد و سفارش به حالت در انتظار پرداخت بازگشت.",

        paymentStatus: updatedOrder.paymentStatus,

        orderStatus: updatedOrder.status,

        order: updatedOrder,
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error("ADMIN REJECT PAYMENT ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "خطا در رد پرداخت",
      },
      {
        status: 500,
      },
    );
  }
}
