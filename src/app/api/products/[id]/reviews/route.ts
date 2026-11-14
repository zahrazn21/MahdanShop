import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import { prisma } from "@/src/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const REVIEWS_LIMIT = 20;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const UPLOAD_DIRECTORY = path.join(process.cwd(), "public", "uploads", "reviews");

function getUploadedFilePath(imageUrl: string) {
  return path.join(process.cwd(), "public", imageUrl.replace(/^\/+/, ""));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        rating: true,
        reviewCount: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: product.id,
        status: "APPROVED",
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        imageUrls: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: REVIEWS_LIMIT,
    });

    return NextResponse.json({
      rating: product.rating,
      reviewCount: product.reviewCount,
      reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    return NextResponse.json({ message: "خطا در دریافت نظرات" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const uploadedImageUrls: string[] = [];

  try {
    const { id } = await params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "لطفاً ابتدا وارد حساب کاربری شوید" },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const rating = Number(formData.get("rating"));
    const comment = String(formData.get("comment") || "").trim();

    const imageValues = formData.getAll("images");

    const images = imageValues.filter(
      (value): value is File => value instanceof File && value.size > 0,
    );

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "امتیاز باید بین ۱ تا ۵ باشد" },
        { status: 400 },
      );
    }

    if (comment.length < 3 || comment.length > 2000) {
      return NextResponse.json(
        { message: "متن نظر باید بین ۳ تا ۲۰۰۰ کاراکتر باشد" },
        { status: 400 },
      );
    }

    if (images.length > MAX_IMAGES) {
      return NextResponse.json(
        { message: "برای هر نظر حداکثر ۵ تصویر می‌توانید ارسال کنید" },
        { status: 400 },
      );
    }

    for (const image of images) {
      if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
        return NextResponse.json(
          { message: "فرمت تصاویر باید JPG، PNG یا WebP باشد" },
          { status: 400 },
        );
      }

      if (image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { message: "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد" },
          { status: 400 },
        );
      }
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
    }

    if (images.length > 0) {
      await fs.mkdir(UPLOAD_DIRECTORY, { recursive: true });
    }

    const imageUrls: string[] = [];

    for (const image of images) {
      const extension = IMAGE_EXTENSIONS[image.type];

      const fileName = `${crypto.randomUUID()}${extension}`;

      const filePath = path.join(UPLOAD_DIRECTORY, fileName);

      const buffer = Buffer.from(await image.arrayBuffer());

      await fs.writeFile(filePath, buffer);

      const imageUrl = `/uploads/reviews/${fileName}`;

      imageUrls.push(imageUrl);
      uploadedImageUrls.push(imageUrl);
    }

    try {
      const review = await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating,
          comment,
          imageUrls,
          status: "PENDING",
        },
        select: {
          id: true,
          rating: true,
          comment: true,
          imageUrls: true,
          status: true,
          createdAt: true,
        },
      });

      return NextResponse.json(
        {
          message: "نظر شما با موفقیت ثبت شد و پس از بررسی نمایش داده می‌شود",
          review,
        },
        { status: 201 },
      );
    } catch (error) {
      for (const imageUrl of uploadedImageUrls) {
        try {
          await fs.unlink(getUploadedFilePath(imageUrl));
        } catch {}
      }

      throw error;
    }
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    for (const imageUrl of uploadedImageUrls) {
      try {
        await fs.unlink(getUploadedFilePath(imageUrl));
      } catch {}
    }

    return NextResponse.json({ message: "خطا در ثبت نظر" }, { status: 500 });
  }
}