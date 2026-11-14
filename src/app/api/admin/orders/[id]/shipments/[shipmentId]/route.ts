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

const allowedTransitions: Record<string, string[]> = {
  PENDING: ["READY_TO_SHIP"],
  WAITING_IMPORT: ["WAITING_FOR_FREIGHT"],
  WAITING_FOR_FREIGHT: ["READY_TO_SHIP"],
  READY_TO_SHIP: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
};


function calculateOrderStatus(
  shipments: Array<{
    status:
      | "PENDING"
      | "WAITING_IMPORT"
      | "WAITING_FOR_FREIGHT"
      | "READY_TO_SHIP"
      | "SHIPPED"
      | "DELIVERED";
  }>,
) {
  if (shipments.length === 0) {
    return "CONFIRMED" as const;
  }

  const allDelivered = shipments.every(
    (shipment) => shipment.status === "DELIVERED",
  );

  if (allDelivered) {
    return "COMPLETED" as const;
  }

  const hasShippedOrDelivered = shipments.some(
    (shipment) =>
      shipment.status === "SHIPPED" ||
      shipment.status === "DELIVERED",
  );

  if (hasShippedOrDelivered) {
    return "PARTIALLY_SHIPPED" as const;
  }

  const hasProcessingShipment = shipments.some(
    (shipment) =>
      shipment.status === "READY_TO_SHIP" ||
      shipment.status === "WAITING_IMPORT" ||
      shipment.status === "WAITING_FOR_FREIGHT",
  );

  if (hasProcessingShipment) {
    return "PROCESSING" as const;
  }

  return "CONFIRMED" as const;
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "احراز هویت انجام نشده است",
        },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        { status: 403 },
      );
    }


    const { id: orderId, shipmentId } =
      await context.params;

    if (!orderId) {
      return NextResponse.json(
        {
          error: "شناسه سفارش ارسال نشده است",
        },
        { status: 400 },
      );
    }

    if (!shipmentId) {
      return NextResponse.json(
        {
          error: "شناسه مرسوله ارسال نشده است",
        },
        { status: 400 },
      );
    }


    const body = await req.json();

    const { status, trackingNumber } = body;

    const validStatuses = [
      "PENDING",
      "WAITING_IMPORT",
      "WAITING_FOR_FREIGHT",
      "READY_TO_SHIP",
      "SHIPPED",
      "DELIVERED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "وضعیت مرسوله نامعتبر است",
        },
        { status: 400 },
      );
    }


    const shipment =
      await prisma.orderShipment.findFirst({
        where: {
          id: shipmentId,
          orderId,
        },

        include: {
          order: {
            select: {
              id: true,
              status: true,
              shippingPaymentMode: true,
            },
          },

          items: {
            include: {
              orderItem: true,
            },
          },

          batch: true,
        },
      });

    if (!shipment) {
      return NextResponse.json(
        {
          error:
            "مرسوله موردنظر برای این سفارش پیدا نشد",
        },
        { status: 404 },
      );
    }



    const allowedOrderStatuses = [
      "CONFIRMED",
      "PROCESSING",
      "PARTIALLY_SHIPPED",
      "COMPLETED",
    ];

    if (
      !allowedOrderStatuses.includes(
        shipment.order.status,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "تا زمانی که پرداخت اولیه سفارش تأیید نشده باشد، امکان تغییر وضعیت مرسوله وجود ندارد",
        },
        { status: 400 },
      );
    }

    if (shipment.status === status) {
      return NextResponse.json(
        {
          error:
            "مرسوله در حال حاضر همین وضعیت را دارد",
        },
        { status: 400 },
      );
    }

    const allowedNextStatuses =
      allowedTransitions[shipment.status] ?? [];

    if (!allowedNextStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `تغییر وضعیت از "${shipment.status}" به "${status}" مجاز نیست`,
        },
        { status: 400 },
      );
    }

    if (status === "READY_TO_SHIP") {

      if (shipment.shipmentType === "DOMESTIC") {
        const shippingCost =
          shipment.shippingCost ?? 0;

        const shippingPaymentStatus =
          shipment.shippingPaymentStatus;

        if (
          shippingCost > 0 &&
          shippingPaymentStatus !== "PAID"
        ) {
          return NextResponse.json(
            {
              error:
                "تا زمانی که هزینه ارسال داخلی پرداخت و تأیید نشده باشد، امکان آماده‌سازی مرسوله برای ارسال وجود ندارد",
            },
            { status: 400 },
          );
        }
      }
      if (shipment.shipmentType === "IMPORTED") {
        if (
          shipment.freightPaymentStatus !== "PAID"
        ) {
          return NextResponse.json(
            {
              error:
                "هزینه باربری وارداتی هنوز پرداخت و تأیید نشده است",
            },
            { status: 400 },
          );
        }
      }
    }
    let cleanTrackingNumber: string | null =
      null;

    if (status === "SHIPPED") {
      if (
        typeof trackingNumber !== "string" ||
        trackingNumber.trim() === ""
      ) {
        return NextResponse.json(
          {
            error:
              "برای تغییر وضعیت مرسوله به ارسال‌شده، شماره پیگیری الزامی است",
          },
          { status: 400 },
        );
      }

      cleanTrackingNumber =
        trackingNumber.trim();

      if (shipment.shipmentType === "DOMESTIC") {
        const shippingCost =
          shipment.shippingCost ?? 0;

        if (
          shippingCost > 0 &&
          shipment.shippingPaymentStatus !== "PAID"
        ) {
          return NextResponse.json(
            {
              error:
                "تا زمانی که هزینه ارسال داخلی پرداخت نشده باشد، امکان ارسال مرسوله وجود ندارد",
            },
            { status: 400 },
          );
        }
      }

      if (shipment.shipmentType === "IMPORTED") {
        if (
          shipment.freightPaymentStatus !== "PAID"
        ) {
          return NextResponse.json(
            {
              error:
                "تا زمانی که هزینه باربری وارداتی پرداخت نشده باشد، امکان ارسال مرسوله وجود ندارد",
            },
            { status: 400 },
          );
        }
      }
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const now = new Date();
        const updatedShipment =
          await tx.orderShipment.update({
            where: {
              id: shipment.id,
            },

            data: {
              status,

              ...(status === "SHIPPED"
                ? {
                    trackingNumber:
                      cleanTrackingNumber,
                    shippedAt:
                      shipment.shippedAt ?? now,
                  }
                : {}),

              ...(status === "DELIVERED"
                ? {
                    deliveredAt:
                      shipment.deliveredAt ?? now,
                  }
                : {}),
            },

            include: {
              batch: true,

              items: {
                include: {
                  orderItem: true,
                },
              },

              shippingPayments: {
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          });

        const allShipments =
          await tx.orderShipment.findMany({
            where: {
              orderId,
            },

            select: {
              status: true,
            },
          });
        const newOrderStatus =
          calculateOrderStatus(
            allShipments,
          );
        const updatedOrder =
          await tx.order.update({
            where: {
              id: orderId,
            },

            data: {
              status: newOrderStatus,
            },

            select: {
              id: true,
              status: true,
            },
          });

        return {
          updatedShipment,
          updatedOrder,
        };
      },
    );
    return NextResponse.json(
      {
        success: true,

        shipment: result.updatedShipment,

        order: result.updatedOrder,

        message:
          "وضعیت مرسوله و سفارش با موفقیت به‌روزرسانی شد",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "ADMIN SHIPMENT STATUS UPDATE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error?.message ??
          "خطا در تغییر وضعیت مرسوله",
      },
      { status: 500 },
    );
  }
}
