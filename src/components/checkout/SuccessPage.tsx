// components/checkout/SuccessPage.tsx
"use client";

import { CheckCircle, ShoppingBag, Download, Share2, Home } from "lucide-react";
import Link from "next/link";

interface SuccessPageProps {
  orderId: string;
  total: number;
  paymentMethod: string;
  onShare?: () => void;
}

export default function SuccessPage({
  orderId,
  total,
  paymentMethod,
  onShare,
}: SuccessPageProps) {
  return (
    <div className="bg-white rounded-4xl shadow-sm shadow-pink-100 border border-white p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        سفارش شما با موفقیت ثبت شد! 🎉
      </h2>
      <p className="text-gray-500 mb-6">
        از خرید شما متشکریم. سفارش شما در اسرع وقت ارسال خواهد شد.
      </p>

      <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-right">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">شماره سفارش</span>
            <span className="font-bold text-pink-600">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">مبلغ قابل پرداخت</span>
            <span className="font-bold">{total.toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">روش پرداخت</span>
            <span className="font-medium">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">وضعیت</span>
            <span className="text-green-600 font-medium">تایید شده</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/profile/orders"
          className="w-full bg-linear-to-l from-pink-500 to-pink-600 text-white py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          مشاهده سفارشات من
        </Link>

        <div className="flex gap-3">
          <button
            onClick={onShare}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            اشتراک‌گذاری
          </button>
          <Link
            href="/products"
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            بازگشت به فروشگاه
          </Link>
        </div>

        <button className="text-sm text-gray-500 hover:text-pink-600 transition-colors flex items-center justify-center gap-1 mt-4">
          <Download className="w-4 h-4" />
          دانلود فاکتور (PDF)
        </button>
      </div>
    </div>
  );
}