// app/products/not-found.tsx
"use client";

import Link from "next/link";
import { PackageX, Home, ShoppingBag } from "lucide-react";

export default function ProductsNotFound() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-24 h-24  rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageX className="w-12 h-12 text-pink-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          صفحه محصولات یافت نشد
        </h2>
        
        <p className="text-gray-500 mb-6">
          متأسفیم، صفحه مورد نظر شما وجود ندارد.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/products"
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            مشاهده محصولات
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}