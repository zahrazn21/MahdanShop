"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useProducts } from "@/src/shared/hooks/useProducts";
import { Product } from "@/src/shared/types/product";
import { getCategoryName } from "../categories/CategoryItems";
import ProductCard from "./ProductCard";
import ProductsEmpty from "./ProductsEmpty";
import ProductsPagination from "./ProductsPagination";
import ProductsGridSkeleton from "../../shared/ui/ProductsGridSkeleton";

type Scope = "domestic" | "imported" | "all";

type Props = {
  scope: Scope;
  category?: string;
  categoryName?: string;
};

const scopeTitles: Record<Scope, string> = {
  all: "همه محصولات",
  imported: "محصولات وارداتی",
  domestic: "محصولات داخلی",
};

const gridClass =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6";

const toPositiveInt = (value: string | null, fallback: number) => {
  const n = Number(value ?? fallback);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export default function AllProducts({ scope, category, categoryName }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentScope = (searchParams.get("scope") || scope || "all") as Scope;
  const currentCategory =
    category?.trim() || searchParams.get("category")?.trim() || "";
  const search = searchParams.get("search")?.trim() || "";
  const currentPage = toPositiveInt(searchParams.get("page"), 1);
  const limit = toPositiveInt(searchParams.get("limit"), 30);

  const { data, isLoading, error } = useProducts({
    scope: currentScope,
    category: currentCategory,
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    search,
    page: currentPage,
    limit,
  });

  const products: Product[] = data?.products ?? [];
  const pagination = data?.pagination;

  const changePage = (page: number) => {
    if (!pagination || page < 1 || page > pagination.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const title = search
    ? `نتایج جستجو برای «${search}»`
    : categoryName ||
      (currentCategory
        ? getCategoryName(currentCategory)
        : (scopeTitles[currentScope] ?? scopeTitles.all));

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>

          <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-500">
            {isLoading
              ? "در حال بارگذاری..."
              : `${(pagination?.totalProducts ?? 0).toLocaleString("fa-IR")} عدد`}
          </span>
        </div>

        {pagination && pagination.totalPages > 0 && (
          <span className="text-sm text-gray-400">
            صفحه {pagination.currentPage.toLocaleString("fa-IR")} از{" "}
            {pagination.totalPages.toLocaleString("fa-IR")}
          </span>
        )}
      </div>

      {isLoading ? (
        <ProductsGridSkeleton className={gridClass} />
      ) : error ? (
        <div className="rounded-xl bg-red-50 py-10 text-center text-red-600">
          {error instanceof Error ? error.message : "خطا در دریافت محصولات"}
        </div>
      ) : products.length === 0 ? (
        <ProductsEmpty scope={currentScope} category={currentCategory} />
      ) : (
        <>
          <div className={gridClass}>
            {products.map((product) => (
              <ProductCard key={product.id} productItems={product} />
            ))}
          </div>

          {pagination && (
            <ProductsPagination
              pagination={pagination}
              onPageChange={changePage}
            />
          )}
        </>
      )}
    </div>
  );
}