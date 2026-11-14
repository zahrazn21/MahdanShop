import type { Prisma, PrismaClient } from "@prisma/client";

type ShippableItem = {
  shippingClass: "SMALL" | "MEDIUM" | "LARGE";
  quantity: number;
};

const UNIT_WEIGHT: Record<ShippableItem["shippingClass"], number> = {
  SMALL: 1,
  MEDIUM: 3,
  LARGE: 6,
};

export function getDomesticVolume(items: ShippableItem[]): number {
  return items.reduce(
    (sum, item) =>
      sum +
      (UNIT_WEIGHT[item.shippingClass] ?? 1) * item.quantity,
    0,
  );
}

export async function getShippingTierCost(
  db: PrismaClient | Prisma.TransactionClient,
  totalVolume: number,
): Promise<number> {
  if (totalVolume <= 0) return 0;

  const prices = await db.shippingPrice.findMany();

  const byClass = Object.fromEntries(
    prices.map((price) => [price.class, price]),
  );

  if (
    !byClass.SMALL ||
    !byClass.MEDIUM ||
    !byClass.LARGE
  ) {
    throw new Error(
      "تعرفه‌های ارسال به‌طور کامل تعریف نشده‌اند",
    );
  }

  let packageType: "SMALL" | "MEDIUM" | "LARGE";
  let packageCount = 1;

  if (totalVolume <= byClass.SMALL.maxCapacity) {
    packageType = "SMALL";
  } else if (totalVolume <= byClass.MEDIUM.maxCapacity) {
    packageType = "MEDIUM";
  } else {
    packageType = "LARGE";

    packageCount = Math.ceil(
      totalVolume / byClass.LARGE.maxCapacity,
    );
  }

  return byClass[packageType].price * packageCount;
}

export async function calculateDomesticShippingCost(
  db: PrismaClient | Prisma.TransactionClient,
  items: ShippableItem[],
): Promise<number> {
  const volume = getDomesticVolume(items);

  return getShippingTierCost(db, volume);
}