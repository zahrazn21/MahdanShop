/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";

import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import {
  getDomesticVolume,
  getShippingTierCost,
} from "@/src/shared/lib/shipping/calculateDomesticShipping";

type ShippingPaymentMode = "IMMEDIATE" | "DEFERRED";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "برای ثبت سفارش ابتدا وارد حساب کاربری شوید",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const {
      shippingInfo,
      paymentMethod,
      items,
      shippingPaymentMode = "IMMEDIATE",
      importedFreightAccepted = false,
    } = body;

    if (
      typeof shippingInfo.telegramId !== "string" ||
      !/^@[a-zA-Z0-9_]{5,32}$/.test(shippingInfo.telegramId.trim())
    ) {
      return NextResponse.json(
        {
          error: "آیدی تلگرام معتبر نیست",
        },
        { status: 400 },
      );
    }

    const normalizedShippingInfo = {
      ...shippingInfo,
      telegramId: shippingInfo.telegramId.trim(),
    };
    if (
      !shippingInfo ||
      !paymentMethod ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "اطلاعات سفارش ناقص است",
        },
        { status: 400 },
      );
    }

    if (paymentMethod !== "CARD_TO_CARD") {
      return NextResponse.json(
        {
          error: "روش پرداخت نامعتبر است",
        },
        { status: 400 },
      );
    }

    if (
      shippingPaymentMode !== "IMMEDIATE" &&
      shippingPaymentMode !== "DEFERRED"
    ) {
      return NextResponse.json(
        {
          error: "نحوه پرداخت هزینه ارسال نامعتبر است",
        },
        { status: 400 },
      );
    }

    if (typeof importedFreightAccepted !== "boolean") {
      return NextResponse.json(
        {
          error: "وضعیت تأیید شرایط باربری وارداتی نامعتبر است",
        },
        { status: 400 },
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const productsMap: Record<string, any> = {};

      let subtotal = 0;
      let discount = 0;

      let hasImportedItems = false;

      function getVariant(product: any, variantId?: string | null) {
        if (!variantId || !Array.isArray(product.variants)) {
          return null;
        }

        return product.variants.find(
          (variant: any) => variant.id === variantId,
        );
      }

      for (const item of items) {
        if (
          !item.productId ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new Error("اطلاعات یکی از محصولات نامعتبر است");
        }

        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },

          include: {
            batch: true,
          },
        });

        if (!product) {
          throw new Error("محصول پیدا نشد");
        }

        if (!product.isAvailable || product.status !== "ACTIVE") {
          throw new Error(`محصول "${product.name}" در حال حاضر قابل خرید نیست`);
        }

        const variant = getVariant(product, item.variantId);

        if (product.availabilityType === "IN_STOCK") {
          if (variant) {
            if ((variant.stock ?? 0) < item.quantity) {
              throw new Error(`موجودی "${product.name}" کافی نیست`);
            }
          } else {
            if (product.stock < item.quantity) {
              throw new Error(`موجودی "${product.name}" کافی نیست`);
            }
          }
        }

        if (product.availabilityType === "PRE_ORDER") {
          hasImportedItems = true;

          if (!product.batch) {
            throw new Error(
              `برای محصول وارداتی "${product.name}" دوره سفارش‌گیری مشخص نشده است`,
            );
          }

          if (product.batch.status !== "OPEN") {
            throw new Error(
              `دوره سفارش‌گیری محصول "${product.name}" در حال حاضر فعال نیست`,
            );
          }
        }

        productsMap[item.productId] = product;

        const itemPrice = variant?.price ?? product.price;

        subtotal += itemPrice * item.quantity;

        const originalPrice = variant?.originalPrice ?? product.originalPrice;

        if (originalPrice && originalPrice > itemPrice) {
          discount += (originalPrice - itemPrice) * item.quantity;
        }
      }

      if (hasImportedItems && !importedFreightAccepted) {
        throw new Error(
          "برای ثبت سفارش محصول وارداتی، تأیید شرایط باربری وارداتی الزامی است",
        );
      }

      const productsFinalPrice = subtotal - discount;

      if (productsFinalPrice < 0) {
        throw new Error("مبلغ نهایی محصولات نامعتبر است");
      }

      const domesticItemsForShipping = items.filter((item) => {
        const product = productsMap[item.productId];

        return product.availabilityType === "IN_STOCK";
      });

      const domesticVolume = getDomesticVolume(
        domesticItemsForShipping.map((item) => ({
          shippingClass: productsMap[item.productId].shippingClass,
          quantity: item.quantity,
        })),
      );

      let shippingCost = 0;

      if (domesticVolume > 0 && shippingPaymentMode === "IMMEDIATE") {
        shippingCost = await getShippingTierCost(tx, domesticVolume);
      }

      const hasDomesticItems = domesticItemsForShipping.length > 0;

      const shippingToPayNow =
        hasDomesticItems && shippingPaymentMode === "IMMEDIATE"
          ? shippingCost
          : 0;

      const totalPrice = productsFinalPrice + shippingToPayNow;
      if (totalPrice < 0) {
        throw new Error("مبلغ نهایی سفارش نامعتبر است");
      }

      const importedFreightTermsVersion = hasImportedItems ? "1.0" : null;

      const importedFreightAcceptedAt = hasImportedItems ? new Date() : null;

      const newOrder = await tx.order.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          subtotal,

          shippingCost: shippingToPayNow,

          discount,

          tax: 0,

          totalPrice,

          paymentMethod: "CARD_TO_CARD",

          paymentStatus: "PENDING",

          status: "PENDING_PAYMENT",

          shippingInfo: normalizedShippingInfo,

          importedFreightAccepted: hasImportedItems ? true : false,

          importedFreightAcceptedAt,

          importedFreightTermsVersion,

          shippingPaymentMode,

          items: {
            create: items.map((item: any) => {
              const product = productsMap[item.productId];

              const variant = getVariant(product, item.variantId);

              return {
                productId: product.id,

                name: product.name,

                price: variant?.price ?? product.price,

                quantity: item.quantity,

                variantId: item.variantId ?? null,

                variantName: variant?.name ?? null,

                variantSize: variant?.size ?? null,

                variantVolume: variant?.volume ?? null,

                variantVolumeUnit: variant?.volumeUnit ?? null,

                selectedColor: item.selectedColor ?? null,

                selectedSize: item.selectedSize ?? null,

                selectedNumber: item.selectedNumber ?? null,

                shippingClass: product.shippingClass,

                image: product.image,

                availabilityType: product.availabilityType,

                estimatedDeliveryDays: product.estimatedDeliveryDays,

                batchNumber: product.batch?.batchNumber ?? null,
              };
            }),
          },

          payment: {
            create: {
              method: "CARD_TO_CARD",

              status: "PENDING",

              amount: totalPrice,
            },
          },
        },

        include: {
          items: true,
          payment: true,
        },
      });

      const domesticItems = newOrder.items.filter(
        (item) => item.availabilityType === "IN_STOCK",
      );

      if (domesticItems.length > 0) {
        const domesticSubtotal = domesticItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const shippingDueAt =
          shippingPaymentMode === "DEFERRED"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            : null;
        await tx.orderShipment.create({
          data: {
            orderId: newOrder.id,

            shipmentType: "DOMESTIC",

            status: "PENDING",

            subtotal: domesticSubtotal,

            shippingCost,

            shippingPaymentStatus:
              shippingPaymentMode === "IMMEDIATE" ? "PAID" : "NOT_REQUIRED",

            shippingDueAt,

            shippingPaidAt:
              shippingPaymentMode === "IMMEDIATE" ? new Date() : null,

            freightPaymentStatus: "NOT_REQUIRED",

            parcelBatchId: null,
            
            estimatedDeliveryDays: Math.max(
              ...domesticItems.map((item) => item.estimatedDeliveryDays ?? 7),
            ),

            items: {
              create: domesticItems.map((item) => ({
                orderItemId: item.id,

                quantity: item.quantity,
              })),
            },
          },
        });
      }

      const importedItems = newOrder.items.filter(
        (item) => item.availabilityType === "PRE_ORDER",
      );

      const importedItemsByBatch = new Map<string, typeof importedItems>();

      for (const item of importedItems) {
        const product = productsMap[item.productId];

        const batchId = product.batchId;

        if (!batchId) {
          throw new Error(`دوره تامین برای محصول "${item.name}" مشخص نیست`);
        }

        if (!importedItemsByBatch.has(batchId)) {
          importedItemsByBatch.set(batchId, []);
        }

        importedItemsByBatch.get(batchId)!.push(item);
      }

      for (const [batchId, batchItems] of importedItemsByBatch) {
        const importedSubtotal = batchItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        await tx.orderShipment.create({
          data: {
            orderId: newOrder.id,

            shipmentType: "IMPORTED",

            batchId,

            status: "WAITING_IMPORT",

            freightPaymentStatus: "PENDING",

            freightCostToman: null,

            actualWeightGram: null,

            freightRateYuan: null,

            yuanExchangeRate: null,

            freightReceiptImage: null,

            subtotal: importedSubtotal,

            shippingCost: null,

            shippingPaymentStatus: "NOT_REQUIRED",

            shippingDueAt: null,

            shippingPaidAt: null,

            estimatedDeliveryDays: Math.max(
              ...batchItems.map((item) => item.estimatedDeliveryDays ?? 90),
            ),

            items: {
              create: batchItems.map((item) => ({
                orderItemId: item.id,

                quantity: item.quantity,
              })),
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: user.id,
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,

        orderId: order.id,

        totalPrice: order.totalPrice,

        paymentStatus: order.paymentStatus,

        status: order.status,

        shippingCost: order.shippingCost,

        shippingPaymentMode,

        importedFreightAccepted: order.importedFreightAccepted,

        message:
          "سفارش با موفقیت ثبت شد. لطفاً مبلغ سفارش را کارت‌به‌کارت کنید.",
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error("ORDER CREATE ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message ?? "خطا در ثبت سفارش",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "برای مشاهده سفارش‌ها ابتدا وارد حساب کاربری شوید",
        },
        {
          status: 401,
        },
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },

      include: {
        items: true,

        payment: true,

        shipments: {
          include: {
            batch: true,

            parcelBatch: true,

            shippingPayments: {
              orderBy: {
                createdAt: "desc",
              },
            },

            items: {
              include: {
                orderItem: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت سفارش‌ها",
      },
      {
        status: 500,
      },
    );
  }
}
