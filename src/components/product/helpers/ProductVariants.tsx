"use client";

import type { ProductVariant } from "@/src/shared/types/product";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onVariantChange: (variant: ProductVariant) => void;
}

export default function ProductVariants({
  variants,
  selectedVariantId,
  onVariantChange,
}: ProductVariantsProps) {
  if (!variants.length) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">
          انتخاب تنوع
        </h3>

        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => {
            const isSelected = selectedVariantId === variant.id;
            const isOutOfStock = variant.stock <= 0;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => onVariantChange(variant)}
                className={`
                  relative min-w-30 rounded-xl border-2 px-4 py-3
                  transition-all duration-200
                  ${
                    isSelected
                      ? "border-pink-500 bg-pink-50 shadow-md shadow-pink-100"
                      : "border-gray-200 bg-white hover:border-pink-300"
                  }
                  ${
                    isOutOfStock
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  {variant.hexCode && (
                    <span
                      className="h-5 w-5 rounded-full border border-gray-300 shadow-sm"
                      style={{
                        backgroundColor: variant.hexCode,
                      }}
                    />
                  )}

                  <span
                    className={`font-medium ${
                      isSelected
                        ? "text-pink-600"
                        : "text-gray-700"
                    }`}
                  >
                    {variant.name}
                  </span>
                </div>

                {variant.price > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    {variant.price.toLocaleString()} تومان
                  </div>
                )}

                {isOutOfStock && (
                  <div className="mt-1 text-xs text-red-500">
                    ناموجود
                  </div>
                )}

                {isSelected && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedVariantId && (
        <div className="rounded-xl bg-white/70 p-4">
          {(() => {
            const selectedVariant = variants.find(
              (variant) => variant.id === selectedVariantId,
            );

            if (!selectedVariant) return null;

            return (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">
                    تنوع:
                  </span>{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedVariant.name}
                  </span>
                </div>

                {selectedVariant.size && (
                  <div>
                    <span className="text-gray-500">
                      سایز:
                    </span>{" "}
                    <span className="font-semibold">
                      {selectedVariant.size}
                    </span>
                  </div>
                )}

                {selectedVariant.volume !== undefined &&
                  selectedVariant.volume !== null &&
                  selectedVariant.volume > 0 && (
                    <div>
                      <span className="text-gray-500">
                        حجم:
                      </span>{" "}
                      <span className="font-semibold">
                        {selectedVariant.volume}{" "}
                        {selectedVariant.volumeUnit}
                      </span>
                    </div>
                  )}

                <div>
                  <span className="text-gray-500">
                    موجودی:
                  </span>{" "}
                  <span
                    className={
                      selectedVariant.stock > 0
                        ? "font-semibold text-green-600"
                        : "font-semibold text-red-500"
                    }
                  >
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} عدد`
                      : "ناموجود"}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}