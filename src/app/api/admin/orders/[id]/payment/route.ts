/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
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

    const { id: orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        {
          error: "شناسه سفارش ارسال نشده است",
        },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { action, adminNote, rejectionReason } = body;

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        {
          error: "عملیات نامعتبر است",
        },
        { status: 400 },
      );
    }

    if (
      action === "REJECT" &&
      (!rejectionReason ||
        typeof rejectionReason !== "string" ||
        rejectionReason.trim() === "")
    ) {
      return NextResponse.json(
        {
          error: "برای رد کردن پرداخت، دلیل رد را وارد کنید",
        },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
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

      if (
        order.paymentStatus !== "REVIEW" ||
        order.status !== "WAITING_CONFIRMATION" ||
        order.payment.status !== "PENDING"
      ) {
        throw new Error("این سفارش در وضعیت قابل بررسی قرار ندارد");
      }

      if (action === "APPROVE") {
        for (const item of order.items) {
          if (item.availabilityType !== "IN_STOCK") {
            continue;
          }

          const product = await tx.product.findUnique({
            where: {
              id: item.productId,
            },
          });

          if (!product) {
            throw new Error(`محصول "${item.name}" پیدا نشد`);
          }

          if (!product.isAvailable) {
            throw new Error(`محصول "${product.name}" قابل فروش نیست`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`موجودی "${product.name}" کافی نیست`);
          }

          const updatedProduct = await tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          if (updatedProduct.stock <= 0) {
            await tx.product.update({
              where: {
                id: updatedProduct.id,
              },
              data: {
                isAvailable: false,
              },
            });
          }
        }

        const payment = await tx.payment.update({
          where: {
            id: order.payment.id,
          },
          data: {
            status: "APPROVED",
            adminNote:
              typeof adminNote === "string" && adminNote.trim() !== ""
                ? adminNote.trim()
                : null,
            rejectionReason: null,
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
                status:
                  order.shippingPaymentMode === "DEFERRED"
                    ? "PENDING"
                    : "READY_TO_SHIP",
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

        const updatedOrder = await tx.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
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

        return {
          action: "APPROVED",
          payment,
          order: updatedOrder,
        };
      }

      const payment = await tx.payment.update({
        where: {
          id: order.payment.id,
        },
        data: {
          status: "REJECTED",
          rejectionReason: rejectionReason.trim(),
          adminNote:
            typeof adminNote === "string" && adminNote.trim() !== ""
              ? adminNote.trim()
              : null,
          reviewedAt: new Date(),
        },
      });

      const updatedOrder = await tx.order.update({
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
            },
          },
        },
      });

      return {
        action: "REJECTED",
        payment,
        order: updatedOrder,
      };
    });

    if (result.action === "APPROVED") {
      return NextResponse.json(
        {
          success: true,
          action: "APPROVED",
          order: result.order,
          message:
            "پرداخت با موفقیت تأیید شد و مرسوله‌ها بر اساس نوع تأمین وارد مرحله مربوطه شدند.",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        action: "REJECTED",
        order: result.order,
        message: "پرداخت رد شد و سفارش به حالت در انتظار پرداخت بازگشت.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("ADMIN PAYMENT REVIEW ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message ?? "خطا در بررسی پرداخت",
      },
      { status: 500 },
    );
  }
}