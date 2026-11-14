import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      batchId: string;
    }>;
  },
) {
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


    const { batchId } = await params;

    if (!batchId) {
      return NextResponse.json(
        {
          error: "شناسه بسته ارسال نشده است",
        },
        {
          status: 400,
        },
      );
    }


    const body = await req.json();

    const action = body?.action;

    if (action !== "CLOSE") {
      return NextResponse.json(
        {
          error: "عملیات نامعتبر است",
        },
        {
          status: 400,
        },
      );
    }


    const batch =
      await prisma.domesticParcelBatch.findUnique({
        where: {
          id: batchId,
        },

        include: {
          shipments: {
            select: {
              id: true,
              shipmentType: true,
              status: true,
              shippingPaymentStatus: true,
              trackingNumber: true,
              shippingPaidAt: true,
            },
          },
        },
      });

    if (!batch) {
      return NextResponse.json(
        {
          error: "بسته ارسال داخلی پیدا نشد",
        },
        {
          status: 404,
        },
      );
    }


    if (batch.status !== "OPEN") {
      return NextResponse.json(
        {
          error: "این بسته قبلاً نهایی شده است",
          status: batch.status,
        },
        {
          status: 400,
        },
      );
    }


    if (batch.totalVolume <= 0) {
      return NextResponse.json(
        {
          error: "حجم بسته معتبر نیست",
        },
        {
          status: 400,
        },
      );
    }


    if (batch.shippingCost <= 0) {
      return NextResponse.json(
        {
          error:
            "هزینه ارسال این بسته هنوز محاسبه نشده است",
        },
        {
          status: 400,
        },
      );
    }

    const domesticShipments =
      batch.shipments.filter(
        (shipment) =>
          shipment.shipmentType === "DOMESTIC",
      );

    if (domesticShipments.length === 0) {
      return NextResponse.json(
        {
          error:
            "هیچ مرسوله داخلی برای این بسته ثبت نشده است",
        },
        {
          status: 400,
        },
      );
    }

    const alreadyShipped =
      domesticShipments.find(
        (shipment) =>
          shipment.status === "SHIPPED" ||
          shipment.status === "DELIVERED",
      );

    if (alreadyShipped) {
      return NextResponse.json(
        {
          error:
            "این بسته شامل مرسوله‌ای است که قبلاً ارسال یا تحویل شده و امکان نهایی‌سازی مجدد آن وجود ندارد",
        },
        {
          status: 400,
        },
      );
    }


    const now = new Date();

    const shippingDueAt = new Date(now);

    shippingDueAt.setDate(
      shippingDueAt.getDate() + 30,
    );


    const updatedBatch =
      await prisma.$transaction(async (tx) => {
    
        const updated =
          await tx.domesticParcelBatch.update({
            where: {
              id: batch.id,
            },

            data: {
              status: "AWAITING_PAYMENT",
              shippingDueAt,
            },
          });

    
        await tx.orderShipment.updateMany({
          where: {
            parcelBatchId: batch.id,
            shipmentType: "DOMESTIC",
          },

          data: {
            shippingPaymentStatus:
              "AWAITING_USER_PAYMENT",

            shippingDueAt,
            status: "PENDING",
            shippingPaidAt: null,
          },
        });

        return updated;
      });
    return NextResponse.json({
      success: true,

      message:
        "بسته ارسال با موفقیت برای پرداخت نهایی شد",

      batch: {
        id: updatedBatch.id,
        status: updatedBatch.status,
        totalVolume:
          updatedBatch.totalVolume,
        shippingCost:
          updatedBatch.shippingCost,
        shippingDueAt:
          updatedBatch.shippingDueAt,
      },
    });
  } catch (error) {
    console.error(
      "CLOSE DOMESTIC PARCEL BATCH ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "خطا در نهایی کردن بسته ارسال",
      },
      {
        status: 500,
      },
    );
  }
}
