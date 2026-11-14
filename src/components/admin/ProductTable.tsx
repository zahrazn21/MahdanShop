"use client";

import { Product } from "@/src/shared/types/product";
import { getCategoryName, categories } from "../categories/CategoryItems";
import {
  Edit,
  Trash2,
  PackageX,
  ImageOff,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
}

type AvailabilityFilter = "ALL" | "IN_STOCK" | "PRE_ORDER";
type StatusFilter = "ALL" | "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";

type StockFilter = "ALL" | "IN_STOCK" | "OUT_OF_STOCK";

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
      {error || !src ? (
        <ImageOff className="h-5 w-5 text-gray-300" />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={64}
          height={64}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

function AvailabilityBadge({
  availabilityType,
}: {
  availabilityType: Product["availabilityType"];
}) {
  if (availabilityType === "PRE_ORDER") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        <ShoppingBag className="h-3.5 w-3.5" />
        وارداتی
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <Package className="h-3.5 w-3.5" />
      داخلی
    </span>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  const config = {
    ACTIVE: {
      label: "فعال",
      className: "bg-green-50 text-green-600",
    },
    DRAFT: {
      label: "پیش‌نویس",
      className: "bg-gray-100 text-gray-500",
    },
    OUT_OF_STOCK: {
      label: "ناموجود",
      className: "bg-amber-50 text-amber-600",
    },
    ARCHIVED: {
      label: "آرشیو",
      className: "bg-red-50 text-red-500",
    },
  } as const;

  const item = config[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("ALL");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");

  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      if (normalizedSearch) {
        const searchableText = [
          product.name,
          product.slug,
          product.sku,
          product.brand,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) {
          return false;
        }
      }
      if (
        availabilityFilter !== "ALL" &&
        product.availabilityType !== availabilityFilter
      ) {
        return false;
      }
      if (statusFilter !== "ALL" && product.status !== statusFilter) {
        return false;
      }
      if (stockFilter === "IN_STOCK" && product.stock <= 0) {
        return false;
      }

      if (stockFilter === "OUT_OF_STOCK" && product.stock > 0) {
        return false;
      }
      if (categoryFilter !== "ALL" && product.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [
    products,
    search,
    availabilityFilter,
    statusFilter,
    stockFilter,
    categoryFilter,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    availabilityFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    stockFilter !== "ALL" ||
    categoryFilter !== "ALL";

  const resetFilters = () => {
    setSearch("");
    setAvailabilityFilter("ALL");
    setStatusFilter("ALL");
    setStockFilter("ALL");
    setCategoryFilter("ALL");
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
     
      <div className="border-b border-gray-100 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-md">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو نام، برند یا SKU..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-10 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-500/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-xs text-gray-400">
              {filteredProducts.length} از {products.length} محصول
            </span>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                showFilters || hasActiveFilters
                  ? "border-pink-200 bg-pink-50 text-pink-600"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              فیلترها
              {hasActiveFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] text-white">
                  فعال
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  نوع تأمین
                </label>

                <select
                  value={availabilityFilter}
                  onChange={(e) =>
                    setAvailabilityFilter(e.target.value as AvailabilityFilter)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-pink-400"
                >
                  <option value="ALL">همه</option>
                  <option value="IN_STOCK">داخلی — موجود در انبار</option>
                  <option value="PRE_ORDER">وارداتی — پیش‌سفارش</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  وضعیت انتشار
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-pink-400"
                >
                  <option value="ALL">همه وضعیت‌ها</option>
                  <option value="ACTIVE">فعال</option>
                  <option value="DRAFT">پیش‌نویس</option>
                  <option value="OUT_OF_STOCK">ناموجود</option>
                  <option value="ARCHIVED">آرشیو</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  موجودی
                </label>

                <select
                  value={stockFilter}
                  onChange={(e) =>
                    setStockFilter(e.target.value as StockFilter)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-pink-400"
                >
                  <option value="ALL">همه</option>
                  <option value="IN_STOCK">موجود</option>
                  <option value="OUT_OF_STOCK">ناموجود</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                  دسته‌بندی
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-pink-400"
                >
                  <option value="ALL">همه دسته‌بندی‌ها</option>

                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-xs text-gray-500">فیلتر فعال است</span>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-gray-400">
          <PackageX className="h-10 w-10" />

          <span className="text-sm">
            {hasActiveFilters
              ? "محصولی با این فیلترها پیدا نشد"
              : "محصولی یافت نشد"}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg bg-pink-50 px-3 py-2 text-xs font-medium text-pink-600 hover:bg-pink-100"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  تصویر
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  نام محصول
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  نوع تأمین
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  برند
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  قیمت
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  موجودی
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  دسته
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  وضعیت
                </th>

                <th className="p-4 text-right text-sm font-semibold text-gray-600">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const hasDiscount =
                  product.originalPrice != null &&
                  product.originalPrice > product.price;

                const isPreOrder = product.availabilityType === "PRE_ORDER";

                return (
                  <tr
                    key={product.id}
                    className="border-b transition-colors last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <ProductImage src={product.image} alt={product.name} />
                    </td>
                    <td className="max-w-60 p-4">
                      <span
                        className="line-clamp-2 text-sm font-medium text-gray-800"
                        title={product.name}
                      >
                        {product.name}
                      </span>

                      {product.sku && (
                        <span className="mt-0.5 block text-xs text-gray-400">
                          کد: {product.sku}
                        </span>
                      )}

                      {isPreOrder && product.estimatedDeliveryDays != null && (
                        <span className="mt-1 block text-xs text-amber-600">
                          تأمین حدود {product.estimatedDeliveryDays} روز
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <AvailabilityBadge
                        availabilityType={product.availabilityType}
                      />

                      {isPreOrder && product.batch && (
                        <span className="mt-1 block whitespace-nowrap text-[11px] text-gray-400">
                          {product.batch.title}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-500">
                        {product.brand || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="whitespace-nowrap text-sm font-semibold text-pink-600">
                          {product.price.toLocaleString()} تومان
                        </span>

                        {hasDiscount && (
                          <span className="whitespace-nowrap text-xs text-gray-400 line-through">
                            {product.originalPrice!.toLocaleString()} تومان
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {isPreOrder ? (
                        <span className="inline-flex whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          پیش‌سفارش
                        </span>
                      ) : (
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                            product.isAvailable && product.stock > 0
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {product.isAvailable && product.stock > 0
                            ? `${product.stock} عدد`
                            : "ناموجود"}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="whitespace-nowrap text-sm text-gray-500">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge
                        status={
                          product.status === "OUT_OF_STOCK" &&
                          product.isAvailable &&
                          product.stock > 0
                            ? "ACTIVE"
                            : product.status
                        }
                      />{" "}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          aria-label={`ویرایش ${product.name}`}
                          className="rounded-lg p-1.5 text-blue-500 transition-colors hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(product.id, product.name)}
                          aria-label={`حذف ${product.name}`}
                          className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
