/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function GET() {
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

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },

        payment: true,

        items: true,

        shipments: {
          orderBy: {
            createdAt: "asc",
          },

          include: {
            batch: true,

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
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: unknown) {
    console.error("GET ADMIN ORDERS ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در دریافت سفارش‌ها",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "برای ثبت سفارش ابتدا وارد حساب کاربری شوید",
        },
        {
          status: 401,
        },
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
      !shippingInfo ||
      !paymentMethod ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error: "اطلاعات سفارش ناقص است",
        },
        {
          status: 400,
        },
      );
    }

    if (paymentMethod !== "CARD_TO_CARD") {
      return NextResponse.json(
        {
          error: "روش پرداخت نامعتبر است",
        },
        {
          status: 400,
        },
      );
    }

    if (
      shippingPaymentMode !== "IMMEDIATE" &&
      shippingPaymentMode !== "DEFERRED"
    ) {
      return NextResponse.json(
        {
          error: "نحوه پرداخت هزینه ارسال داخلی نامعتبر است",
        },
        {
          status: 400,
        },
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const productsMap: Record<string, any> = {};

      let subtotal = 0;
      let discount = 0;

      let domesticShippingVolume = 0;

      const volumeMap: Record<string, number> = {
        SMALL: 1,
        MEDIUM: 3,
        LARGE: 6,
      };

      function getVariant(
        product: any,
        variantId?: string | null,
      ) {
        if (!variantId || !Array.isArray(product.variants)) {
          return null;
        }

        return (
          product.variants.find(
            (variant: any) => variant?.id === variantId,
          ) ?? null
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

        if (product.status !== "ACTIVE" || !product.isAvailable) {
          throw new Error(
            `محصول "${product.name}" در حال حاضر قابل خرید نیست`,
          );
        }

        const variant = getVariant(product, item.variantId);

        if (item.variantId && !variant) {
          throw new Error(
            `تنوع انتخاب‌شده برای "${product.name}" پیدا نشد`,
          );
        }

        if (product.availabilityType === "PRE_ORDER") {
          if (!product.batchId || !product.batch) {
            throw new Error(
              `محصول وارداتی "${product.name}" به دوره سفارش‌گیری متصل نیست`,
            );
          }

          domesticShippingVolume +=
            (volumeMap[product.shippingClass] ?? 1) * item.quantity;
        }

        if (product.availabilityType === "IN_STOCK") {
          if (variant) {
            const variantStock = Number(variant.stock ?? 0);

            if (variantStock < item.quantity) {
              throw new Error(
                `موجودی تنوع "${variant.name}" برای "${product.name}" کافی نیست`,
              );
            }
          } else {
            if (product.stock < item.quantity) {
              throw new Error(
                `موجودی "${product.name}" کافی نیست`,
              );
            }
          }

          domesticShippingVolume +=
            (volumeMap[product.shippingClass] ?? 1) * item.quantity;
        }

        productsMap[item.productId] = product;

        const itemPrice = variant?.price ?? product.price;

        subtotal += itemPrice * item.quantity;

        const originalPrice =
          variant?.originalPrice ?? product.originalPrice;

        if (originalPrice && originalPrice > itemPrice) {
          discount +=
            (originalPrice - itemPrice) * item.quantity;
        }
      }

      const hasImportedItems = items.some((item: any) => {
        const product = productsMap[item.productId];

        return product?.availabilityType === "PRE_ORDER";
      });

      if (
        hasImportedItems &&
        importedFreightAccepted !== true
      ) {
        throw new Error(
          "برای خرید محصولات وارداتی، پذیرش شرایط باربری وارداتی الزامی است",
        );
      }

      let shippingCost = 0;

      let packageType: "SMALL" | "MEDIUM" | "LARGE" = "SMALL";

      let packageCount = 1;

      if (domesticShippingVolume > 0) {
        if (domesticShippingVolume <= 4) {
          packageType = "SMALL";
        } else if (domesticShippingVolume <= 10) {
          packageType = "MEDIUM";
        } else {
          packageType = "LARGE";

          packageCount = Math.ceil(
            domesticShippingVolume / 20,
          );
        }

        const shippingPrice =
          await tx.shippingPrice.findUnique({
            where: {
              class: packageType,
            },
          });

        if (!shippingPrice) {
          throw new Error(
            "قیمت ارسال برای این نوع بسته تعریف نشده است",
          );
        }

        shippingCost =
          shippingPrice.price * packageCount;
      }

      const shippingToPayNow =
        shippingPaymentMode === "IMMEDIATE"
          ? shippingCost
          : 0;

      const totalPrice = Math.max(
        0,
        subtotal + shippingToPayNow - discount,
      );

      const newOrder = await tx.order.create({
        data: {
          userId: user.id,

          subtotal,

          shippingCost: shippingToPayNow,

          discount,

          tax: 0,

          totalPrice,

          paymentMethod: "CARD_TO_CARD",

          paymentStatus: "PENDING",

          status: "PENDING_PAYMENT",

          shippingInfo,

          shippingPaymentMode,

          importedFreightAccepted:
            hasImportedItems ? true : false,

          importedFreightAcceptedAt:
            hasImportedItems ? new Date() : null,

          importedFreightTermsVersion:
            hasImportedItems ? "1.0" : null,

          items: {
            create: items.map((item: any) => {
              const product =
                productsMap[item.productId];

              const variant = getVariant(
                product,
                item.variantId,
              );

              return {
                productId: product.id,

                name: product.name,

                price:
                  variant?.price ?? product.price,

                quantity: item.quantity,

                variantId:
                  item.variantId ?? null,

                variantName:
                  variant?.name ?? null,

                variantSize:
                  variant?.size ?? null,

                variantVolume:
                  variant?.volume ?? null,

                variantVolumeUnit:
                  variant?.volumeUnit ?? null,

                selectedColor:
                  item.selectedColor ?? null,

                selectedSize:
                  item.selectedSize ?? null,

                selectedNumber:
                  item.selectedNumber ?? null,

                shippingClass:
                  product.shippingClass,

                image: product.image,

                availabilityType:
                  product.availabilityType,

                estimatedDeliveryDays:
                  product.estimatedDeliveryDays,

                batchNumber:
                  product.batch?.batchNumber ?? null,
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

      if (domesticShippingVolume > 0) {
        const domesticSubtotal =
          newOrder.items.reduce(
            (sum, item) =>
              sum + item.price * item.quantity,
            0,
          );

        await tx.orderShipment.create({
          data: {
            orderId: newOrder.id,

            shipmentType: "DOMESTIC",

            status: "PENDING",

            shippingCost,

            shippingPaymentStatus:
              shippingPaymentMode === "IMMEDIATE"
                ? "PAID"
                : "AWAITING_USER_PAYMENT",

            shippingDueAt:
              shippingPaymentMode === "DEFERRED"
                ? new Date(
                    Date.now() +
                      30 *
                        24 *
                        60 *
                        60 *
                        1000,
                  )
                : null,

            shippingPaidAt:
              shippingPaymentMode === "IMMEDIATE"
                ? new Date()
                : null,

            freightPaymentStatus:
              "NOT_REQUIRED",

            subtotal: domesticSubtotal,

            estimatedDeliveryDays:
              Math.max(
                ...newOrder.items.map(
                  (item) =>
                    item.estimatedDeliveryDays ??
                    7,
                ),
              ),

            items: {
              create: newOrder.items.map(
                (item) => ({
                  orderItemId: item.id,

                  quantity: item.quantity,
                }),
              ),
            },
          },
        });
      }

      const importedItems =
        newOrder.items.filter(
          (item) =>
            item.availabilityType ===
            "PRE_ORDER",
        );

      const importedByBatch =
        new Map<
          string,
          typeof importedItems
        >();

      for (const item of importedItems) {
        const product =
          productsMap[item.productId];

        const batchId = product?.batchId;

        if (!batchId) {
          throw new Error(
            `محصول "${item.name}" به دوره سفارش‌گیری متصل نیست`,
          );
        }

        const current =
          importedByBatch.get(batchId) ?? [];

        current.push(item);

        importedByBatch.set(
          batchId,
          current,
        );
      }

      for (const [
        batchId,
        batchItems,
      ] of importedByBatch) {
        const importedSubtotal =
          batchItems.reduce(
            (sum, item) =>
              sum + item.price * item.quantity,
            0,
          );

        await tx.orderShipment.create({
          data: {
            orderId: newOrder.id,

            shipmentType: "IMPORTED",

            batchId,

            status: "WAITING_IMPORT",

            freightPaymentStatus:
              "PENDING",

            freightCostToman: null,

            freightReceiptImage: null,

            subtotal: importedSubtotal,

            estimatedDeliveryDays:
              Math.max(
                ...batchItems.map(
                  (item) =>
                    item.estimatedDeliveryDays ??
                    90,
                ),
              ),

            items: {
              create: batchItems.map(
                (item) => ({
                  orderItemId: item.id,

                  quantity: item.quantity,
                }),
              ),
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

        paymentStatus:
          order.paymentStatus,

        status: order.status,

        shippingPaymentMode,

        message:
          shippingPaymentMode ===
          "DEFERRED"
            ? "سفارش با موفقیت ثبت شد. مبلغ محصولات را کارت‌به‌کارت کنید. هزینه ارسال داخلی بعداً پرداخت خواهد شد."
            : "سفارش با موفقیت ثبت شد. لطفاً مبلغ سفارش را کارت‌به‌کارت کنید.",
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    console.error(
      "CREATE ORDER ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در ثبت سفارش",
      },
      {
        status: 500,
      },
    );
  }
}