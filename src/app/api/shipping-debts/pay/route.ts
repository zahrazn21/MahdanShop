import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "ابتدا وارد شوید",
        },
        {
          status: 401,
        },
      );
    }
    const body = await req.json();
    const rawParcelBatchIds: unknown[] = Array.isArray(
      body?.parcelBatchIds,
    )
      ? body.parcelBatchIds
      : [];

    const rawShipmentIds: unknown[] = Array.isArray(
      body?.shipmentIds,
    )
      ? body.shipmentIds
      : [];

    const uniqueParcelBatchIds: string[] = Array.from(
      new Set(
        rawParcelBatchIds.filter(
          (id): id is string =>
            typeof id === "string" && id.trim().length > 0,
        ),
      ),
    );

    const uniqueShipmentIds: string[] = Array.from(
      new Set(
        rawShipmentIds.filter(
          (id): id is string =>
            typeof id === "string" && id.trim().length > 0,
        ),
      ),
    );

    const receiptImage = body?.receiptImage;

    if (
      typeof receiptImage !== "string" ||
      !receiptImage.trim()
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

    if (
      uniqueParcelBatchIds.length === 0 &&
      uniqueShipmentIds.length === 0
    ) {
      return NextResponse.json(
        {
          error: "حداقل یک بدهی باید انتخاب شود",
        },
        {
          status: 400,
        },
      );
    }
    const normalizedReceiptImage = receiptImage.trim();
    const receiptGroupId = crypto.randomUUID();
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      let count = 0;

      for (const parcelBatchId of uniqueParcelBatchIds) {
        const parcelBatch =
          await tx.domesticParcelBatch.findFirst({
            where: {
              id: parcelBatchId,

              userId: user.id,

              status: {
                in: ["OPEN", "AWAITING_PAYMENT"],
              },
            },

            include: {
              shipments: {
                where: {
                  shipmentType: "DOMESTIC",
                },

                include: {
                  order: {
                    select: {
                      paymentStatus: true,
                    },
                  },
                },

                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          });

        if (!parcelBatch) {
          throw new Error(
            `بسته ارسال داخلی ${parcelBatchId} پیدا نشد یا قابل پرداخت نیست`,
          );
        }

        const amount = parcelBatch.shippingCost;

        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error(
            `هزینه ارسال بسته ${parcelBatchId} معتبر نیست`,
          );
        }

        if (parcelBatch.shipments.length === 0) {
          throw new Error(
            `برای بسته ارسال داخلی ${parcelBatchId} هیچ مرسوله داخلی ثبت نشده است`,
          );
        }

        const unpaidShipment = parcelBatch.shipments.find(
          (shipment) =>
            shipment.order.paymentStatus !== "PAID",
        );

        if (unpaidShipment) {
          throw new Error(
            "تا زمانی که هزینه محصولات همه سفارش‌های این بسته پرداخت و تأیید نشده باشد، پرداخت هزینه ارسال امکان‌پذیر نیست.",
          );
        }    
        const paymentShipment =
          parcelBatch.shipments[0];
        const existingPending =
          await tx.shippingPayment.findFirst({
            where: {
              shipment: {
                parcelBatchId: parcelBatch.id,
              },

              status: "PENDING",
            },

            select: {
              id: true,
            },
          });

        if (existingPending) {
          throw new Error(
            "برای این بسته ارسال داخلی قبلاً رسیدی در انتظار بررسی ثبت شده است",
          );
        }

      
        await tx.shippingPayment.create({
          data: {
            shipmentId: paymentShipment.id,

            amount,

            status: "PENDING",

            receiptImage: normalizedReceiptImage,

            receiptGroupId,
          },
        });

        totalAmount += amount;
        count++;
      }

      for (const shipmentId of uniqueShipmentIds) {
        const shipment =
          await tx.orderShipment.findFirst({
            where: {
              id: shipmentId,

              order: {
                userId: user.id,
              },

              shipmentType: "IMPORTED",

              freightCostToman: {
                gt: 0,
              },

              freightPaymentStatus: {
                in: [
                  "AWAITING_USER_PAYMENT",
                  "PENDING",
                ],
              },
            },

            include: {
              order: {
                select: {
                  paymentStatus: true,
                },
              },
            },
          });

        if (!shipment) {
          throw new Error(
            `مرسوله وارداتی ${shipmentId} پیدا نشد یا قابل پرداخت نیست`,
          );
        }
        if (
          shipment.order.paymentStatus !== "PAID"
        ) {
          throw new Error(
            "ابتدا هزینه محصولات این سفارش را پرداخت و تأیید کنید؛ سپس هزینه باربری قابل پرداخت خواهد بود.",
          );
        }

        const amount =
          shipment.freightCostToman ?? 0;

        if (!Number.isFinite(amount) || amount <= 0) {
          throw new Error(
            `هزینه باربری مرسوله ${shipmentId} معتبر نیست`,
          );
        }


        const existingPending =
          await tx.shippingPayment.findFirst({
            where: {
              shipmentId: shipment.id,

              status: "PENDING",
            },

            select: {
              id: true,
            },
          });

        if (existingPending) {
          throw new Error(
            `برای مرسوله وارداتی ${shipmentId} قبلاً یک رسید در انتظار بررسی ثبت شده است`,
          );
        }
        await tx.shippingPayment.create({
          data: {
            shipmentId: shipment.id,

            amount,

            status: "PENDING",

            receiptImage: normalizedReceiptImage,

            receiptGroupId,
          },
        });

        totalAmount += amount;
        count++;
      }

      if (count === 0) {
        throw new Error(
          "هیچ بدهی معتبری برای پرداخت پیدا نشد",
        );
      }

      return {
        totalAmount,
        count,
        receiptGroupId,
      };
    });


    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "POST SHIPPING DEBT PAYMENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در ثبت پرداخت",
      },
      {
        status: 500,
      },
    );
  }
}