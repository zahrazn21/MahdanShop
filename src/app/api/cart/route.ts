
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/shared/lib/prisma";
import { ensureCart } from "@/src/shared/lib/cart/ensureCart";

export async function GET() {
  const cookieStore = await cookies(); // مهم (Next 15)
  const cartId = cookieStore.get("cartId")?.value;

  const cart = await ensureCart(undefined, cartId);

  const fullCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const items = fullCart?.items || [];

  const totalPrice = items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    const discount =
      (item.product.originalPrice ?? item.product.price) -
      item.product.price;

    return sum + discount * item.quantity;
  }, 0);

  const finalPrice = totalPrice; 
  const itemCount = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  return NextResponse.json({
    ...fullCart,
    items,
    totalPrice,
    totalDiscount,
    finalPrice,
    itemCount,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    const cart = await ensureCart(undefined, cartId);
    
    const response = NextResponse.json({ success: true });
    if (!cartId) {
      response.cookies.set("cartId", cart.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: body.productId,
        selectedColor: body.selectedColor || null,
        selectedSize: body.selectedSize || null,
        selectedNumber: body.selectedNumber || null,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (body.quantity || 1),
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: body.productId,
          quantity: body.quantity || 1,
          selectedColor: body.selectedColor || null,
          selectedSize: body.selectedSize || null,
          selectedNumber: body.selectedNumber || null,
        },
      });
    }

    return response;
  } catch (err) {
    console.error("CART POST ERROR:", err);
    return NextResponse.json(
      { error: "Cart server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Item id required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CART DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { quantity } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Item id required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (err) {
    console.error("CART PUT ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}