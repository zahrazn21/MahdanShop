// app/not-found.tsx
'use client';

import Link from 'next/link';
import { Home, ShoppingBag, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center">
        <div className="relative bg-linear-to-r from-pink-500 to-rose-500 p-8">
          <div className="text-8xl font-bold text-white opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-7xl font-bold text-white">:(</div>
          </div>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">صفحه پیدا نشد!</h2>
          <p className="text-gray-500 mb-6">
            متأسفیم، صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
          <div className="space-y-3 mb-8">
            <p className="text-sm text-gray-400">شاید این صفحات به کارتان بیایند:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/" className="text-pink-500 text-sm hover:underline">صفحه اصلی</Link>
              <span className="text-gray-300">•</span>
              <Link href="/products" className="text-pink-500 text-sm hover:underline">محصولات</Link>
              <span className="text-gray-300">•</span>
              <Link href="/categories" className="text-pink-500 text-sm hover:underline">دسته‌بندی‌ها</Link>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              صفحه اصلی
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}