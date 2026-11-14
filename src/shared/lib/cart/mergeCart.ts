import { prisma } from "../prisma";

export async function mergeCart(userId: string, cartId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return;

  const userCart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: item.productId,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        selectedNumber: item.selectedNumber,
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          selectedNumber: item.selectedNumber,
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: cartId } });
}