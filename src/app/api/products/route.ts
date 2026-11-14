import { categories } from "@/src/components/categories/CategoryItems";
import { prisma } from "@/src/shared/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { computeStockAndAvailability } from "@/src/shared/lib/productAvailability";
import { requireAdmin } from "@/src/shared/lib/auth/requireAdmin";

const listSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  originalPrice: true,
  image: true,
  category: true,
  brand: true,
  scope: true,
  availabilityType: true,
  estimatedDeliveryDays: true,
  stock: true,
  isAvailable: true,
  shippingClass: true,
  colors: true,
  sizes: true,
  numbers: true,
  rating: true,
  reviewCount: true,
  status: true,
  createdAt: true,
  batch: {
    select: {
      id: true,
      batchNumber: true,
      title: true,
      status: true,
    },
  },
} satisfies Prisma.ProductSelect;

const getSoldProducts = unstable_cache(
  async () =>
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          paymentStatus: "PAID",
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
    }),
  ["best-selling-ranking"],
  { revalidate: 300 },
);

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

function normalizeSearch(text: string) {
  return text
    .normalize("NFKC")
    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "")
    .replace(/\u200d/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchVariants(search: string) {
  const normalized = normalizeSearch(search);

  const variants = new Set<string>();

  if (normalized) {
    variants.add(normalized);
    variants.add(normalized.replace(/ک/g, "ك"));
    variants.add(normalized.replace(/ی/g, "ي"));
    variants.add(normalized.replace(/ک/g, "ك").replace(/ی/g, "ي"));
  }

  return Array.from(variants);
}

async function generateUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

function emptyResponse(limit: number) {
  return NextResponse.json({
    products: [],
    pagination: {
      totalProducts: 0,
      totalPages: 0,
      currentPage: 1,
      limit,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const scope = searchParams.get("scope") || "all";
    const category = searchParams.get("category") || undefined;

    const pageParam = Number(searchParams.get("page") || "1");
    const limitParam = Number(searchParams.get("limit") || "10");

    const sortBy = searchParams.get("sortBy") || "newest";

    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    const inStock = searchParams.get("inStock") === "true";
    const onSale = searchParams.get("onSale") === "true";

    const rawSearch = searchParams.get("search")?.trim() || "";
    const searchVariants = rawSearch ? getSearchVariants(rawSearch) : [];

    if (
      !Number.isInteger(pageParam) ||
      !Number.isInteger(limitParam) ||
      pageParam <= 0 ||
      limitParam <= 0 ||
      limitParam > 100
    ) {
      return NextResponse.json(
        { error: "Page and limit must be positive integers" },
        { status: 400 },
      );
    }

    if (scope !== "domestic" && scope !== "imported" && scope !== "all") {
      return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
    }

    if (category && !categories.some((cat) => cat.slug === category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const minPrice =
      minPriceParam && !Number.isNaN(Number(minPriceParam))
        ? Number(minPriceParam)
        : undefined;

    const maxPrice =
      maxPriceParam && !Number.isNaN(Number(maxPriceParam))
        ? Number(maxPriceParam)
        : undefined;

    const where: Prisma.ProductWhereInput = {
      category: category || undefined,
      scope: scope !== "all" ? scope : undefined,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      ...(onSale ? { originalPrice: { not: null } } : {}),
      AND: [
        searchVariants.length > 0
          ? {
              OR: searchVariants.flatMap((variant) => [
                { name: { contains: variant } },
                { brand: { contains: variant } },
                { category: { contains: variant } },
                { slug: { contains: variant } },
              ]),
            }
          : {},
        inStock
          ? {
              OR: [
                {
                  availabilityType: "PRE_ORDER",
                  isAvailable: true,
                },
                {
                  availabilityType: "IN_STOCK",
                  stock: { gt: 0 },
                },
              ],
            }
          : {},
      ],
    };

    if (sortBy === "best-selling") {
      const soldProducts = await getSoldProducts();

      if (soldProducts.length === 0) {
        return emptyResponse(limitParam);
      }

      const rankedProductIds = soldProducts.map((item) => item.productId);

      const filteredProducts = await prisma.product.findMany({
        where: {
          ...where,
          id: { in: rankedProductIds },
        },
        select: { id: true },
      });

      const filteredProductIdSet = new Set(
        filteredProducts.map((product) => product.id),
      );

      const filteredRankedIds = rankedProductIds.filter((productId) =>
        filteredProductIdSet.has(productId),
      );

      const totalProducts = filteredRankedIds.length;

      if (totalProducts === 0) {
        return emptyResponse(limitParam);
      }

      const totalPages = Math.ceil(totalProducts / limitParam);
      const currentPage = Math.min(pageParam, totalPages);
      const skip = (currentPage - 1) * limitParam;

      const paginatedIds = filteredRankedIds.slice(skip, skip + limitParam);

      if (paginatedIds.length === 0) {
        return NextResponse.json({
          products: [],
          pagination: {
            totalProducts,
            totalPages,
            currentPage,
            limit: limitParam,
            hasPreviousPage: currentPage > 1,
            hasNextPage: false,
          },
        });
      }

      const productsFromDb = await prisma.product.findMany({
        where: { id: { in: paginatedIds } },
        select: listSelect,
      });

      const productsMap = new Map(
        productsFromDb.map((product) => [product.id, product]),
      );

      const soldMap = new Map(
        soldProducts.map((item) => [item.productId, item._sum.quantity ?? 0]),
      );

      const products = paginatedIds
        .map((productId) => {
          const product = productsMap.get(productId);

          if (!product) {
            return null;
          }

          return {
            ...product,
            totalSold: soldMap.get(productId) ?? 0,
          };
        })
        .filter(Boolean);

      return NextResponse.json({
        products,
        pagination: {
          totalProducts,
          totalPages,
          currentPage,
          limit: limitParam,
          hasPreviousPage: currentPage > 1,
          hasNextPage: currentPage < totalPages,
        },
      });
    }

    let orderBy;

    switch (sortBy) {
      case "oldest":
        orderBy = [{ createdAt: "asc" as const }, { id: "asc" as const }];
        break;

      case "price-low":
        orderBy = [{ price: "asc" as const }, { id: "asc" as const }];
        break;

      case "price-high":
        orderBy = [{ price: "desc" as const }, { id: "desc" as const }];
        break;

      case "newest":
      default:
        orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }];
        break;
    }

    const [totalProducts, firstTry] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (pageParam - 1) * limitParam,
        take: limitParam,
        orderBy,
        select: listSelect,
      }),
    ]);

    if (totalProducts === 0) {
      return emptyResponse(limitParam);
    }

    const totalPages = Math.ceil(totalProducts / limitParam);
    const currentPage = Math.min(pageParam, totalPages);

    const products =
      currentPage === pageParam
        ? firstTry
        : await prisma.product.findMany({
            where,
            skip: (currentPage - 1) * limitParam,
            take: limitParam,
            orderBy,
            select: listSelect,
          });

    return NextResponse.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage,
        limit: limitParam,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    });
  } catch (error) {
    console.error("❌ GET /api/products ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const denied = await requireAdmin();

    if (denied) {
      return denied;
    }

    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "نام محصول الزامی است" },
        { status: 400 },
      );
    }

    if (
      body.price === undefined ||
      body.price === null ||
      Number.isNaN(Number(body.price)) ||
      Number(body.price) < 0
    ) {
      return NextResponse.json(
        { error: "قیمت محصول معتبر نیست" },
        { status: 400 },
      );
    }

    if (!body.category) {
      return NextResponse.json(
        { error: "دسته‌بندی محصول الزامی است" },
        { status: 400 },
      );
    }

    if (!categories.some((cat) => cat.slug === body.category)) {
      return NextResponse.json(
        { error: "دسته‌بندی انتخاب‌شده معتبر نیست" },
        { status: 400 },
      );
    }

    const availabilityType = body.availabilityType ?? "IN_STOCK";

    if (availabilityType !== "IN_STOCK" && availabilityType !== "PRE_ORDER") {
      return NextResponse.json(
        { error: "نوع تأمین محصول معتبر نیست" },
        { status: 400 },
      );
    }

    let batchId: string | null = null;

    if (availabilityType === "PRE_ORDER") {
      if (!body.batchId) {
        return NextResponse.json(
          {
            error: "برای محصول پیش‌سفارش باید دوره سفارش‌گیری انتخاب شود",
          },
          { status: 400 },
        );
      }

      const batch = await prisma.orderBatch.findUnique({
        where: { id: body.batchId },
      });

      if (!batch) {
        return NextResponse.json(
          { error: "دوره سفارش‌گیری پیدا نشد" },
          { status: 404 },
        );
      }

      if (batch.status !== "OPEN") {
        return NextResponse.json(
          {
            error: "این دوره در حال حاضر برای ثبت سفارش فعال نیست",
          },
          { status: 400 },
        );
      }

      batchId = batch.id;
    }

    let estimatedDeliveryDays: number | null = null;

    if (availabilityType === "PRE_ORDER") {
      if (
        body.estimatedDeliveryDays === undefined ||
        Number(body.estimatedDeliveryDays) <= 0
      ) {
        return NextResponse.json(
          {
            error: "زمان تقریبی تأمین محصول وارداتی الزامی است",
          },
          { status: 400 },
        );
      }

      estimatedDeliveryDays = Number(body.estimatedDeliveryDays);
    }

    const baseSlug = body.slug?.trim()
      ? slugify(body.slug.trim())
      : slugify(body.name);

    if (!baseSlug) {
      return NextResponse.json(
        { error: "امکان ساخت slug معتبر وجود ندارد" },
        { status: 400 },
      );
    }

    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const { stock, isAvailable } = computeStockAndAvailability({
      availabilityType:
        availabilityType === "PRE_ORDER" ? "PRE_ORDER" : "IN_STOCK",
      baseStock: Number(body.stock ?? 0),
      variants: Array.isArray(body.variants) ? body.variants : null,
    });

    const product = await prisma.product.create({
      data: {
        name: body.name.trim(),
        slug: uniqueSlug,
        price: Number(body.price),
        originalPrice:
          body.originalPrice !== undefined &&
          body.originalPrice !== null &&
          body.originalPrice !== ""
            ? Number(body.originalPrice)
            : null,
        image: body.image,
        images: Array.isArray(body.images) ? body.images : [],
        category: body.category,
        brand: body.brand?.trim() || null,
        availabilityType,
        scope: availabilityType === "PRE_ORDER" ? "imported" : "domestic",
        estimatedDeliveryDays,
        preOrderNote:
          availabilityType === "PRE_ORDER"
            ? body.preOrderNote?.trim() ||
              "این محصول پس از تأمین خارجی ارسال می‌شود"
            : null,
        batchId,
        stock,
        isAvailable,
        shippingClass: body.shippingClass ?? "SMALL",
        rating: Number(body.rating ?? 0),
        reviewCount: Number(body.reviewCount ?? 0),
        description: body.description ?? null,
        howToUse: body.howToUse ?? null,
        features: Array.isArray(body.features) ? body.features : [],
        ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
        colors: Array.isArray(body.colors) ? body.colors : [],
        sizes: Array.isArray(body.sizes) ? body.sizes : [],
        numbers: Array.isArray(body.numbers) ? body.numbers : [],
        sku: body.sku ?? null,
        weight:
          body.weight !== undefined &&
          body.weight !== null &&
          body.weight !== ""
            ? Number(body.weight)
            : null,
        status: body.status ?? "ACTIVE",
        expirationDate: body.expirationDate
          ? new Date(body.expirationDate)
          : null,
        specifications: body.specifications ?? null,
        variants: body.variants ?? null,
      },
      include: {
        batch: true,
      },
    });

    return NextResponse.json(
      {
        message: "محصول با موفقیت اضافه شد",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ POST /api/products ERROR:", error);

    if (getErrorCode(error) === "P2002") {
      return NextResponse.json(
        { error: "محصولی با این مشخصات از قبل وجود دارد" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "خطا در ثبت محصول" }, { status: 500 });
  }
}