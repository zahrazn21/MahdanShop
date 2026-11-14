/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useProducts } from "../shared/hooks/useProducts";

export default function AllProductsTest() {
  const {
    data,
    isLoading,
    error,
  } = useProducts({
    scope: "imported",
    category: "lego",
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return <p>در حال بارگذاری...</p>;
  }

  if (error instanceof Error) {
    return <p>خطا: {error.message}</p>;
  }

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  if (products.length === 0) {
    return <p>محصولی یافت نشد</p>;
  }

  console.log("data:", data);
  console.log("products:", products);
  console.log("pagination:", pagination);

  return (
    <div dir="rtl" className="space-y-4 p-6">
      <div>
        <h2 className="text-xl font-bold">
          محصولات وارداتی
        </h2>

        {pagination && (
          <p className="text-sm text-gray-500">
            {pagination.totalProducts.toLocaleString("fa-IR")} محصول
            {" - "}
            صفحه{" "}
            {pagination.currentPage.toLocaleString("fa-IR")}
            {" از "}
            {pagination.totalPages.toLocaleString("fa-IR")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {products.map((p:any) => (
          <div
            key={p.id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <p className="font-bold">
              {p.name}
            </p>

            <p className="text-gray-600">
              {p.price.toLocaleString("fa-IR")} تومان
            </p>

            <p className="text-sm text-gray-400">
              موجودی: {p.stock.toLocaleString("fa-IR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}