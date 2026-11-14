import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import { prisma } from "@/src/shared/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "لطفاً ابتدا وارد حساب کاربری شوید" },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      reviews,
    });
  } catch (error) {
    console.error("GET ADMIN REVIEWS ERROR:", error);

    return NextResponse.json(
      { message: "خطا در دریافت نظرات" },
      { status: 500 },
    );
  }
}