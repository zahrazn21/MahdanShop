import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/src/shared/lib/auth/jwt";
import { prisma } from "@/src/shared/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        role: {
          not: "ADMIN",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,

        _count: {
          select: {
            orders: true,
          },
        },

        orders: {
          select: {
            totalPrice: true,
          },
          where: {
            status: {
              not: "CANCELLED",
            },
          },
        },
      },
    });

    const result = users.map((user) => {
      const totalSpent = user.orders.reduce(
        (sum, order) => sum + Number(order.totalPrice),
        0
      );

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,

        ordersCount: user._count.orders,

        totalSpent,
      };
    });

    return NextResponse.json({
      users: result,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت کاربران",
      },
      {
        status: 500,
      }
    );
  }
}