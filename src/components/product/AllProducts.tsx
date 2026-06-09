"use client";

import ProductCard from "./ProductCard";
import { useSearchParams } from "next/navigation";
import { Product } from "./ProductItems";
import { useProducts } from "@/src/shared/hooks/useProducts";

type Props = {
  scope: "domestic" | "imported" | "all";
  category?: string;
};


export default function AllProducts({ scope, category }: Props) {

  const searchParams = useSearchParams();
  const currentScope = searchParams.get("scope") || scope || "all";
  const currentSortBy = searchParams.get("sortBy") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";

  const { data, isLoading , error } = useProducts({scope:currentScope,sortBy:currentSortBy,minPrice,maxPrice,inStock,onSale});
 
  
  return (
    <div dir="rtl" className="space-y-6">

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">محصولات</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {isLoading ? "در حال بارگذاری..." : `${data.length} عدد`}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600 bg-red-50 rounded-xl">
          {error.message}
        </div>
      ) : data.length === 0 ? (
        <EmptyState scope={scope} category={category} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {data.map((product:Product) => (
            <ProductCard key={product.id} productItems={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ scope, category }: { scope: Props["scope"]; category?: string }) {
  return (
    <div className="text-center py-16 bg-linear-to-br from-pink-50 to-rose-50 rounded-2xl">
      <div className="text-6xl mb-4">🛍️</div>
      <p className="text-gray-500 font-medium">محصولی یافت نشد</p>
      <p className="text-sm text-gray-400 mt-1">
        {scope === "domestic"
          ? "محصولات داخلی"
          : scope === "imported"
          ? "محصولات وارداتی"
          : "همه محصولات"}
        {category && ` در دسته ${getCategoryName(category)}`} موجود نیست
      </p>
    </div>
  );
}

function getCategoryName(slug: string): string {
  const categories: Record<string, string> = {
    cosmetics: "لوازم آرایشی",
    stationery: "لوازم تحریر",
    "cute-items": "آیتم‌های فانتزی",
  };
  return categories[slug] || slug;
}
