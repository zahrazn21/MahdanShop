import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import { prisma } from "@/src/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const body = await request.json();

    const status = body.status;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "وضعیت نامعتبر است" },
        { status: 400 },
      );
    }

    const review = await prisma.review.findUnique({
      where: {
        id,
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "نظر پیدا نشد" },
        { status: 404 },
      );
    }

    if (review.status === status) {
      return NextResponse.json(
        { message: "این نظر قبلاً همین وضعیت را دارد" },
        { status: 400 },
      );
    }

    const updatedReview = await prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

      const aggregate = await tx.review.aggregate({
        where: {
          productId: review.productId,
          status: "APPROVED",
        },
        _avg: {
          rating: true,
        },
        _count: {
          id: true,
        },
      });

      await tx.product.update({
        where: {
          id: review.productId,
        },
        data: {
          rating: aggregate._avg.rating ?? 0,
          reviewCount: aggregate._count.id,
        },
      });

      return updated;
    });

    return NextResponse.json({
      message:
        status === "APPROVED"
          ? "نظر با موفقیت تأیید شد"
          : "نظر با موفقیت رد شد",
      review: updatedReview,
    });
  } catch (error) {
    console.error("UPDATE REVIEW STATUS ERROR:", error);

    return NextResponse.json(
      { message: "خطا در تغییر وضعیت نظر" },
      { status: 500 },
    );
  }
}