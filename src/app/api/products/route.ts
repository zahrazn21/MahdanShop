
import { prisma } from "@/src/shared/lib/prisma";
import { NextResponse } from "next/server";

function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const scope = searchParams.get("scope") || undefined;
    const category = searchParams.get("category") || undefined;

    const products = await prisma.product.findMany({
      where: {
        category: category || undefined,
        scope: scope && scope !== "all" ? scope : undefined,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ GET /api/products ERROR:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: slugify(body.name),
        price: Number(body.price),

        originalPrice: body.originalPrice
          ? Number(body.originalPrice)
          : null,

        image: body.image,
        images: body.images ?? [],

        category: body.category,
        brand: body.brand ?? null,
        scope: body.scope ?? "domestic",

        stock: Number(body.stock ?? 0),
        isAvailable: Number(body.stock ?? 0) > 0,

        rating: Number(body.rating ?? 0),
        reviewCount: Number(body.reviewCount ?? 0),

        description: body.description ?? null,
        howToUse: body.howToUse ?? null,

        features: body.features ?? [],
        ingredients: body.ingredients ?? [],
      },
    });

    return NextResponse.json(
      {
        message: "محصول اضافه شد",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Server Error",
        details: String(error),
      },
      { status: 500 },
    );
  }
}