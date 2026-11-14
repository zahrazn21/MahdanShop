import { NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

type Params = {
  params: Promise<{ paymentId: string }>;
};

export async function PATCH(
  req: Request,
  { params }: Params,
) {
  try {
    const admin = await getCurrentUser();

    if (!admin) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 401 },
      );
    }

    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const { paymentId } = await params;

    if (!paymentId) {
      return NextResponse.json(
        { error: "شناسه پرداخت الزامی است" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const action = body?.action;

    const rejectionReason =
      typeof body?.rejectionReason === "string"
        ? body.rejectionReason.trim()
        : "";

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { error: "عملیات نامعتبر است" },
        { status: 400 },
      );
    }

    if (action === "REJECT" && !rejectionReason) {
      return NextResponse.json(
        { error: "دلیل رد رسید الزامی است" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.shippingPayment.findUnique({
        where: {
          id: paymentId,
        },
        include: {
          shipment: {
            include: {
              parcelBatch: true,
            },
          },
        },
      });

      if (!payment) {
        throw new Error("پرداخت ارسال پیدا نشد");
      }

      if (payment.status !== "PENDING") {
        throw new Error("این رسید قبلاً بررسی شده است");
      }

      const shipment = payment.shipment;

      if (!shipment) {
        throw new Error(
          "مرسوله مربوط به این پرداخت پیدا نشد",
        );
      }
      const now = new Date();
      if (action === "REJECT") {
        await tx.shippingPayment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: "REJECTED",
            rejectionReason,
            reviewedAt: now,
          },
        });
        if (shipment.shipmentType === "IMPORTED") {
          await tx.orderShipment.update({
            where: {
              id: shipment.id,
            },
            data: {
              freightPaymentStatus:
                "AWAITING_USER_PAYMENT",
              freightReceiptImage: null,
            },
          });
        }

        return {
          paymentId: payment.id,
          amount: payment.amount,
        };
      }
      if (shipment.shipmentType === "DOMESTIC") {
        if (!shipment.parcelBatchId) {
          throw new Error(
            `مرسوله ${shipment.id} به بسته ارسال داخلی متصل نیست`,
          );
        }

        const parcelBatch =
          await tx.domesticParcelBatch.findUnique({
            where: {
              id: shipment.parcelBatchId,
            },
          });

        if (!parcelBatch) {
          throw new Error(
            `بسته ارسال داخلی ${shipment.parcelBatchId} پیدا نشد`,
          );
        }

        if (parcelBatch.status === "PAID") {
          throw new Error(
            `بسته ارسال داخلی ${parcelBatch.id} قبلاً پرداخت شده است`,
          );
        }

        if (
          parcelBatch.status !== "OPEN" &&
          parcelBatch.status !== "AWAITING_PAYMENT"
        ) {
          throw new Error(
            `بسته ارسال داخلی ${parcelBatch.id} در وضعیت قابل پرداخت نیست`,
          );
        }

        if (parcelBatch.shippingCost <= 0) {
          throw new Error(
            `هزینه ارسال بسته ${parcelBatch.id} معتبر نیست`,
          );
        }

        await tx.domesticParcelBatch.update({
          where: {
            id: parcelBatch.id,
          },
          data: {
            status: "PAID",
            paidAt: now,
          },
        });

        await tx.orderShipment.updateMany({
          where: {
            parcelBatchId: parcelBatch.id,
            shipmentType: "DOMESTIC",
          },
          data: {
            shippingPaymentStatus: "PAID",
            shippingPaidAt: now,
            status: "READY_TO_SHIP",
          },
        });

        await tx.shippingPayment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: "APPROVED",
            rejectionReason: null,
            reviewedAt: now,
          },
        });

        return {
          paymentId: payment.id,
          amount: payment.amount,
        };
      }

      if (shipment.shipmentType === "IMPORTED") {
        if (
          shipment.freightPaymentStatus !==
            "AWAITING_USER_PAYMENT" &&
          shipment.freightPaymentStatus !== "PENDING"
        ) {
          throw new Error(
            `هزینه باربری مرسوله ${shipment.id} در وضعیت قابل پرداخت نیست`,
          );
        }

        const freightCost =
          shipment.freightCostToman ?? 0;

        if (freightCost <= 0) {
          throw new Error(
            `هزینه نهایی باربری مرسوله ${shipment.id} معتبر نیست`,
          );
        }

        await tx.orderShipment.update({
          where: {
            id: shipment.id,
          },
          data: {
            freightPaymentStatus: "PAID",
          },
        });

        await tx.shippingPayment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: "APPROVED",
            rejectionReason: null,
            reviewedAt: now,
          },
        });

        return {
          paymentId: payment.id,
          amount: payment.amount,
        };
      }

      throw new Error(
        `ساختار پرداخت ${payment.id} نامعتبر است`,
      );
    });

    return NextResponse.json({
      success: true,
      action,
      paymentId: result.paymentId,
      amount: result.amount,
    });
  } catch (error) {
    console.error(
      "ADMIN SHIPPING PAYMENT REVIEW ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در بررسی رسید",
      },
      { status: 500 },
    );
  }
}

