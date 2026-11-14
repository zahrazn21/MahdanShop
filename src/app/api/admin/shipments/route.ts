import { NextResponse } from "next/server";
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
    const shipments =
      await prisma.orderShipment.findMany({
        orderBy: {
          createdAt: "desc",
        },

        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },

          batch: true,

          items: {
            include: {
              orderItem: true,
            },
          },
          shippingPayments: {
            where: {
              userDeletedAt: null,
            },

            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    return NextResponse.json({
      success: true,
      shipments,
    });
  } catch (error) {
    console.error(
      "GET ADMIN SHIPMENTS ERROR:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "خطای ناشناخته";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}