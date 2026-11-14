import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }
    const importedShipments = await prisma.orderShipment.findMany({
      where: {
        order: {
          userId: user.id,
        },
        shipmentType: "IMPORTED",
        freightPaymentStatus: "AWAITING_USER_PAYMENT",
        freightCostToman: {
          gt: 0,
        },
      },

      include: {
        shippingPayments: {
          where: {
            status: {
              in: ["PENDING", "REJECTED"],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            status: true,
            rejectionReason: true,
            createdAt: true,
          },
        },

        order: {
          select: {
            id: true,
            createdAt: true,
            status: true,
            paymentStatus: true,
            items: {
              select: {
                id: true,
                name: true,
                quantity: true,
                price: true,
                selectedColor: true,
                selectedSize: true,
                selectedNumber: true,
                shippingClass: true,
                volume: true,
                volumeUnit: true,
                availabilityType: true,
              },
            },
          },
        },

        items: {
          include: {
            orderItem: {
              select: {
                id: true,
                name: true,
                quantity: true,
                price: true,
                selectedColor: true,
                selectedSize: true,
                selectedNumber: true,
                shippingClass: true,
                volume: true,
                volumeUnit: true,
                availabilityType: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    const freightDebts = importedShipments
      .map((shipment) => {
        const freightDue = shipment.freightCostToman ?? 0;
        const latestPayment = shipment.shippingPayments[0] ?? null;

        const shipmentItems = shipment.items.map((shipmentItem) => ({
          orderItemId: shipmentItem.orderItem.id,
          quantity: shipmentItem.quantity,

          name: shipmentItem.orderItem.name,
          price: shipmentItem.orderItem.price,

          selectedColor: shipmentItem.orderItem.selectedColor,
          selectedSize: shipmentItem.orderItem.selectedSize,
          selectedNumber: shipmentItem.orderItem.selectedNumber,

          shippingClass: shipmentItem.orderItem.shippingClass,
          volume: shipmentItem.orderItem.volume,
          volumeUnit: shipmentItem.orderItem.volumeUnit,
          availabilityType: shipmentItem.orderItem.availabilityType,
        }));

        return {
          type: "FREIGHT" as const,

          shipmentId: shipment.id,
          orderId: shipment.orderId,

          orderCreatedAt: shipment.order.createdAt,
          orderStatus: shipment.order.status,

          orderPaymentStatus: shipment.order.paymentStatus,

          shipmentType: shipment.shipmentType,
          shipmentStatus: shipment.status,

          freightCostToman: freightDue,
          totalDue: freightDue,

          actualWeightGram: shipment.actualWeightGram,
          freightRateYuan: shipment.freightRateYuan,
          yuanExchangeRate: shipment.yuanExchangeRate,

          paymentStatus: latestPayment?.status ?? null,

          rejectionReason:
            latestPayment?.status === "REJECTED"
              ? latestPayment.rejectionReason
              : null,

          items:
            shipmentItems.length > 0
              ? shipmentItems
              : shipment.order.items
                  .filter((item) => item.availabilityType === "PRE_ORDER")
                  .map((item) => ({
                    orderItemId: item.id,
                    quantity: item.quantity,

                    name: item.name,
                    price: item.price,

                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize,
                    selectedNumber: item.selectedNumber,

                    shippingClass: item.shippingClass,
                    volume: item.volume,
                    volumeUnit: item.volumeUnit,
                    availabilityType: item.availabilityType,
                  })),
        };
      })
      .filter((debt) => debt.totalDue > 0);
    const unbatchedDomesticShipments = await prisma.orderShipment.findMany({
      where: {
        order: {
          userId: user.id,
        },

        shipmentType: "DOMESTIC",

        parcelBatchId: null,

        shippingPaymentStatus: "NOT_REQUIRED",
      },

      include: {
        order: {
          select: {
            id: true,
            createdAt: true,
            status: true,
            paymentStatus: true,
            items: {
              select: {
                id: true,
                name: true,
                quantity: true,
                price: true,

                selectedColor: true,
                selectedSize: true,
                selectedNumber: true,

                shippingClass: true,
                volume: true,
                volumeUnit: true,
                availabilityType: true,
              },
            },
          },
        },

        items: {
          include: {
            orderItem: {
              select: {
                id: true,
                name: true,
                quantity: true,
                price: true,

                selectedColor: true,
                selectedSize: true,
                selectedNumber: true,

                shippingClass: true,
                volume: true,
                volumeUnit: true,
                availabilityType: true,
              },
            },
          },
        },
      },

      orderBy: {
        shippingDueAt: "asc",
      },
    });

    const availableDomesticOrders = unbatchedDomesticShipments.map(
      (shipment) => {
        const items =
          shipment.items.length > 0
            ? shipment.items.map((shipmentItem) => {
                const item = shipmentItem.orderItem;

                return {
                  orderItemId: item.id,
                  quantity: shipmentItem.quantity,

                  name: item.name,
                  price: item.price,

                  selectedColor: item.selectedColor,
                  selectedSize: item.selectedSize,
                  selectedNumber: item.selectedNumber,

                  shippingClass: item.shippingClass,
                  volume: item.volume,
                  volumeUnit: item.volumeUnit,
                  availabilityType: item.availabilityType,
                };
              })
            : shipment.order.items
                .filter((item) => item.availabilityType === "IN_STOCK")
                .map((item) => ({
                  orderItemId: item.id,
                  quantity: item.quantity,

                  name: item.name,
                  price: item.price,

                  selectedColor: item.selectedColor,
                  selectedSize: item.selectedSize,
                  selectedNumber: item.selectedNumber,

                  shippingClass: item.shippingClass,
                  volume: item.volume,
                  volumeUnit: item.volumeUnit,
                  availabilityType: item.availabilityType,
                }));
        return {
          type: "DOMESTIC_UNBATCHED" as const,

          shipmentId: shipment.id,
          orderId: shipment.orderId,

          createdAt: shipment.order.createdAt,
          status: shipment.order.status,

          orderPaymentStatus: shipment.order.paymentStatus,

          shippingDueAt: shipment.shippingDueAt,

          items,
        };
      },
    );
    const domesticBatches = await prisma.domesticParcelBatch.findMany({
      where: {
        userId: user.id,

        status: {
          in: ["OPEN", "AWAITING_PAYMENT"],
        },

        shippingCost: {
          gt: 0,
        },
      },

      include: {
        shipments: {
          where: {
            shipmentType: "DOMESTIC",
          },

          include: {
            shippingPayments: {
              where: {
                status: {
                  in: ["PENDING", "REJECTED"],
                },
              },

              orderBy: {
                createdAt: "desc",
              },

              select: {
                id: true,
                status: true,
                rejectionReason: true,
                createdAt: true,
              },
            },

            order: {
              select: {
                id: true,
                createdAt: true,
                status: true,
                paymentStatus: true,

                items: {
                  select: {
                    id: true,
                    name: true,
                    quantity: true,
                    price: true,

                    selectedColor: true,
                    selectedSize: true,
                    selectedNumber: true,

                    shippingClass: true,
                    volume: true,
                    volumeUnit: true,
                    availabilityType: true,
                  },
                },
              },
            },

            items: {
              include: {
                orderItem: {
                  select: {
                    id: true,
                    name: true,
                    quantity: true,
                    price: true,

                    selectedColor: true,
                    selectedSize: true,
                    selectedNumber: true,

                    shippingClass: true,
                    volume: true,
                    volumeUnit: true,
                    availabilityType: true,
                  },
                },
              },
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    const batchDebts = domesticBatches.map((batch) => {
      const ordersMap = new Map<
        string,
        {
          orderId: string;
          createdAt: Date;
          status: string;
          orderPaymentStatus: string;
          shippingDueAt: Date | null;
          items: Array<{
            orderItemId: string;
            quantity: number;
            name: string;
            price: number;
            selectedColor: string | null;
            selectedSize: string | null;
            selectedNumber: string | null;
            shippingClass: string;
            volume: number | null;
            volumeUnit: string | null;
            availabilityType: string;
          }>;
        }
      >();

      for (const shipment of batch.shipments) {
        const orderId = shipment.order.id;

        let order = ordersMap.get(orderId);

        if (!order) {
          order = {
            orderId,
            createdAt: shipment.order.createdAt,
            status: shipment.order.status,
            shippingDueAt: shipment.shippingDueAt,
            orderPaymentStatus: shipment.order.paymentStatus,
            items: [],
          };

          ordersMap.set(orderId, order);
        }

        for (const shipmentItem of shipment.items) {
          const item = shipmentItem.orderItem;

          order.items.push({
            orderItemId: item.id,
            quantity: shipmentItem.quantity,

            name: item.name,
            price: item.price,

            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            selectedNumber: item.selectedNumber,

            shippingClass: item.shippingClass,
            volume: item.volume,
            volumeUnit: item.volumeUnit,
            availabilityType: item.availabilityType,
          });
        }

        if (shipment.items.length === 0) {
          for (const item of shipment.order.items) {
            order.items.push({
              orderItemId: item.id,
              quantity: item.quantity,

              name: item.name,
              price: item.price,

              selectedColor: item.selectedColor,
              selectedSize: item.selectedSize,
              selectedNumber: item.selectedNumber,

              shippingClass: item.shippingClass,
              volume: item.volume,
              volumeUnit: item.volumeUnit,
              availabilityType: item.availabilityType,
            });
          }
        }
      }

      for (const order of ordersMap.values()) {
        const uniqueItems = new Map<string, (typeof order.items)[number]>();

        for (const item of order.items) {
          const existing = uniqueItems.get(item.orderItemId);

          if (existing) {
            existing.quantity += item.quantity;
          } else {
            uniqueItems.set(item.orderItemId, {
              ...item,
            });
          }
        }

        order.items = Array.from(uniqueItems.values());
      }

      const orders = Array.from(ordersMap.values()).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );

      const latestPayment =
        batch.shipments
          .flatMap((shipment) => shipment.shippingPayments)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ??
        null;

      return {
        type: "DOMESTIC_BATCH" as const,

        parcelBatchId: batch.id,

        status: batch.status,

        totalVolume: batch.totalVolume,

        totalDue: batch.shippingCost,

        paymentStatus: latestPayment?.status ?? null,

        rejectionReason:
          latestPayment?.status === "REJECTED"
            ? latestPayment.rejectionReason
            : null,

        createdAt: batch.createdAt,
        updatedAt: batch.updatedAt,

        orders,
      };
    });
    const domesticTotal = batchDebts.reduce(
      (sum, debt) => sum + debt.totalDue,
      0,
    );

    const freightTotal = freightDebts.reduce(
      (sum, debt) => sum + debt.totalDue,
      0,
    );

    const totalAmount = domesticTotal + freightTotal;
    return NextResponse.json({
      debts: [...batchDebts, ...availableDomesticOrders, ...freightDebts],

      totalAmount,

      summary: {
        domesticTotal,
        freightTotal,
        debtCount:
          batchDebts.length +
          availableDomesticOrders.length +
          freightDebts.length,
      },
    });
  } catch (error) {
    console.error("GET SHIPPING DEBTS ERROR:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت بدهی‌های ارسال",
      },
      {
        status: 500,
      },
    );
  }
}
