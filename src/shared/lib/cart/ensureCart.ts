import { prisma } from "../prisma";


export async function ensureCart(userId?: string, cartId?: string) {
  if (cartId) {
    const existingCart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true }
    });
    
    if (existingCart) {
      return existingCart;
    }
  }

  if (userId) {
    const userCart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true }
    });
    
    if (userCart) {
      return userCart;
    }
  }

  return await prisma.cart.create({
    data: {
      userId: userId || null,
    },
    include: { items: true }
  });
}