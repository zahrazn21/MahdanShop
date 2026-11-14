import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function GET() {
  try {
    const admin = await getCurrentUser();

    if (!admin) {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        {
          status: 401,
        },
      );
    }

    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        {
          status: 403,
        },
      );
    }

    const payments =
      await prisma.shippingPayment.findMany({
        where: {
          adminDeletedAt: null,

          status: {
            in: ["APPROVED", "REJECTED"],
          },
        },

        include: {
          shipment: {
            include: {
              parcelBatch: true,

              order: {
                select: {
                  id: true,
                  userId: true,

                  user: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const history =
      payments.map((payment) => {
        const shipment =
          payment.shipment;

        const isDomestic =
          shipment.shipmentType ===
          "DOMESTIC";

        return {
          paymentId: payment.id,

          receiptGroupId:
            payment.receiptGroupId ??
            payment.id,

          status: payment.status,

          amount: payment.amount,

          receiptImage:
            payment.receiptImage,

          rejectionReason:
            payment.rejectionReason,

          adminNote:
            payment.adminNote,

          createdAt:
            payment.createdAt.toISOString(),

          reviewedAt:
            payment.reviewedAt
              ? payment.reviewedAt.toISOString()
              : null,

          shipmentId:
            shipment.id,

          orderId:
            shipment.orderId,

          type: isDomestic
            ? "DOMESTIC_BATCH"
            : "FREIGHT",

          parcelBatchId:
            shipment.parcelBatchId,

          shippingCost:
            shipment.parcelBatch
              ?.shippingCost ??
            null,

          freightCostToman:
            shipment.freightCostToman,

          user: shipment.order.user
            ? {
                id:
                  shipment.order.user.id,

                username:
                  shipment.order.user
                    .username,

                email:
                  shipment.order.user
                    .email,
              }
            : null,
        };
      });

    return NextResponse.json({
      history,
    });
  } catch (error) {
    console.error(
      "GET ADMIN SHIPPING PAYMENT HISTORY ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "خطا در دریافت تاریخچه پرداخت‌ها",
      },
      {
        status: 500,
      },
    );
  }
}