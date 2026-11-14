import { RenderStars } from "../renderStars";

import type { Product } from "@/src/shared/types/product";

interface ProductRatingProps {
  product: Product;
  canPurchase: boolean;
  isPreOrder: boolean;
  currentStock: number;
}

export function ProductRating({
  product,
  canPurchase,
  isPreOrder,
  currentStock,
}: ProductRatingProps) {
  const hasReviews =
    product.reviewCount > 0 && product.rating > 0;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {hasReviews && (
        <>
          <div className="flex items-center gap-1" dir="ltr">
            <span className="mr-2 text-gray-600">
              {product.rating}
            </span>

            {RenderStars(product.rating)}
          </div>

          <div className="text-gray-300">|</div>

          <div className="text-gray-500">
            {product.reviewCount} نظر
          </div>

          <div className="text-gray-300">|</div>
        </>
      )}

      {!hasReviews && (
        <>
          <div className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-500">
            جدید
          </div>

          <div className="text-gray-300">|</div>
        </>
      )}

      <div
        className={`font-semibold ${
          canPurchase ? "text-green-600" : "text-red-500"
        }`}
      >
        {isPreOrder
          ? canPurchase
            ? "قابل ثبت پیش‌سفارش"
            : "فعلاً غیرقابل سفارش"
          : canPurchase
            ? `موجودی: ${currentStock} عدد`
            : "ناموجود"}
      </div>
    </div>
  );
}
