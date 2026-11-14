import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyToken } from "@/src/shared/lib/auth/jwt";
import { prisma } from "@/src/shared/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json(
        { error: "احراز هویت انجام نشده است" },
        { status: 401 },
      );
    }
    const admin = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "شناسه کاربر الزامی است" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        points: true,
        createdAt: true,

        orders: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            subtotal: true,
            shippingCost: true,
            discount: true,
            tax: true,
            totalPrice: true,

            paymentMethod: true,
            paymentStatus: true,
            status: true,

            createdAt: true,
            updatedAt: true,

            shipments: {
              select: {
                id: true,
                trackingNumber: true,
                status: true,
                shipmentType: true,
                shippedAt: true,
                deliveredAt: true,
                estimatedDeliveryDays: true,
              },
            },
            payment: {
              select: {
                id: true,
                status: true,
                amount: true,
                receiptImage: true,
                payerName: true,
                payerCardLast4: true,
                adminNote: true,
                rejectionReason: true,
                reviewedAt: true,
                createdAt: true,
              },
            },

            items: {
              select: {
                id: true,
                productId: true,
                name: true,
                price: true,
                quantity: true,
                image: true,

                selectedColor: true,
                selectedSize: true,
                selectedNumber: true,

                variantId: true,
                variantName: true,
                variantSize: true,
                variantVolume: true,
                variantVolumeUnit: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر پیدا نشد" }, { status: 404 });
    }

    const orders = user.orders;
    const totalOrders = orders.length;
    const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
    const pendingOrders = orders.filter(
      (order) =>
        order.paymentStatus === "PENDING" || order.paymentStatus === "REVIEW",
    );

    const rejectedOrders = orders.filter(
      (order) => order.paymentStatus === "REJECTED",
    );

    const cancelledOrders = orders.filter(
      (order) => order.status === "CANCELLED",
    );

    const totalPurchased = paidOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    const totalItems = orders.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    );
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        points: user.points,
        createdAt: user.createdAt,
      },

      statistics: {
        totalOrders,
        paidOrders: paidOrders.length,
        pendingOrders: pendingOrders.length,
        rejectedOrders: rejectedOrders.length,
        cancelledOrders: cancelledOrders.length,
        totalPurchased,
        totalItems,
      },

      orders,
    });
  } catch (error) {
    console.error("Admin user details error:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت اطلاعات کاربر",
      },
      {
        status: 500,
      },
    );
  }
}
