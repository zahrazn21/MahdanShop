/* eslint-disable @typescript-eslint/no-explicit-any */
// app/products/@featured/page.tsx
"use client";

import ProductCard from "@/src/components/product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await fetch("/api/products?featured=true");
      const data = await res.json();
      return data.products || data;
    },
  });

  const products = data?.slice(0, 8) || [];

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-bold text-gray-800">محصولات ویژه</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div dir="rtl" className="my-20 bg-linear-to-r from-pink-50 to-rose-50 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-bold text-gray-800">✨ محصولات ویژه</h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            پرفروش‌ترین‌ها
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            جدیدترین‌ها
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} productItems={product} />
        ))}
      </div>
    </div>
  );
}