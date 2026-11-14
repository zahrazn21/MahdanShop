import type { CartItemDisplay } from "@/src/shared/types/cart";

export function getCartItemState(item: CartItemDisplay) {
  const isImported = item.availabilityType === "PRE_ORDER";
  const isBatchClosed = isImported && !!item.batchStatus && item.batchStatus !== "OPEN";

  const baseOk = item.isAvailable && item.status === "ACTIVE";
  const canPurchase = baseOk && (isImported ? item.batchStatus === "OPEN" : (item.stock ?? 0) > 0);

  const discountPercent =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

  return { isImported, isBatchClosed, canPurchase, discountPercent };
}