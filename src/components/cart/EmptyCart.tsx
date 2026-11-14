'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';

export default function EmptyCart() {
  return (
    // <div className="text-center py-16">
    //   <div className="w-24 h-24   flex items-center justify-center mx-auto mb-6">
    //     <ShoppingBag className="w-12 h-12 text-pink-500" />
    //   </div>
    //   <h2 className="text-2xl font-bold text-gray-800 mb-2">
    //     سبد خرید شما خالی است!
    //   </h2>
    //   <p className="text-gray-500 mb-6">
    //     محصولات مورد علاقه خود را به سبد خرید اضافه کنید
    //   </p>
    //   <Link
    //     href="/products"
    //     className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
    //   >
    //     شروع خرید
    //     <ArrowRight className="w-4 h-4" />
    //   </Link>
    // </div>
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-16 h-16 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ! سبد خرید شما خالی است
          </h2>
          <p className="text-gray-500 mb-6">
            محصولات مورد علاقه خود را به سبد خرید اضافه کنید
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
          >
            شروع خرید
          </Link>
        </div>
      </div>
  );
}