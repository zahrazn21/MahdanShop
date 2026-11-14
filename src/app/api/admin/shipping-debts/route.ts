import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);

    const status =
      searchParams.get("status") ?? "PENDING";

    if (status !== "PENDING") {
      return NextResponse.json({
        groups: [],
      });
    }

    const payments =
      await prisma.shippingPayment.findMany({
        where: {
          status: "PENDING",
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

    const groupsMap = new Map<
      string,
      {
        receiptGroupId: string;
        receiptImage: string | null;
        createdAt: Date;
        totalAmount: number;
        items: Array<{
          paymentId: string;
          shipmentId: string;
          orderId: string;
          userId: string | null;
          username: string | null;
          email: string | null;
          amount: number;
          type:
            | "DOMESTIC_BATCH"
            | "FREIGHT";
          parcelBatchId: string | null;
          shippingDue: number;
          freightDue: number;
          shippingDueAt: Date | null;
        }>;
      }
    >();

    for (const payment of payments) {
      const shipment = payment.shipment;
      const key =
        payment.receiptGroupId ??
        payment.id;

      const isDomesticBatch =
        shipment.shipmentType ===
          "DOMESTIC" &&
        !!shipment.parcelBatchId &&
        !!shipment.parcelBatch;
      const isImportedFreight =
        shipment.shipmentType ===
          "IMPORTED" &&
        (shipment.freightCostToman ?? 0) > 0;

      let type:
        | "DOMESTIC_BATCH"
        | "FREIGHT";

      let shippingDue = 0;
      let freightDue = 0;

      let parcelBatchId:
        | string
        | null = null;

      let shippingDueAt:
        | Date
        | null = null;

      if (isDomesticBatch) {
        type = "DOMESTIC_BATCH";

        const batch =
          shipment.parcelBatch!;

        if (
          batch.status === "OPEN" ||
          batch.status ===
            "AWAITING_PAYMENT"
        ) {
          shippingDue =
            batch.shippingCost;
        }

        parcelBatchId = batch.id;

        shippingDueAt =
          batch.shippingDueAt;
      }

      else if (isImportedFreight) {
        type = "FREIGHT";
        freightDue =
          shipment.freightCostToman ?? 0;
      }
      else {

        continue;
      }
      const debtAmount =
        type === "DOMESTIC_BATCH"
          ? shippingDue
          : freightDue;

      if (debtAmount <= 0) {
        continue;
      }
      const item = {
        paymentId: payment.id,
        shipmentId:
          payment.shipmentId,
        orderId:
          shipment.orderId,
        userId:
          shipment.order.userId,
        username:
          shipment.order.user
            ?.username ?? null,
        email:
          shipment.order.user
            ?.email ?? null,
        amount: payment.amount,
        type,
        parcelBatchId,
        shippingDue,
        freightDue,
        shippingDueAt,
      };

      const existing =
        groupsMap.get(key);

      if (!existing) {
        groupsMap.set(key, {
          receiptGroupId: key,

          receiptImage:
            payment.receiptImage,

          createdAt:
            payment.createdAt,

          totalAmount:
            payment.amount,

          items: [item],
        });
      } else {
        existing.totalAmount +=
          payment.amount;

        existing.items.push(item);
      }
    }

    const groups = Array.from(
      groupsMap.values(),
    );

    return NextResponse.json({
      groups,
    });
  } catch (error) {
    console.error(
      "ADMIN GET SHIPPING DEBTS ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "خطا در دریافت رسیدهای ارسال",
      },
      {
        status: 500,
      },
    );
  }
}

