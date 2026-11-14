import { useMemo } from "react";

import type {
  Product,
  ProductVariant,
} from "@/src/shared/types/product";

interface UseProductPurchaseParams {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function useProductPurchase({
  product,
  selectedVariant,
}: UseProductPurchaseParams) {
  const isPreOrder = product.availabilityType === "PRE_ORDER";
  const isInStock = product.availabilityType === "IN_STOCK";

  const hasVariants =
    Array.isArray(product.variants) &&
    product.variants.length > 0;

  const activeVariant = useMemo(() => {
    if (!hasVariants) return null;

    return selectedVariant ?? product.variants?.[0] ?? null;
  }, [
    hasVariants,
    selectedVariant,
    product.variants,
  ]);

  const currentPrice =
    activeVariant?.price ?? product.price;

  const currentStock =
    activeVariant?.stock ?? product.stock;

  const sku =
    activeVariant?.sku ?? product.sku;

  const hasAvailableVariant = useMemo(() => {
    if (!hasVariants) return false;

    return product.variants!.some(
      (variant) => Number(variant.stock ?? 0) > 0,
    );
  }, [hasVariants, product.variants]);

  const hasBatch = Boolean(product.batchId);

  const isBatchOpen =
    isPreOrder &&
    product.batch?.status === "OPEN";


  const canPurchase = useMemo(() => {
    if (isPreOrder) {
      return (
        product.status === "ACTIVE" &&
        isBatchOpen
      );
    }
    if (isInStock && hasVariants) {
      return (
        product.status !== "ARCHIVED" &&
        product.status !== "DRAFT" &&
        currentStock > 0
      );
    }
    if (isInStock) {
      return (
        product.status === "ACTIVE" &&
        product.isAvailable &&
        currentStock > 0
      );
    }

    return false;
  }, [
    isPreOrder,
    isInStock,
    hasVariants,
    currentStock,
    product.status,
    product.isAvailable,
    isBatchOpen,
  ]);
  const purchaseDisabledReason = useMemo(() => {
    if (isPreOrder) {
      if (!product.batchId) {
        return "در حال حاضر دوره سفارش‌گیری برای این محصول تعیین نشده است.";
      }

      if (product.batch?.status !== "OPEN") {
        return "مهلت سفارش‌گیری این محصول به پایان رسیده است.";
      }

      if (
        product.status !== "ACTIVE"
      ) {
        return "این محصول در حال حاضر غیرفعال است.";
      }

      return null;
    }
    if (isInStock && hasVariants) {
      if (!activeVariant) {
        return "لطفاً یک تنوع از محصول را انتخاب کنید.";
      }

      if (currentStock <= 0) {
        return "موجودی این تنوع به پایان رسیده است.";
      }

      if (
        product.status === "ARCHIVED"
      ) {
        return "این محصول آرشیو شده است.";
      }

      if (
        product.status === "DRAFT"
      ) {
        return "این محصول هنوز فعال نشده است.";
      }

      return null;
    }
    if (isInStock) {
      if (product.status !== "ACTIVE") {
        return "این محصول در حال حاضر غیرفعال است.";
      }

      if (!product.isAvailable) {
        return "این محصول در حال حاضر برای خرید در دسترس نیست.";
      }

      if (currentStock <= 0) {
        return "موجودی این محصول به پایان رسیده است.";
      }

      return null;
    }

    return "این محصول در حال حاضر برای خرید در دسترس نیست.";
  }, [
    isPreOrder,
    isInStock,
    hasVariants,
    activeVariant,
    currentStock,
    product.status,
    product.isAvailable,
    product.batchId,
    product.batch?.status,
  ]);

  return {
    isPreOrder,
    isInStock,
    hasVariants,
    hasBatch,
    hasAvailableVariant,
    activeVariant,
    currentPrice,
    currentStock,
    sku,
    canPurchase,
    purchaseDisabledReason,
  };
}

