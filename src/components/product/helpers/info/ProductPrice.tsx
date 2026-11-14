
import type { Product } from "@/src/shared/types/product";

interface ProductPriceProps {
  product: Product;
  currentPrice: number;
  discount: number;
}

export function ProductPrice({
  product,
  currentPrice,
  discount,
}: ProductPriceProps) {
  const hasDiscount =
    Boolean(product.originalPrice) &&
    product.originalPrice! > currentPrice;

  return (
    <div className="rounded-2xl bg-white/60 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-3xl font-bold text-pink-600">
          {currentPrice.toLocaleString()}
        </span>

        <span className="mb-1 text-gray-500">
          تومان
        </span>

        {hasDiscount && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {product.originalPrice!.toLocaleString()}
            </span>

            <span className="rounded-full bg-green-50 px-2 py-1 text-sm font-semibold text-green-600">
              {discount}% تخفیف
            </span>
          </>
        )}
      </div>
    </div>
  );
}