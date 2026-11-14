import {
  AvailabilityType,
  ProductStatus,
  ShippingClass,
} from "@prisma/client";
import { categories } from "@/src/components/categories/CategoryItems";
import { prisma } from "@/src/shared/lib/prisma";
import { NextResponse } from "next/server";
import { computeStockAndAvailability } from "@/src/shared/lib/productAvailability";
import { requireAdmin } from "@/src/shared/lib/auth/requireAdmin";

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }

  return undefined;
}

function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-_]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter(
    (item: unknown): item is string =>
      typeof item === "string" && item.trim() !== "",
  );
}

function parseDate(value: unknown, fallback: Date | null = null) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const date = new Date(String(value));

  return Number.isNaN(date.getTime()) ? fallback : date;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        batch: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ GET product error:", error);

    return NextResponse.json(
      { error: "خطا در دریافت محصول" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAdmin();

    if (denied) {
      return denied;
    }

    const { id } = await params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        batch: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    const name =
      body.name !== undefined ? String(body.name).trim() : existingProduct.name;

    if (!name) {
      return NextResponse.json(
        { error: "نام محصول الزامی است" },
        { status: 400 },
      );
    }

    const price =
      body.price !== undefined ? Number(body.price) : existingProduct.price;

    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
      return NextResponse.json(
        { error: "قیمت محصول معتبر نیست" },
        { status: 400 },
      );
    }

    const category =
      body.category !== undefined
        ? String(body.category).trim()
        : existingProduct.category;

    if (!category) {
      return NextResponse.json(
        { error: "دسته‌بندی محصول الزامی است" },
        { status: 400 },
      );
    }

    if (
      body.category !== undefined &&
      !categories.some((cat) => cat.slug === category)
    ) {
      return NextResponse.json(
        { error: "دسته‌بندی انتخاب‌شده معتبر نیست" },
        { status: 400 },
      );
    }

    let slug = existingProduct.slug;

    if (body.slug !== undefined) {
      const requestedSlug = slugify(String(body.slug));

      if (requestedSlug) {
        slug = requestedSlug;
      }
    }

    if (!slug) {
      slug = slugify(name);
    }

    if (!slug) {
      return NextResponse.json(
        { error: "امکان ساخت slug معتبر وجود ندارد" },
        { status: 400 },
      );
    }

    if (slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findFirst({
        where: {
          slug,
          NOT: { id },
        },
        select: { id: true },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "محصول دیگری با این slug از قبل وجود دارد" },
          { status: 409 },
        );
      }
    }

    const availabilityType: AvailabilityType =
      body.availabilityType !== undefined
        ? body.availabilityType
        : existingProduct.availabilityType;

    if (
      availabilityType !== AvailabilityType.IN_STOCK &&
      availabilityType !== AvailabilityType.PRE_ORDER
    ) {
      return NextResponse.json(
        { error: "نوع تأمین محصول معتبر نیست" },
        { status: 400 },
      );
    }

    const stock =
      body.stock !== undefined ? Number(body.stock) : existingProduct.stock;

    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "موجودی محصول معتبر نیست" },
        { status: 400 },
      );
    }

    let batchId: string | null = existingProduct.batchId;
    let estimatedDeliveryDays: number | null =
      existingProduct.estimatedDeliveryDays;
    let preOrderNote: string | null = existingProduct.preOrderNote;

    if (availabilityType === AvailabilityType.PRE_ORDER) {
      const requestedBatchId =
        body.batchId !== undefined ? body.batchId : existingProduct.batchId;

      if (!requestedBatchId) {
        return NextResponse.json(
          {
            error: "برای محصول پیش‌سفارش باید دوره سفارش‌گیری انتخاب شود",
          },
          { status: 400 },
        );
      }

      const batch = await prisma.orderBatch.findUnique({
        where: { id: requestedBatchId },
      });

      if (!batch) {
        return NextResponse.json(
          { error: "دوره سفارش‌گیری پیدا نشد" },
          { status: 404 },
        );
      }

      const batchChanged = requestedBatchId !== existingProduct.batchId;

      if (batchChanged && batch.status !== "OPEN") {
        return NextResponse.json(
          {
            error: "این دوره در حال حاضر برای ثبت سفارش فعال نیست",
          },
          { status: 400 },
        );
      }

      batchId = requestedBatchId;

      if (body.estimatedDeliveryDays !== undefined) {
        estimatedDeliveryDays = Number(body.estimatedDeliveryDays);
      }

      if (
        estimatedDeliveryDays === null ||
        !Number.isFinite(estimatedDeliveryDays) ||
        estimatedDeliveryDays <= 0 ||
        !Number.isInteger(estimatedDeliveryDays)
      ) {
        return NextResponse.json(
          {
            error:
              "زمان تقریبی تأمین محصول وارداتی باید عدد صحیح بزرگ‌تر از صفر باشد",
          },
          { status: 400 },
        );
      }

      if (body.preOrderNote !== undefined) {
        preOrderNote =
          typeof body.preOrderNote === "string" && body.preOrderNote.trim()
            ? body.preOrderNote.trim()
            : "این محصول پس از تأمین خارجی ارسال می‌شود";
      }

      if (!preOrderNote) {
        preOrderNote = "این محصول پس از تأمین خارجی ارسال می‌شود";
      }
    } else {
      batchId = null;
      estimatedDeliveryDays = null;
      preOrderNote = null;
    }

    const scope =
      availabilityType === AvailabilityType.PRE_ORDER ? "imported" : "domestic";

    const nextVariants =
      body.variants !== undefined ? body.variants : existingProduct.variants;

    const { stock: computedStock, isAvailable } = computeStockAndAvailability({
      availabilityType:
        availabilityType === AvailabilityType.PRE_ORDER
          ? "PRE_ORDER"
          : "IN_STOCK",
      baseStock: stock,
      variants: Array.isArray(nextVariants) ? nextVariants : null,
    });

    const images =
      body.images !== undefined
        ? cleanStringArray(body.images, existingProduct.images)
        : existingProduct.images;

    const features =
      body.features !== undefined
        ? cleanStringArray(body.features, existingProduct.features)
        : existingProduct.features;

    const ingredients =
      body.ingredients !== undefined
        ? cleanStringArray(body.ingredients, existingProduct.ingredients)
        : existingProduct.ingredients;

    const colors =
      body.colors !== undefined
        ? cleanStringArray(body.colors, existingProduct.colors)
        : existingProduct.colors;

    const sizes =
      body.sizes !== undefined
        ? cleanStringArray(body.sizes, existingProduct.sizes)
        : existingProduct.sizes;

    const numbers =
      body.numbers !== undefined
        ? cleanStringArray(body.numbers, existingProduct.numbers)
        : existingProduct.numbers;

    const image =
      body.image !== undefined
        ? typeof body.image === "string" && body.image.trim()
          ? body.image.trim()
          : existingProduct.image
        : existingProduct.image;

    const brand =
      body.brand !== undefined
        ? typeof body.brand === "string" && body.brand.trim()
          ? body.brand.trim()
          : null
        : existingProduct.brand;

    let originalPrice = existingProduct.originalPrice;

    if (body.originalPrice !== undefined) {
      if (body.originalPrice === null || body.originalPrice === "") {
        originalPrice = null;
      } else {
        const parsed = Number(body.originalPrice);

        if (
          !Number.isFinite(parsed) ||
          parsed < 0 ||
          !Number.isInteger(parsed)
        ) {
          return NextResponse.json(
            { error: "قیمت اصلی محصول معتبر نیست" },
            { status: 400 },
          );
        }

        originalPrice = parsed;
      }
    }

    let weight = existingProduct.weight;

    if (body.weight !== undefined) {
      if (body.weight === null || body.weight === "") {
        weight = null;
      } else {
        const parsed = Number(body.weight);

        if (
          !Number.isFinite(parsed) ||
          parsed < 0 ||
          !Number.isInteger(parsed)
        ) {
          return NextResponse.json(
            { error: "وزن محصول معتبر نیست" },
            { status: 400 },
          );
        }

        weight = parsed;
      }
    }

    const rating =
      body.rating !== undefined ? Number(body.rating) : existingProduct.rating;

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: "امتیاز محصول باید بین ۰ تا ۵ باشد" },
        { status: 400 },
      );
    }

    const reviewCount =
      body.reviewCount !== undefined
        ? Number(body.reviewCount)
        : existingProduct.reviewCount;

    if (
      !Number.isFinite(reviewCount) ||
      reviewCount < 0 ||
      !Number.isInteger(reviewCount)
    ) {
      return NextResponse.json(
        { error: "تعداد نظرات معتبر نیست" },
        { status: 400 },
      );
    }

    const shippingClass: ShippingClass =
      body.shippingClass !== undefined
        ? body.shippingClass
        : existingProduct.shippingClass;

    if (
      shippingClass !== ShippingClass.SMALL &&
      shippingClass !== ShippingClass.MEDIUM &&
      shippingClass !== ShippingClass.LARGE
    ) {
      return NextResponse.json(
        { error: "کلاس ارسال محصول معتبر نیست" },
        { status: 400 },
      );
    }

    let status: ProductStatus =
      body.status !== undefined ? body.status : existingProduct.status;

    if (existingProduct.status === ProductStatus.OUT_OF_STOCK && isAvailable) {
      status = ProductStatus.ACTIVE;
    }

    if (
      status !== ProductStatus.ACTIVE &&
      status !== ProductStatus.DRAFT &&
      status !== ProductStatus.OUT_OF_STOCK &&
      status !== ProductStatus.ARCHIVED
    ) {
      return NextResponse.json(
        { error: "وضعیت محصول معتبر نیست" },
        { status: 400 },
      );
    }

    const expirationDate =
      body.expirationDate !== undefined
        ? parseDate(body.expirationDate)
        : existingProduct.expirationDate;

    const description =
      body.description !== undefined
        ? typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : null
        : existingProduct.description;

    const howToUse =
      body.howToUse !== undefined
        ? typeof body.howToUse === "string" && body.howToUse.trim()
          ? body.howToUse.trim()
          : null
        : existingProduct.howToUse;

    const sku =
      body.sku !== undefined
        ? typeof body.sku === "string" && body.sku.trim()
          ? body.sku.trim()
          : null
        : existingProduct.sku;

    const specifications =
      body.specifications !== undefined
        ? body.specifications
        : existingProduct.specifications;

    const variants =
      body.variants !== undefined ? body.variants : existingProduct.variants;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        price,
        originalPrice,
        image,
        images,
        category,
        brand,
        availabilityType,
        scope,
        batchId,
        estimatedDeliveryDays,
        preOrderNote,
        stock: computedStock,
        isAvailable,
        shippingClass,
        status,
        rating,
        reviewCount,
        description,
        howToUse,
        features,
        ingredients,
        colors,
        sizes,
        numbers,
        sku,
        weight,
        expirationDate,
        specifications,
        variants,
      },
      include: {
        batch: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت ویرایش شد",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ PUT product error:", error);

    const errorCode = getErrorCode(error);

    if (errorCode === "P2002") {
      return NextResponse.json(
        { error: "محصول دیگری با این مشخصات از قبل وجود دارد" },
        { status: 409 },
      );
    }

    if (errorCode === "P2003") {
      return NextResponse.json(
        {
          error:
            "اطلاعات محصول به دلیل ارتباط با داده‌های دیگر قابل تغییر نیست",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "خطا در ویرایش محصول" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    const orderCount = await prisma.orderItem.count({ where: { productId: id } });

    if (orderCount > 0) {
      const archivedProduct = await prisma.product.update({
        where: { id },
        data: { status: ProductStatus.ARCHIVED, isAvailable: false },
      });
      await prisma.cartItem.deleteMany({ where: { productId: id } });

      return NextResponse.json({
        success: true,
        archived: true,
        message: "این محصول سفارش ثبت‌شده دارد؛ برای حفظ تاریخچه سفارش‌ها آرشیو شد.",
        product: archivedProduct,
      });
    }

    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({
      success: true,
      archived: false,
      message: "محصول با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("❌ DELETE product error:", error);
    return NextResponse.json({ error: "خطا در حذف محصول" }, { status: 500 });
  }
}