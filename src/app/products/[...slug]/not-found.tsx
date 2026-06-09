// app/products/[...slug]/not-found.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageX, Home, ShoppingBag, ChevronLeft } from "lucide-react";

export default function ProductCatchAllNotFound() {
  const router = useRouter();

  return (
    <div  className="min-h-[70vh]  flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-28 h-28 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageX className="w-14 h-14 text-pink-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          صفحه پیدا نشد
        </h1>
        
        <p dir="rtl" className="text-gray-500 mb-6">
          متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد.
          <br />
          لطفاً آدرس را بررسی کنید.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            بازگشت
          </button>
          
          <Link
            href="/products"
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            همه محصولات
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            صفحه اصلی
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 mb-2">آدرس درخواستی:</p>
          <code className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg block break-all">
            {typeof window !== "undefined" && window.location.pathname}
          </code>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-400 mb-3">مسیرهای معتبر:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/products" className="text-pink-500 text-sm hover:underline">
              /products
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/products/imported" className="text-pink-500 text-sm hover:underline">
              /products/imported
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/products/domestic" className="text-pink-500 text-sm hover:underline">
              /products/domestic
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/products/type/category/cosmetics" className="text-pink-500 text-sm hover:underline">
              /products/type/category/cosmetics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}