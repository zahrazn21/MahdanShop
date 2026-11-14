/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

export async function GET(request: Request) {
  try {
    
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "احراز هویت انجام نشده است" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          orderId: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          order: {
            user: {
              username: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          order: {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          payerName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const payments = await prisma.payment.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        orderId: true,

        method: true,
        status: true,
        amount: true,

        receiptImage: true,

        payerName: true,
        payerCardLast4: true,

        adminNote: true,
        rejectionReason: true,

        reviewedAt: true,
        createdAt: true,
        updatedAt: true,

        order: {
          select: {
            id: true,
            totalPrice: true,
            paymentStatus: true,
            status: true,
            createdAt: true,

            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const [total, pending, review, approved, rejected] = await Promise.all([
      prisma.payment.count(),

      prisma.payment.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.payment.count({
        where: {
          status: "PENDING",
          receiptImage: {
            not: null,
          },
        },
      }),

      prisma.payment.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.payment.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return NextResponse.json({
      payments,

      statistics: {
        total,
        pending,
        review,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error("Admin payments error:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت پرداخت‌ها",
      },
      {
        status: 500,
      },
    );
  }
}
