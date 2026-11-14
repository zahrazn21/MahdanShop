import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/src/shared/lib/prisma";
import { ensureCart } from "@/src/shared/lib/cart/ensureCart";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import { calculateDomesticShippingCost } from "@/src/shared/lib/shipping/calculateDomesticShipping";

type ProductVariantData = {
  id: string;
  name: string;
  stock: number;
  price: number;
  originalPrice?: number;
  size?: string;
  volume?: number;
  volumeUnit?: string;
  sku?: string;
  hexCode?: string;
  colorName?: string;
  images?: string[];
};

function getProductVariant(
  product: {
    variants: unknown;
  },
  variantId?: string | null,
): ProductVariantData | null {
  if (!variantId) return null;

  const variants = Array.isArray(product.variants)
    ? (product.variants as ProductVariantData[])
    : [];

  return variants.find((variant) => variant.id === variantId) ?? null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    const cart = await ensureCart(user?.id, cartId);

    const fullCart = await prisma.cart.findUnique({
      where: {
        id: cart.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                batch: true,
              },
            },
          },
        },
      },
    });

    if (!fullCart) {
      return NextResponse.json(
        {
          error: "Cart not found",
        },
        {
          status: 404,
        },
      );
    }
    let cartItems = fullCart.items;

    const invalidCartItemIds = cartItems
      .filter((item) => {
        const product = item.product;

        if (product.availabilityType !== "PRE_ORDER") {
          return false;
        }

        return (
          !product.batchId || !product.batch || product.batch.status !== "OPEN"
        );
      })
      .map((item) => item.id);

    if (invalidCartItemIds.length > 0) {
      await prisma.cartItem.deleteMany({
        where: {
          id: {
            in: invalidCartItemIds,
          },
          cartId: cart.id,
        },
      });

      cartItems = cartItems.filter(
        (item) => !invalidCartItemIds.includes(item.id),
      );
    }

    const items = fullCart.items.map((item) => {
      const product = item.product;

      const variant = getProductVariant(product, item.variantId);

      const price = variant?.price ?? product.price;

      const originalPrice =
        variant?.originalPrice ?? product.originalPrice ?? null;

      const stock =
        product.availabilityType === "PRE_ORDER"
          ? null
          : (variant?.stock ?? product.stock);

      const isAvailable =
        product.status === "ACTIVE" &&
        product.isAvailable &&
        (product.availabilityType === "PRE_ORDER" ||
          (stock !== null && stock > 0));

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: product.name,
        price,
        originalPrice,
        image: variant?.images?.[0] ?? product.image,
        brand: product.brand,
        category: product.category,
        scope: product.scope,
        quantity: item.quantity,
        shippingClass: product.shippingClass,
        weight: product.weight,
        availabilityType: product.availabilityType,
        estimatedDeliveryDays: product.estimatedDeliveryDays,
        preOrderNote: product.preOrderNote,

        batchId: product.batchId,
        batch: product.batch
          ? {
              id: product.batch.id,
              status: product.batch.status,
            }
          : null,
        batchNumber: product.batch?.batchNumber ?? null,
        batchTitle: product.batch?.title ?? null,
        batchStatus: product.batch?.status ?? null,

        stock,
        status: product.status,
        isAvailable,

        selectedVariant: variant
          ? {
              id: variant.id,
              name: variant.name,
              price: variant.price,
              originalPrice: variant.originalPrice,
              stock: variant.stock,
              size: variant.size,
              volume: variant.volume,
              volumeUnit: variant.volumeUnit,
              sku: variant.sku,
              hexCode: variant.hexCode,
              colorName: variant.colorName,
            }
          : null,

        variantName: variant?.name ?? null,
        variantSize: variant?.size ?? null,
        variantVolume: variant?.volume ?? null,
        variantVolumeUnit: variant?.volumeUnit ?? null,

        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        selectedNumber: item.selectedNumber,
      };
    });

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const totalDiscount = items.reduce((sum, item) => {
      const discount =
        item.originalPrice && item.originalPrice > item.price
          ? item.originalPrice - item.price
          : 0;

      return sum + discount * item.quantity;
    }, 0);

    const productsFinalPrice = totalPrice - totalDiscount;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const hasImportedItems = items.some(
      (item) => item.availabilityType === "PRE_ORDER",
    );

    const hasDomesticItems = items.some(
      (item) => item.availabilityType === "IN_STOCK",
    );
const domesticItems = items.filter(
  (item) => item.availabilityType === "IN_STOCK",
);

const shippingCost =
  domesticItems.length > 0
    ? await calculateDomesticShippingCost(prisma, domesticItems)
    : 0;
    return NextResponse.json({
      ...fullCart,

      items,

      totalPrice,

      totalDiscount,

      finalPrice: productsFinalPrice,

      itemCount,

      hasImportedItems,

      hasDomesticItems,

      importedFreightCost: 0,

    
      shippingCost,
    });
  } catch (error) {
    console.error("CART GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Cart server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      productId,
      variantId,
      quantity,
      selectedColor,
      selectedSize,
      selectedNumber,
    } = body;

    if (!productId) {
      return NextResponse.json(
        {
          error: "productId الزامی است",
        },
        {
          status: 400,
        },
      );
    }

    const addQuantity = Number(quantity) || 1;

    if (!Number.isInteger(addQuantity) || addQuantity < 1) {
      return NextResponse.json(
        {
          error: "تعداد نامعتبر است",
        },
        {
          status: 400,
        },
      );
    }

    const user = await getCurrentUser();

    const cookieStore = await cookies();

    const cartId = cookieStore.get("cartId")?.value;

    const cart = await ensureCart(user?.id, cartId);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        batch: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "محصول پیدا نشد",
        },
        {
          status: 404,
        },
      );
    }

    if (product.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "این محصول قابل خرید نیست",
        },
        {
          status: 400,
        },
      );
    }

    if (!product.isAvailable) {
      return NextResponse.json(
        {
          error: "این محصول در حال حاضر قابل سفارش نیست",
        },
        {
          status: 400,
        },
      );
    }
    if (product.availabilityType === "PRE_ORDER") {
      if (!product.batchId || !product.batch) {
        return NextResponse.json(
          {
            error: "این محصول وارداتی هنوز به دوره سفارش‌گیری متصل نشده است",
          },
          {
            status: 400,
          },
        );
      }

      if (product.batch.status !== "OPEN") {
        return NextResponse.json(
          {
            error: "دوره سفارش‌گیری این محصول در حال حاضر باز نیست",
          },
          {
            status: 400,
          },
        );
      }
    }

    let selectedVariant: ProductVariantData | null = null;

    if (variantId) {
      selectedVariant = getProductVariant(product, variantId);

      if (!selectedVariant) {
        return NextResponse.json(
          {
            error: "تنوع انتخاب‌شده پیدا نشد",
          },
          {
            status: 404,
          },
        );
      }
    }
    if (product.availabilityType === "IN_STOCK") {
      const currentStock = selectedVariant?.stock ?? product.stock;

      if (currentStock <= 0) {
        return NextResponse.json(
          {
            error: "محصول ناموجود است",
          },
          {
            status: 400,
          },
        );
      }

      if (addQuantity > currentStock) {
        return NextResponse.json(
          {
            error: `حداکثر تعداد قابل خرید ${currentStock} عدد است`,
          },
          {
            status: 400,
          },
        );
      }
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId ?? null,
        selectedColor: selectedColor || null,
        selectedSize: selectedSize || null,
        selectedNumber: selectedNumber || null,
      },
    });

    const newQuantity = (existingItem?.quantity ?? 0) + addQuantity;
    if (product.availabilityType === "IN_STOCK") {
      const currentStock = selectedVariant?.stock ?? product.stock;

      if (newQuantity > currentStock) {
        return NextResponse.json(
          {
            error: `حداکثر تعداد قابل خرید ${currentStock} عدد است`,
          },
          {
            status: 400,
          },
        );
      }
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,

          productId,

          variantId: variantId ?? null,

          quantity: addQuantity,

          selectedColor: selectedColor || null,

          selectedSize: selectedSize || null,

          selectedNumber: selectedNumber || null,
        },
      });
    }

    const response = NextResponse.json({
      success: true,

      variantId: variantId ?? null,

      availabilityType: product.availabilityType,

      batchId: product.batchId,

      batchNumber: product.batch?.batchNumber ?? null,
    });

    if (!user && !cartId) {
      response.cookies.set("cartId", cart.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error("CART POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Cart server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Item id required",
        },
        {
          status: 400,
        },
      );
    }

    const user = await getCurrentUser();

    const cookieStore = await cookies();

    const cartId = cookieStore.get("cartId")?.value;

    const cart = await ensureCart(user?.id, cartId);

    const item = await prisma.cartItem.findUnique({
      where: {
        id,
      },
    });

    if (!item || item.cartId !== cart.id) {
      return NextResponse.json(
        {
          error: "Item not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("CART DELETE ERROR:", error);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Item id required",
        },
        {
          status: 400,
        },
      );
    }

    const body = await req.json();

    const quantity = Number(body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          error: "Quantity must be at least 1",
        },
        {
          status: 400,
        },
      );
    }

    const user = await getCurrentUser();

    const cookieStore = await cookies();

    const cartId = cookieStore.get("cartId")?.value;

    const cart = await ensureCart(user?.id, cartId);

    const existing = await prisma.cartItem.findUnique({
      where: {
        id,
      },
      include: {
        product: {
          include: {
            batch: true,
          },
        },
      },
    });

    if (!existing || existing.cartId !== cart.id) {
      return NextResponse.json(
        {
          error: "Item not found",
        },
        {
          status: 404,
        },
      );
    }
    const product = existing.product;
    if (product.availabilityType === "PRE_ORDER") {
      const updatedItem = await prisma.cartItem.update({
        where: {
          id,
        },
        data: {
          quantity,
        },
        include: {
          product: true,
        },
      });

      return NextResponse.json({
        success: true,
        item: updatedItem,
      });
    }

    const variant = getProductVariant(product, existing.variantId);

    const currentStock = variant?.stock ?? product.stock;

    if (currentStock <= 0) {
      return NextResponse.json(
        {
          error: "این محصول دیگر موجود نیست",
        },
        {
          status: 400,
        },
      );
    }

    if (quantity > currentStock) {
      return NextResponse.json(
        {
          error: `حداکثر تعداد قابل خرید ${currentStock} عدد است`,
        },
        {
          status: 400,
        },
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.error("CART PUT ERROR:", error);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
