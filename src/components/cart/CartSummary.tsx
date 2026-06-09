// components/cart/CartSummary.tsx
"use client";

import { useState } from "react";
import { Tag, ChevronLeft, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface CartSummaryProps {
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  onApplyCoupon?: (code: string) => void;
}

export default function CartSummary({
  totalPrice,
  totalDiscount,
  finalPrice,
  onApplyCoupon,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [shippingCost] = useState(0);
  const shippingThreshold = 500000;

  const isFreeShipping = finalPrice >= shippingThreshold;

  return (
    <div className="bg-(--color-pink-light) rounded-4xl shadow-sm shadow-pink-200 border border-white p-6">
      <div className="flex  items-center gap-2 justify-center mb-10" dir="rtl">
        <FileText className="w-6 h-6 drop-shadow-pink-300 drop-shadow-[2px_4px_6px_rgba(236,72,153,0.15)]" />
        <h3 className="text-lg font-bold text-gray-800 ">خلاصه سبد خرید</h3>
      </div>
      <div className="space-y-8">
        <div className="flex justify-between">
          <span className="text-gray-600">قیمت کل محصولات</span>
          <span className="font-medium">
            {totalPrice.toLocaleString()} تومان
          </span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>تخفیف محصولات</span>
            <span>-{totalDiscount.toLocaleString()} تومان</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">هزینه ارسال</span>
          <div>
            {isFreeShipping ? (
              <span className="text-green-600">رایگان</span>
            ) : (
              <span className="text-gray-600">
                {shippingCost.toLocaleString()} تومان
              </span>
            )}
          </div>
        </div>

        {!isFreeShipping && finalPrice > 0 && (
          <div className="text-sm text-gray-400">
            {shippingThreshold - finalPrice} تومان دیگر تا ارسال رایگان
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>قابل پرداخت</span>
            <span className="text-pink-600">
              {finalPrice.toLocaleString()} تومان
            </span>
          </div>
        </div>

        {/* کد تخفیف */}
        {onApplyCoupon && (
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="کد تخفیف"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
              <button
                onClick={() => onApplyCoupon(couponCode)}
                className="px-4 py-2 border border-pink-500 text-pink-600 rounded-lg text-sm hover:bg-pink-50 transition-colors"
              >
                <Tag className="w-4 h-4 inline ml-1" />
                اعمال
              </button>
            </div>
          </div>
        )}

        {/* دکمه اقدام */}
        <div className="mt-6 space-y-3">
          <button className="w-full bg-pink-500 text-white py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors">
            ادامه فرآیند خرید
          </button>
          <Link
            href="/products"
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-pink-600 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            بازگشت به فروشگاه
          </Link>
        </div>


        {/*  امنیت */}
        <div
          className="bg-white contrast-110 rounded-2xl p-4 shadow-sm shadow-pink-200 border border-white"
          style={{
            backgroundImage: "url('/images/bg_point3.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 rounded-full p-2">
              <ShieldCheck className="w-7 h-7 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                اطلاعات شما محفوظ است
              </p>
              <p className="text-xs text-gray-500">
                پرداخت امن • ضمانت بازگشت کالا • تحویل سریع
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
