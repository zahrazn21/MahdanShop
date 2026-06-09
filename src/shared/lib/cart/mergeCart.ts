export async function mergeCart(userId: string, cartId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  });

  if (!guestCart) return;

  const userCart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  await prisma.cartItem.createMany({
    data: guestCart.items.map((item) => ({
      cartId: userCart.id,
      productId: item.productId,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      selectedNumber: item.selectedNumber,
    })),
  });

  await prisma.cart.delete({
    where: { id: cartId },
  });
}