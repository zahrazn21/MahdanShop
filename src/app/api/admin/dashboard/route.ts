import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/src/shared/lib/auth/jwt";
import { prisma } from "@/src/shared/lib/prisma";

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const getSales = (
  orders: {
    totalPrice: unknown;
    paymentStatus?: string;
  }[],
) => {
  return orders
    .filter(
      (order) =>
        !order.paymentStatus || order.paymentStatus === "PAID",
    )
    .reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );
};

export async function GET() {
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

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const now = new Date();

    const todayStart = startOfDay(now);
    const tomorrowStart = addDays(todayStart, 1);

    const weekStart = addDays(todayStart, -6);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      pendingPayments,
      todayOrders,
      weekOrders,
      monthOrders,
      paidOrders,
      processingOrders,
      recentOrders,
      lowStockProducts,
      weeklyOrders,
      orderStatusStats,
      topProducts,
    ] = await Promise.all([
      prisma.product.count(),

      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      prisma.order.count(),

      prisma.order.count({
        where: {
          paymentStatus: "REVIEW",
        },
      }),

      prisma.order.findMany({
        where: {
          createdAt: {
            gte: todayStart,
            lt: tomorrowStart,
          },
        },
        select: {
          totalPrice: true,
          paymentStatus: true,
        },
      }),

      prisma.order.findMany({
        where: {
          createdAt: {
            gte: weekStart,
            lt: tomorrowStart,
          },
        },
        select: {
          totalPrice: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),

      prisma.order.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lt: tomorrowStart,
          },
        },
        select: {
          totalPrice: true,
          paymentStatus: true,
        },
      }),

      prisma.order.findMany({
        where: {
          paymentStatus: "PAID",
        },
        select: {
          totalPrice: true,
          paymentStatus: true,
        },
      }),

      prisma.order.count({
        where: {
          status: {
            in: [
              "CONFIRMED",
              "PROCESSING",
              "PARTIALLY_SHIPPED",
            ],
          },
        },
      }),

      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          totalPrice: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      }),

      prisma.product.findMany({
        where: {
          stock: {
            lte: 5,
          },
        },
        take: 5,
        orderBy: {
          stock: "asc",
        },
        select: {
          id: true,
          name: true,
          stock: true,
          image: true,
        },
      }),

      prisma.order.findMany({
        where: {
          paymentStatus: "PAID",
          createdAt: {
            gte: weekStart,
            lt: tomorrowStart,
          },
        },
        select: {
          totalPrice: true,
          createdAt: true,
        },
      }),

      prisma.order.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: {
            paymentStatus: "PAID",
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),
    ]);

    const totalSales = getSales(paidOrders);

    const todaySales = getSales(todayOrders);

    const weekSales = getSales(weekOrders);

    const monthSales = getSales(monthOrders);

    const salesChart = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const nextDate = addDays(date, 1);

      const dayOrders = weeklyOrders.filter((order) => {
        const createdAt = new Date(order.createdAt);

        return createdAt >= date && createdAt < nextDate;
      });

      const sales = dayOrders.reduce(
        (sum, order) =>
          sum + Number(order.totalPrice || 0),
        0,
      );

      return {
        date: date.toISOString(),

        label: new Intl.DateTimeFormat("fa-IR", {
          weekday: "short",
        }).format(date),

        sales,

        orders: dayOrders.length,
      };
    });

    const formattedOrderStatusStats = orderStatusStats.map(
      (item) => ({
        status: item.status,
        count: item._count.status,
      }),
    );

    const topProductIds = topProducts.map(
      (item) => item.productId,
    );

    const products =
      topProductIds.length > 0
        ? await prisma.product.findMany({
            where: {
              id: {
                in: topProductIds,
              },
            },
            select: {
              id: true,
              name: true,
              image: true,
              price: true,
            },
          })
        : [];

    const topSellingProducts = topProducts.map((item) => {
      const product = products.find(
        (p) => p.id === item.productId,
      );

      return {
        productId: item.productId,
        name: product?.name ?? "محصول حذف شده",
        image: product?.image ?? null,
        price: Number(product?.price ?? 0),
        quantity: item._sum.quantity ?? 0,
      };
    });

    return NextResponse.json({
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales,
        todaySales,
        weekSales,
        monthSales,
        todayOrders: todayOrders.length,
        weekOrders: weekOrders.length,
        monthOrders: monthOrders.length,
        pendingPayments,
        processingOrders,
      },

      salesChart,

      orderStatusStats: formattedOrderStatusStats,

      topSellingProducts,

      recentOrders,

      lowStockProducts,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت اطلاعات داشبورد",
      },
      {
        status: 500,
      },
    );
  }
}