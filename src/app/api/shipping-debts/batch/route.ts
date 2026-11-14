import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import {
  getDomesticVolume,
  getShippingTierCost,
} from "@/src/shared/lib/shipping/calculateDomesticShipping";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "ابتدا وارد حساب کاربری شوید",
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const rawShipmentIds: unknown[] = Array.isArray(body?.shipmentIds)
      ? body.shipmentIds
      : [];

    const uniqueShipmentIds: string[] = Array.from(
      new Set(
        rawShipmentIds.filter(
          (id): id is string =>
            typeof id === "string" && id.trim().length > 0,
        ),
      ),
    );

    if (uniqueShipmentIds.length === 0) {
      return NextResponse.json(
        {
          error: "حداقل یک سفارش را برای تجمیع انتخاب کنید",
        },
        { status: 400 },
      );
    }
    const result = await prisma.$transaction(async (tx) => {
      const shipments = await tx.orderShipment.findMany({
        where: {
          id: {
            in: uniqueShipmentIds,
          },

          shipmentType: "DOMESTIC",

          parcelBatchId: null,

          shippingPaymentStatus: "NOT_REQUIRED",

          order: {
            userId: user.id,
          },
        },

        include: {
          order: {
            select: {
              paymentStatus: true,
            },
          },

          items: {
            select: {
              quantity: true,

              orderItem: {
                select: {
                  shippingClass: true,
                  availabilityType: true,
                },
              },
            },
          },
        },
      });

      if (shipments.length !== uniqueShipmentIds.length) {
        throw new Error(
          "یکی از سفارش‌های انتخاب‌شده قابل تجمیع نیست",
        );
      }

      if (shipments.length === 0) {
        throw new Error(
          "هیچ سفارش داخلی قابل تجمیعی پیدا نشد",
        );
      }
      const unpaidShipment = shipments.find(
        (shipment) => shipment.order.paymentStatus !== "PAID",
      );

      if (unpaidShipment) {
        throw new Error(
          "ابتدا هزینه محصولات همه سفارش‌های انتخاب‌شده را پرداخت و تأیید کنید؛ سپس می‌توانید هزینه ارسال را تجمیع کنید.",
        );
      }
      const invalidShipment = shipments.find((shipment) => {
        if (shipment.items.length === 0) {
          return true;
        }

        return shipment.items.some(
          (shipmentItem) =>
            shipmentItem.orderItem.availabilityType !== "IN_STOCK",
        );
      });

      if (invalidShipment) {
        throw new Error(
          "یکی از سفارش‌های انتخاب‌شده محصول داخلی معتبر ندارد",
        );
      }
      const volumeItems = shipments.flatMap((shipment) =>
        shipment.items.map((shipmentItem) => ({
          shippingClass: shipmentItem.orderItem.shippingClass,
          quantity: shipmentItem.quantity,
        })),
      );

      const totalVolume = getDomesticVolume(volumeItems);

      if (!Number.isFinite(totalVolume) || totalVolume <= 0) {
        throw new Error(
          "حجم ارسال داخلی سفارش‌های انتخاب‌شده معتبر نیست",
        );
      }
      const shippingCost = await getShippingTierCost(
        tx,
        totalVolume,
      );

      if (
        !Number.isFinite(shippingCost) ||
        shippingCost <= 0
      ) {
        throw new Error("هزینه ارسال محاسبه نشد");
      }
      const shippingDueAt =
        shipments
          .map((shipment) => shipment.shippingDueAt)
          .filter(
            (date): date is Date => date instanceof Date,
          )
          .sort(
            (a, b) =>
              a.getTime() - b.getTime(),
          )[0] ?? null;
      const batch =
        await tx.domesticParcelBatch.create({
          data: {
            userId: user.id,

            status: "OPEN",

            totalVolume,

            shippingCost,

            shippingDueAt,
          },
        });
      await tx.orderShipment.updateMany({
        where: {
          id: {
            in: uniqueShipmentIds,
          },

          order: {
            userId: user.id,
          },

          shipmentType: "DOMESTIC",

          parcelBatchId: null,
        },

        data: {
          parcelBatchId: batch.id,
        },
      });

      return {
        batch,

        shipmentIds: uniqueShipmentIds,
      };
    });

    return NextResponse.json(
      {
        success: true,

        parcelBatchId: result.batch.id,

        totalVolume: result.batch.totalVolume,

        totalDue: result.batch.shippingCost,

        shippingDueAt: result.batch.shippingDueAt,

        shipmentIds: result.shipmentIds,

        message:
          "سفارش‌های انتخاب‌شده با موفقیت تجمیع شدند",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "CREATE DOMESTIC PARCEL BATCH ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در ایجاد بسته ارسال داخلی",
      },
      { status: 500 },
    );
  }
}