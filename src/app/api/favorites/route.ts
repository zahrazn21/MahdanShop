import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUserId } from "@/src/shared/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "برای مشاهده باید وارد شوید" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "برای این کار باید وارد شوید" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const productId: string | undefined = body?.productId;

  if (!productId) {
    return NextResponse.json({ error: "productId الزامی است" }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
  }

  await prisma.favorite.create({ data: { userId, productId } });
  return NextResponse.json({ favorited: true });
}