/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

interface RouteContext {
  params: Promise<{
    id: string;
    paymentId: string;
  }>;
}

type ShipmentStatus =
  | "PENDING"
  | "WAITING_IMPORT"
  | "WAITING_FOR_FREIGHT"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED";

type CalculatedOrderStatus =
  | "CONFIRMED"
  | "PROCESSING"
  | "PARTIALLY_SHIPPED"
  | "COMPLETED";

function calculateOrderStatus(
  shipments: Array<{
    status: ShipmentStatus;
  }>,
): CalculatedOrderStatus {
  if (shipments.length === 0) {
    return "CONFIRMED";
  }

  const allDelivered = shipments.every(
    (shipment) => shipment.status === "DELIVERED",
  );

  if (allDelivered) {
    return "COMPLETED";
  }

  const hasShippedOrDelivered = shipments.some(
    (shipment) =>
      shipment.status === "SHIPPED" ||
      shipment.status === "DELIVERED",
  );

  if (hasShippedOrDelivered) {
    return "PARTIALLY_SHIPPED";
  }

  const hasProcessingShipment = shipments.some(
    (shipment) =>
      shipment.status === "READY_TO_SHIP" ||
      shipment.status === "WAITING_IMPORT" ||
      shipment.status === "WAITING_FOR_FREIGHT",
  );

  if (hasProcessingShipment) {
    return "PROCESSING";
  }

  return "CONFIRMED";
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

    const { id: orderId, paymentId } = await context.params;

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

    if (!paymentId) {
      return NextResponse.json(
        {
          error: "شناسه پرداخت ارسال نشده است",
        },
        {
          status: 400,
        },
      );
    }
    const body = await req.json();

    const { status, adminNote, rejectionReason } = body;

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        {
          error: "وضعیت پرداخت باید APPROVED یا REJECTED باشد",
        },
        {
          status: 400,
        },
      );
    }
    if (
      status === "REJECTED" &&
      (!rejectionReason ||
        typeof rejectionReason !== "string" ||
        rejectionReason.trim() === "")
    ) {
      return NextResponse.json(
        {
          error: "علت رد رسید هزینه ارسال الزامی است",
        },
        {
          status: 400,
        },
      );
    }
    const result = await prisma.$transaction(async (tx) => {
      const shippingPayment =
        await tx.shippingPayment.findUnique({
          where: {
            id: paymentId,
          },

          include: {
            shipment: {
              include: {
                order: true,

                items: {
                  include: {
                    orderItem: true,
                  },
                },
              },
            },
          },
        });

      if (!shippingPayment) {
        throw new Error("پرداخت هزینه ارسال پیدا نشد");
      }
      if (shippingPayment.shipment.orderId !== orderId) {
        throw new Error(
          "این پرداخت متعلق به سفارش موردنظر نیست",
        );
      }
      if (
        shippingPayment.shipment.shipmentType !==
        "DOMESTIC"
      ) {
        throw new Error(
          "این پرداخت مربوط به ارسال داخلی نیست",
        );
      }
      if (shippingPayment.status !== "PENDING") {
        throw new Error(
          "این رسید قبلاً بررسی شده است",
        );
      }

      const now = new Date();
      if (status === "APPROVED") {

        const updatedPayment =
          await tx.shippingPayment.update({
            where: {
              id: shippingPayment.id,
            },

            data: {
              status: "APPROVED",

              adminNote:
                typeof adminNote === "string" &&
                adminNote.trim() !== ""
                  ? adminNote.trim()
                  : null,

              rejectionReason: null,

              reviewedAt: now,
            },
          });
        const updatedShipment =
          await tx.orderShipment.update({
            where: {
              id: shippingPayment.shipment.id,
            },

            data: {
              shippingPaymentStatus: "PAID",

              shippingPaidAt: now,

              status: "READY_TO_SHIP",
            },

            include: {
              order: true,

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
          calculateOrderStatus(allShipments);
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
          action: "APPROVED" as const,
          payment: updatedPayment,
          shipment: updatedShipment,
          order: updatedOrder,
        };
      }
      const updatedPayment =
        await tx.shippingPayment.update({
          where: {
            id: shippingPayment.id,
          },

          data: {
            status: "REJECTED",

            rejectionReason:
              rejectionReason.trim(),

            adminNote:
              typeof adminNote === "string" &&
              adminNote.trim() !== ""
                ? adminNote.trim()
                : null,

            reviewedAt: now,
          },
        });

      const updatedShipment =
        await tx.orderShipment.update({
          where: {
            id: shippingPayment.shipment.id,
          },

          data: {
            shippingPaymentStatus:
              "AWAITING_USER_PAYMENT",

            shippingPaidAt: null,

            status: "PENDING",
          },

          include: {
            order: true,

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
        calculateOrderStatus(allShipments);
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
        action: "REJECTED" as const,
        payment: updatedPayment,
        shipment: updatedShipment,
        order: updatedOrder,
      };
    });
    if (result.action === "APPROVED") {
      return NextResponse.json(
        {
          success: true,

          action: "APPROVED",

          message:
            "پرداخت هزینه ارسال با موفقیت تأیید شد و مرسوله آماده ارسال است.",

          payment: result.payment,

          shipment: result.shipment,

          order: result.order,
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,

        action: "REJECTED",

        message:
          "رسید هزینه ارسال رد شد و مشتری می‌تواند رسید جدید ارسال کند.",

        payment: result.payment,

        shipment: result.shipment,

        order: result.order,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error(
      "ADMIN SHIPPING PAYMENT REVIEW ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error?.message ??
          "خطا در بررسی پرداخت هزینه ارسال",
      },
      {
        status: 500,
      },
    );
  }
}
