import { NextResponse } from "next/server";

import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

type Params = {
  params: Promise<{
    receiptGroupId: string;
  }>;
};

export async function DELETE(
  req: Request,
  { params }: Params,
) {
  try {
    const admin = await getCurrentUser();

    if (!admin) {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        {
          status: 401,
        },
      );
    }

    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        {
          status: 403,
        },
      );
    }

    const { receiptGroupId } =
      await params;

    if (!receiptGroupId) {
      return NextResponse.json(
        {
          error:
            "شناسه تاریخچه الزامی است",
        },
        {
          status: 400,
        },
      );
    }

    const payments =
      await prisma.shippingPayment.findMany(
        {
          where: {
            OR: [
              {
                receiptGroupId,
              },
              {
                id: receiptGroupId,
                receiptGroupId: null,
              },
            ],

            status: {
              in: ["APPROVED", "REJECTED"],
            },

            adminDeletedAt: null,
          },

          select: {
            id: true,
          },
        },
      );

    if (payments.length === 0) {
      return NextResponse.json(
        {
          error:
            "رکورد تاریخچه پیدا نشد",
        },
        {
          status: 404,
        },
      );
    }

    const result =
      await prisma.shippingPayment.updateMany(
        {
          where: {
            id: {
              in: payments.map(
                (payment) => payment.id,
              ),
            },
          },

          data: {
            adminDeletedAt:
              new Date(),
          },
        },
      );

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error(
      "DELETE ADMIN SHIPPING PAYMENT HISTORY ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "خطا در حذف تاریخچه پرداخت",
      },
      {
        status: 500,
      },
    );
  }
}