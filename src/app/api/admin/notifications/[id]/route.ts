import { NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "احراز هویت لازم است." },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز است." },
        { status: 403 },
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "شناسه اعلان الزامی است." },
        { status: 400 },
      );
    }

    await prisma.notificationRead.upsert({
      where: {
        userId_notificationId: {
          userId: user.id,
          notificationId: id,
        },
      },
      create: {
        userId: user.id,
        notificationId: id,
        readAt: new Date(),
      },
      update: {
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      notificationId: id,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/notifications/[id]:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "ثبت خوانده‌شدن اعلان انجام نشد.",
      },
      { status: 500 },
    );
  }
}