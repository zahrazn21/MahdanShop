import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import { computeStockAndAvailability } from "@/src/shared/lib/productAvailability";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

type ProductVariantJson = {
  id: string;
  name: string;
  hexCode?: string;
  colorName?: string;
  stock: number;
  price: number;
  originalPrice?: number;
  size?: string;
  volume?: number;
  volumeUnit?: "ml" | "gr" | "oz";
  sku?: string;
  images?: string[];
};

export async function POST(
  _req: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "احراز هویت انجام نشده است" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const { id: orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { error: "شناسه سفارش ارسال نشده است" },
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
        throw new Error(
          "برای این سفارش اطلاعات پرداخت وجود ندارد",
        );
      }

      if (order.payment.status !== "PENDING") {
        throw new Error(
          "این پرداخت قبلاً بررسی شده است",
        );
      }

      if (order.paymentStatus !== "REVIEW") {
        throw new Error(
          "این سفارش در وضعیت بررسی پرداخت نیست",
        );
      }

      if (order.status !== "WAITING_CONFIRMATION") {
        throw new Error(
          "وضعیت سفارش برای تأیید پرداخت معتبر نیست",
        );
      }

      for (const item of order.items) {
        if (item.availabilityType === "PRE_ORDER") {
          continue;
        }

        if (item.availabilityType !== "IN_STOCK") {
          continue;
        }

        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new Error(
            `محصول "${item.name}" پیدا نشد`,
          );
        }

        if (product.status !== "ACTIVE") {
          throw new Error(
            `محصول "${product.name}" فعال نیست`,
          );
        }

        if (!product.isAvailable) {
          throw new Error(
            `محصول "${product.name}" قابل فروش نیست`,
          );
        }

        if (item.variantId) {
          const variants = Array.isArray(product.variants)
            ? (product.variants as unknown as ProductVariantJson[])
            : [];

          const variantIndex = variants.findIndex(
            (variant) =>
              variant.id === item.variantId,
          );

          if (variantIndex === -1) {
            throw new Error(
              `تنوع انتخاب‌شده برای "${item.name}" پیدا نشد`,
            );
          }

          const variant = variants[variantIndex];

          const currentStock = Number(
            variant.stock ?? 0,
          );

          if (currentStock < item.quantity) {
            throw new Error(
              `موجودی تنوع "${variant.name}" برای "${item.name}" کافی نیست`,
            );
          }

          const updatedVariants = variants.map(
            (currentVariant, index) => {
              if (index !== variantIndex) {
                return currentVariant;
              }

              return {
                ...currentVariant,
                stock:
                  Number(currentVariant.stock ?? 0) -
                  item.quantity,
              };
            },
          );

          
          const { stock: recomputedStock, isAvailable: recomputedIsAvailable } =
            computeStockAndAvailability({
              availabilityType: "IN_STOCK",
              baseStock: product.stock,
              variants: updatedVariants,
            });

          await tx.product.update({
            where: {
              id: product.id,
            },

            data: {
              variants: updatedVariants,
              stock: recomputedStock,
              isAvailable: recomputedIsAvailable,
            },
          });

          continue;
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `موجودی محصول "${product.name}" کافی نیست`,
          );
        }

        const newStock =
          product.stock - item.quantity;

        await tx.product.update({
          where: {
            id: product.id,
          },

          data: {
            stock: newStock,
            isAvailable: newStock > 0,
          },
        });
      }
      await tx.payment.update({
        where: {
          id: order.payment.id,
        },

        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          rejectionReason: null,
        },
      });
      for (const shipment of order.shipments) {
        if (shipment.shipmentType === "DOMESTIC") {
          const isDeferred =
            order.shippingPaymentMode === "DEFERRED";

          await tx.orderShipment.update({
            where: {
              id: shipment.id,
            },

            data: {
              status: isDeferred
                ? "PENDING"
                : "READY_TO_SHIP",
              shippingPaymentStatus: isDeferred
                ? "NOT_REQUIRED"
                : "PAID",

              shippingPaidAt: isDeferred
                ? null
                : new Date(),

              freightPaymentStatus:
                "NOT_REQUIRED",
            },
          });

          continue;
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

      const updatedOrder =
        await tx.order.update({
          where: {
            id: order.id,
          },

          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },

          include: {
            payment: true,

            shipments: true,
          },
        });

      return updatedOrder;
    });
    const verifiedOrder =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },

        select: {
          id: true,
          paymentStatus: true,
          status: true,

          payment: {
            select: {
              status: true,
              reviewedAt: true,
            },
          },
        },
      });

    if (!verifiedOrder) {
      throw new Error(
        "سفارش بعد از تأیید پیدا نشد",
      );
    }
    return NextResponse.json(
      {
        success: true,
        action: "APPROVED",

        message:
          "پرداخت با موفقیت تأیید شد و موجودی محصولات بروزرسانی شد.",

        paymentStatus:
          verifiedOrder.paymentStatus,

        orderStatus:
          verifiedOrder.status,

        paymentReviewStatus:
          verifiedOrder.payment?.status,

        order: result,
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error(
      "ADMIN APPROVE PAYMENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در تأیید پرداخت",
      },
      {
        status: 500,
      },
    );
  }
}