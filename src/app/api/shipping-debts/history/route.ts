import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        {
          status: 401,
        },
      );
    }

    const payments =
      await prisma.shippingPayment.findMany({
        where: {
          userDeletedAt: null,

          status: {
            in: ["APPROVED", "REJECTED"],
          },

          shipment: {
            order: {
              userId: user.id,
            },
          },
        },

        include: {
          shipment: {
            include: {
              parcelBatch: {
                include: {
                  shipments: {
                    include: {
                      order: {
                        select: {
                          id: true,
                          createdAt: true,
                        },
                      },

                      items: {
                        include: {
                          orderItem: {
                            select: {
                              id: true,
                              name: true,
                              price: true,
                              selectedColor: true,
                              selectedSize: true,
                              selectedNumber: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },

              order: {
                select: {
                  id: true,
                  createdAt: true,
                  userId: true,
                },
              },

              items: {
                include: {
                  orderItem: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                      selectedColor: true,
                      selectedSize: true,
                      selectedNumber: true,
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

    const history = payments.map((payment) => {
      const shipment = payment.shipment;

      const isDomestic =
        shipment.shipmentType === "DOMESTIC";

      const sourceShipments = isDomestic
        ? shipment.parcelBatch?.shipments ?? [shipment]
        : [shipment];

      const orderMap = new Map<
        string,
        {
          orderId: string;
          createdAt: Date;
          products: Map<
            string,
            {
              orderItemId: string;
              name: string;
              quantity: number;
              price: number;
              selectedColor: string | null;
              selectedSize: string | null;
              selectedNumber: string | null;
            }
          >;
        }
      >();

      for (const sourceShipment of sourceShipments) {
        const orderId = sourceShipment.order.id;

        let order = orderMap.get(orderId);

        if (!order) {
          order = {
            orderId,
            createdAt: sourceShipment.order.createdAt,
            products: new Map(),
          };

          orderMap.set(orderId, order);
        }

        for (const item of sourceShipment.items) {
          const orderItem = item.orderItem;

          const existingProduct =
            order.products.get(orderItem.id);

          if (existingProduct) {
            existingProduct.quantity += item.quantity;
          } else {
            order.products.set(orderItem.id, {
              orderItemId: orderItem.id,
              name: orderItem.name,
              quantity: item.quantity,
              price: orderItem.price,
              selectedColor:
                orderItem.selectedColor,
              selectedSize:
                orderItem.selectedSize,
              selectedNumber:
                orderItem.selectedNumber,
            });
          }
        }
      }

      const orders = Array.from(orderMap.values()).map(
        (order) => ({
          orderId: order.orderId,

          createdAt:
            order.createdAt.toISOString(),

          products: Array.from(
            order.products.values(),
          ),
        }),
      );

      const productCount = orders.reduce(
        (sum, order) =>
          sum + order.products.length,
        0,
      );

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

        shipmentId: shipment.id,

        orderId: shipment.orderId,

        type: isDomestic
          ? "DOMESTIC_BATCH"
          : "FREIGHT",

        parcelBatchId:
          shipment.parcelBatchId,

        shippingCost:
          shipment.parcelBatch
            ?.shippingCost ?? null,

        totalVolume:
          shipment.parcelBatch
            ?.totalVolume ?? null,

        freightCostToman:
          shipment.freightCostToman,

        actualWeightGram:
          shipment.actualWeightGram,

        freightRateYuan:
          shipment.freightRateYuan,

        yuanExchangeRate:
          shipment.yuanExchangeRate,

        orders,

        orderCount: orders.length,

        productCount,
      };
    });

    return NextResponse.json({
      history,
    });
  } catch (error) {
    console.error(
      "GET USER SHIPPING PAYMENT HISTORY ERROR:",
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