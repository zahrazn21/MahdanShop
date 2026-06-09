// app/components/product/Filters.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown } from "lucide-react";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
    console.log("searchParams",searchParams);

  const [isOpen, setIsOpen] = useState(false);
  
  // ✅ مستقیماً از searchParams استفاده کن، نه از state جداگانه
  const currentFilters = {
    scope: searchParams.get("scope") || "all",
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    available: searchParams.get("available") === "true",
    onSale: searchParams.get("onSale") === "true",
    inStock: searchParams.get("inStock") === "true",
  };

  const [localFilters, setLocalFilters] = useState(currentFilters);

  // همگام‌سازی زمانی که آدرس از بیرون عوض میشه
  // ولی با یه شرط که فقط در صورت واقعی تغییر کردن، آپدیت کنه
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams.toString());

  if (prevSearchParams !== searchParams.toString()) {
    setPrevSearchParams(searchParams.toString());
    // بدون useEffect، مستقیم در رندر
    setTimeout(() => {
      setLocalFilters(currentFilters);
    }, 0);
  }


  console.log("currentFilters",currentFilters);
  
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (localFilters.scope && localFilters.scope !== "all") params.set("scope", localFilters.scope);
    if (localFilters.sortBy && localFilters.sortBy !== "newest") params.set("sortBy", localFilters.sortBy);
    if (localFilters.minPrice) params.set("minPrice", localFilters.minPrice);
    if (localFilters.maxPrice) params.set("maxPrice", localFilters.maxPrice);
    if (localFilters.available) params.set("available", "true");
    if (localFilters.onSale) params.set("onSale", "true");
    if (localFilters.inStock) params.set("inStock", "true");
    
    router.push(`/products?${params.toString()}`);
  };
  console.log("localFilters",localFilters);

  const resetFilters = () => {
    const newFilters = {
      scope: "all",
      sortBy: "newest",
      minPrice: "",
      maxPrice: "",
      available: false,
      onSale: false,
      inStock:false,
    };
    setLocalFilters(newFilters);
    router.push("/products");
  };

  const activeFiltersCount = [
    localFilters.scope !== "all",
    !!localFilters.minPrice,
    !!localFilters.maxPrice,
    localFilters.available,
    localFilters.onSale,
  ].filter(Boolean).length;

  return (
    <div dir="rtl" className="md:my-10 mb-5 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* بقیه کد همینطور باقی میمونه، فقط به جای filters از localFilters استفاده کن */}
      <div className="lg:hidden p-4 border-b flex justify-between items-center">
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
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        
        {activeFiltersCount > 0 && (
          <button onClick={resetFilters} className="text-sm text-pink-600">
            حذف همه
          </button>
        )}
      </div>

      <div className={`p-4 space-y-5 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* فیلتر scope */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">نوع محصول</label>
          <div className="flex gap-2">
            {["all", "imported", "domestic"].map((scope) => (
              <button
                key={scope}
                onClick={() => setLocalFilters({ ...localFilters, scope })}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  localFilters.scope === scope
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {scope === "all" ? "همه" : scope === "imported" ? "وارداتی" : "داخلی"}
              </button>
            ))}
          </div>
        </div>

        {/* مرتب‌سازی */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">مرتب‌سازی</label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => setLocalFilters({ ...localFilters, sortBy: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
          >
            <option value="newest">جدیدترین</option>
            <option value="price_asc">ارزان‌ترین</option>
            <option value="price_desc">گران‌ترین</option>
            <option value="rating">محبوب‌ترین</option>
          </select>
        </div>

        {/* محدوده قیمت */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">محدوده قیمت</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="از"
              value={localFilters.minPrice}
              onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-gray-400 self-center">تا</span>
            <input
              type="number"
              placeholder="تا"
              value={localFilters.maxPrice}
              onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* فیلترهای چک‌باکس */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.available}
              onChange={(e) => setLocalFilters({ ...localFilters, available: e.target.checked ,inStock:e.target.checked})}
              className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
            />
            <span className="text-sm text-gray-600">فقط محصولات موجود</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.onSale}
              onChange={(e) => setLocalFilters({ ...localFilters, onSale: e.target.checked })}
              className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400"
            />
            <span className="text-sm text-gray-600">فقط محصولات تخفیف‌دار</span>
          </label>
        </div>

        {/* دکمه‌ها */}
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

        {/* نمایش فیلترهای فعال */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {localFilters.scope !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                {localFilters.scope === "imported" ? "وارداتی" : "داخلی"}
                <button onClick={() => setLocalFilters({ ...localFilters, scope: "all" })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.minPrice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                از {Number(localFilters.minPrice).toLocaleString()}
                <button onClick={() => setLocalFilters({ ...localFilters, minPrice: "" })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.maxPrice && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                تا {Number(localFilters.maxPrice).toLocaleString()}
                <button onClick={() => setLocalFilters({ ...localFilters, maxPrice: "" })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.available && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                موجود در انبار
                <button onClick={() => setLocalFilters({ ...localFilters, available: false })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.onSale && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                تخفیف‌دار
                <button onClick={() => setLocalFilters({ ...localFilters, onSale: false })}>
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