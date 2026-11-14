"use client";

import Link from "next/link";
import { Check, Share2 } from "lucide-react";


import type { Product } from "@/src/shared/types/product";
import { useProductShare } from "@/src/shared/hooks/product/useProductShare";
import { getCategoryName } from "@/src/components/categories/CategoryItems";

interface ProductHeaderProps {
  product: Product;
  sku?: string | null;
}

export function ProductHeader({
  product,
  sku,
}: ProductHeaderProps) {
  const { copied, handleShare } = useProductShare({
    title: product.name,
  });

  const shortDescription =
    product.description && product.description.length > 180
      ? `${product.description.slice(0, 180)}…`
      : product.description;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2 text-sm ">
        <div className="flex items-center gap-2">
          {product.brand && (
            <>
              <span className="font-semibold text-pink-600">
                {product.brand}
              </span>

              <span className="text-gray-300">|</span>
            </>
          )}

          <Link
            href={`/products/${product.scope}/${product.category}`}
            className="text-gray-500 transition-colors hover:text-pink-600"
          >
            {getCategoryName(product.category)}
          </Link>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-pink-600"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              کپی شد
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              اشتراک‌گذاری
            </>
          )}
        </button>
      </div>

      <h1 className="text-xl font-bold leading-tight text-gray-800 md:text-4xl">
        {product.name}
      </h1>

      {sku && (
        <p className="mt-1 text-xs text-gray-400">
          کد محصول: {sku}
        </p>
      )}

      {shortDescription && (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {shortDescription}
        </p>
      )}
    </div>
  );
}