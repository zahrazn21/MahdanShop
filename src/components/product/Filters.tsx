"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  X,
  ChevronDown,
  MapPin,
  Check,
  Globe2,
  Package,
} from "lucide-react";
import { categories, getCategoryName } from "../categories/CategoryItems";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentFilters = {
    scope: searchParams.get("scope") || "all",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    onSale: searchParams.get("onSale") === "true",
    inStock: searchParams.get("inStock") === "true",
  };
  const categoryGroups = [
    { id: "beauty", name: "زیبایی و مراقبت" },
    { id: "shop", name: "فروشگاه" },
  ] as const;
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const [prevSearchParams, setPrevSearchParams] = useState(
    searchParams.toString(),
  );

  if (prevSearchParams !== searchParams.toString()) {
    setPrevSearchParams(searchParams.toString());
    setTimeout(() => {
      setLocalFilters(currentFilters);
    }, 0);
  }

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (localFilters.scope && localFilters.scope !== "all")
      params.set("scope", localFilters.scope);
    if (localFilters.sortBy && localFilters.sortBy !== "newest")
      params.set("sortBy", localFilters.sortBy);
    if (localFilters.minPrice) params.set("minPrice", localFilters.minPrice);
    if (localFilters.maxPrice) params.set("maxPrice", localFilters.maxPrice);
    if (localFilters.onSale) params.set("onSale", "true");
    if (localFilters.inStock) params.set("inStock", "true");

    router.push(`/products?${params.toString()}`);
  };
  const resetFilters = () => {
    const newFilters = {
      scope: "all",
      sortBy: "newest",
      minPrice: "",
      maxPrice: "",
      onSale: false,
      inStock: false,
      category: "",
    };
    setLocalFilters(newFilters);
    router.push("/products");
  };

  const activeFiltersCount = [
    localFilters.scope !== "all",
    !!localFilters.category,
    !!localFilters.minPrice,
    !!localFilters.maxPrice,
    localFilters.onSale,
    localFilters.inStock,
  ].filter(Boolean).length;
  return (
    <div
      dir="rtl"
      className="md:my-10 mb-5 bg-white rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="lg:hidden p-4  flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700"
        >
          <Filter className="w-5 h-5" />
          <span>فیلترها</span>
          {activeFiltersCount > 0 && (
            <span className="bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {activeFiltersCount > 0 && (
          <button onClick={resetFilters} className="text-sm text-pink-600">
            حذف همه
          </button>
        )}
      </div>

      <div className={`p-4 space-y-5 ${isOpen ? "block" : "hidden lg:block"}`}>
        <div className="rounded-3xl border border-pink-100 bg-linear-to-br from-pink-50 via-white to-rose-50 p-4 shadow-sm">
          <div className="mb-4 text-center">
            <div className="mb-2 flex justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500 text-white shadow-lg">
                <Package className="h-5 w-5" />
              </div>
            </div>

            <h3 className="text-lg font-extrabold text-gray-800">
              چه محصولی می‌خوای؟
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              نوع محصولات مورد نظرت رو انتخاب کن
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => setLocalFilters({ ...localFilters, scope: "all" })}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition-all duration-200 ${
                localFilters.scope === "all"
                  ? "border-pink-400 bg-pink-50 text-pink-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    localFilters.scope === "all"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Package className="h-5 w-5" />
                </div>

                <span className="text-sm font-semibold">همه محصولات</span>
              </div>

              {localFilters.scope === "all" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setLocalFilters({ ...localFilters, scope: "imported" })
              }
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition-all duration-200 ${
                localFilters.scope === "imported"
                  ? "border-pink-400 bg-pink-50 text-pink-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    localFilters.scope === "imported"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Globe2 className="h-5 w-5" />
                </div>

                <span className="text-sm font-semibold">محصولات وارداتی</span>
              </div>

              {localFilters.scope === "imported" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setLocalFilters({ ...localFilters, scope: "domestic" })
              }
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-right transition-all duration-200 ${
                localFilters.scope === "domestic"
                  ? "border-pink-400 bg-pink-50 text-pink-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-pink-200 hover:bg-pink-50/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    localFilters.scope === "domestic"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                </div>

                <span className="text-sm font-semibold">محصولات داخلی</span>
              </div>

              {localFilters.scope === "domestic" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            دسته‌بندی
          </label>

          <div className="space-y-3">
            {categoryGroups.map((group) => (
              <div key={group.id}>
                <p className="mb-1.5 text-xs text-gray-400">{group.name}</p>

                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((c) => c.group === group.id)
                    .map((c) => {
                      const active = localFilters.category === c.slug;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setLocalFilters({
                              ...localFilters,
                              // کلیک دوباره روی دسته‌ی انتخاب‌شده، انتخاب رو برمی‌داره
                              category: active ? "" : c.slug,
                            })
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? "border-pink-400 bg-pink-500 text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-pink-200 hover:bg-pink-50"
                          }`}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            مرتب‌سازی
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                sortBy: e.target.value,
              })
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="newest">جدیدترین</option>

            <option value="price-low">ارزان‌ترین</option>

            <option value="price-high">گران‌ترین</option>

            <option value="oldest">قدیمی‌ترین</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            محدوده قیمت
          </label>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="از"
              value={localFilters.minPrice}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  minPrice: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            <span className="self-center">تا</span>

            <input
              type="number"
              placeholder="تا"
              value={localFilters.maxPrice}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  maxPrice: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  inStock: e.target.checked,
                })
              }
              className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
            />
            <span className="text-sm text-gray-600">فقط محصولات موجود</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.onSale}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, onSale: e.target.checked })
              }
              className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
            />
            <span className="text-sm text-gray-600">فقط محصولات تخفیف‌دار</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={applyFilters}
            className="flex-1 bg-pink-500 text-white py-2 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors"
          >
            اعمال فیلتر
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-colors"
          >
            حذف همه
          </button>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 ">
            {localFilters.scope !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                {localFilters.scope === "imported" ? "وارداتی" : "داخلی"}
                <button
                  onClick={() =>
                    setLocalFilters({ ...localFilters, scope: "all" })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.minPrice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                از {Number(localFilters.minPrice).toLocaleString()}
                <button
                  onClick={() =>
                    setLocalFilters({ ...localFilters, minPrice: "" })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.maxPrice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                تا {Number(localFilters.maxPrice).toLocaleString()}
                <button
                  onClick={() =>
                    setLocalFilters({ ...localFilters, maxPrice: "" })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.inStock && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                موجود در انبار
                <button
                  onClick={() =>
                    setLocalFilters({ ...localFilters, inStock: false })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.onSale && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                تخفیف‌دار
                <button
                  onClick={() =>
                    setLocalFilters({ ...localFilters, onSale: false })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
