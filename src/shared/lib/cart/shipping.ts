type ShippingClass = "SMALL" | "MEDIUM" | "LARGE";

interface ShippableItem {
  shippingClass: ShippingClass;
  quantity: number;
}

const UNIT_WEIGHT: Record<ShippingClass, number> = {
  SMALL: 1,
  MEDIUM: 3,
  LARGE: 6,
};

const PACKAGE_CAPACITY = {
  SMALL: 4,
  MEDIUM: 10,
  LARGE: 20,
};

const PACKAGE_PRICE = {
  SMALL: 50000,
  MEDIUM: 80000,
  LARGE: 120000,
};

export function calculateShippingCost(items: ShippableItem[]): number {
  const totalUnits = items.reduce((sum, item) => {
    return sum + (UNIT_WEIGHT[item.shippingClass] || 1) * item.quantity;
  }, 0);

  if (totalUnits <= PACKAGE_CAPACITY.SMALL) {
    return PACKAGE_PRICE.SMALL;
  }

  if (totalUnits <= PACKAGE_CAPACITY.MEDIUM) {
    return PACKAGE_PRICE.MEDIUM;
  }

  if (totalUnits <= PACKAGE_CAPACITY.LARGE) {
    return PACKAGE_PRICE.LARGE;
  }

  const boxCount = Math.ceil(totalUnits / PACKAGE_CAPACITY.LARGE);
  return boxCount * PACKAGE_PRICE.LARGE;
}