import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const allowedTransitions: Record<string, string[]> = {
  CONFIRMED: ["PREPARING"],
  PREPARING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "احراز هویت انجام نشده است" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const { id: orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { error: "شناسه سفارش ارسال نشده است" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const {
      status,
      trackingNumber,
    } = body;


    if (!status) {
      return NextResponse.json(
        { error: "وضعیت جدید ارسال نشده است" },
        { status: 400 },
      );
    }


    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });


    if (!order) {
      return NextResponse.json(
        { error: "سفارش پیدا نشد" },
        { status: 404 },
      );
    }


    const currentStatus = order.status;


    const allowed =
      allowedTransitions[currentStatus]?.includes(status);


    if (!allowed) {
      return NextResponse.json(
        {
          error:
            `تغییر وضعیت از ${currentStatus} به ${status} مجاز نیست`,
        },
        {
          status: 400,
        },
      );
    }


    if (
      status === "SHIPPED" &&
      (!trackingNumber ||
        typeof trackingNumber !== "string" ||
        trackingNumber.trim() === "")
    ) {
      return NextResponse.json(
        {
          error:
            "برای ارسال سفارش وارد کردن کد رهگیری الزامی است",
        },
        {
          status: 400,
        },
      );
    }


    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status,

        ...(status === "SHIPPED" && {
          trackingNumber: trackingNumber.trim(),
        }),
      },
    });


    return NextResponse.json({
      success: true,
      message: "وضعیت سفارش با موفقیت تغییر کرد",
      order: updatedOrder,
    });


  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در تغییر وضعیت سفارش",
      },
      {
        status: 500,
      },
    );
  }
}