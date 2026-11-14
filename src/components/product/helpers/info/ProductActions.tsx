"use client";

import { Heart, ShoppingBag } from "lucide-react";


import type { Product } from "@/src/shared/types/product";
import type { ProductVariant } from "@/src/shared/types/product";
import { useProductFavorite } from "@/src/shared/hooks/product/useProductFavorite";

interface ProductActionsProps {
  product: Product;
  activeVariant?: ProductVariant | null;
  isPreOrder: boolean;
  canPurchase: boolean;
  isAdding: boolean;
  handleAddToCart: (variantId?: string) => void;
  initialFavorited: boolean;
}

export function ProductActions({
  product,
  activeVariant,
  isPreOrder,
  canPurchase,
  isAdding,
  handleAddToCart,
  initialFavorited,
}: ProductActionsProps) {
  const {
    favorited,
    isTogglingFavorite,
    handleToggleFavorite,
  } = useProductFavorite({
    productId: product.id,
    initialFavorited,
  });

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => handleAddToCart(activeVariant?.id)}
        disabled={!canPurchase || isAdding}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-500 to-rose-500 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAdding ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            در حال افزودن...
          </>
        ) : canPurchase ? (
          <>
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
            {isPreOrder
              ? "ثبت پیش‌سفارش"
              : "افزودن به سبد خرید"}
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            فعلاً قابل سفارش نیست
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={isTogglingFavorite}
        aria-pressed={favorited}
        className={`group flex w-full items-center justify-center gap-2 rounded-full border py-3 text-lg font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
          favorited
            ? "border-pink-500 bg-pink-500 text-white hover:shadow-xl hover:shadow-pink-300"
            : "border-pink-200 bg-pink-300/10 text-pink-500 hover:shadow-xl hover:shadow-pink-200"
        }`}
      >
        <Heart
          className={`h-5 w-5 transition-transform group-hover:scale-110 ${
            favorited ? "fill-white" : ""
          }`}
        />

        {favorited
          ? "در لیست علاقه‌مندی‌هاست"
          : "افزودن به علاقه‌مندی‌ها"}
      </button>
    </div>
  );
}