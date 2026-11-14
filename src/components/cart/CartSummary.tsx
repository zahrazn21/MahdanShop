"use client";

import { useState } from "react";
import {
  Tag,
  ChevronLeft,
  FileText,
  ShieldCheck,
  Info,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

type ShippingPaymentMode = "IMMEDIATE" | "DEFERRED";

interface CartSummaryProps {
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  shippingCost: number;
  hasImportedItems?: boolean;
  shippingPaymentMode: ShippingPaymentMode;
  onShippingPaymentModeChange: (mode: ShippingPaymentMode) => void;
  importedFreightAccepted: boolean;
  onImportedFreightAcceptedChange: (accepted: boolean) => void;
  hasDomesticItems?: boolean;
  onApplyCoupon?: (code: string) => void;
  onCheckout?: () => void;
}
export default function CartSummary({
  totalPrice,
  totalDiscount,
  finalPrice,
  shippingCost,
  hasImportedItems = false,
  shippingPaymentMode,
  onShippingPaymentModeChange,
  importedFreightAccepted,
  onImportedFreightAcceptedChange,
  hasDomesticItems,
  onApplyCoupon,
  onCheckout,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [showImportedDetails, setShowImportedDetails] = useState(false);
  const canCheckout =
    !!onCheckout && (!hasImportedItems || importedFreightAccepted);

  return (
    <div
      className="sticky top-6 bg-(--color-pink-light) rounded-4xl shadow-sm shadow-pink-200 border border-white p-6"
      dir="rtl"
    >
      <div className="flex items-center gap-2 justify-center mb-10">
        <FileText className="w-6 h-6 drop-shadow-pink-300 drop-shadow-[2px_4px_6px_rgba(236,72,153,0.15)]" />

        <h3 className="text-lg font-bold text-gray-800">خلاصه سبد خرید</h3>
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
          {!hasDomesticItems ? (
            <span className="text-gray-500 text-sm">بعداً مشخص می‌شود</span>
          ) : shippingPaymentMode === "DEFERRED" ? (
            <span className="text-gray-500 text-sm">
              پس از قطعی شدن حجم مرسوله محاسبه می‌شود
            </span>
          ) : shippingCost === 0 ? (
            <span className="text-green-600">رایگان</span>
          ) : (
            <span>{shippingCost.toLocaleString()} تومان</span>
          )}
        </div>

        {hasImportedItems && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <Info className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">
                    محصول وارداتی در سبد شماست
                  </p>

                  <p className="text-xs text-amber-700 mt-1">
                    هزینه باربری و ارسال داخلی محصول وارداتی بعداً محاسبه
                    می‌شود.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportedDetails((prev) => !prev)}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
              >
                <span>
                  {showImportedDetails
                    ? "بستن جزئیات"
                    : "مشاهده جزئیات و شرایط"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showImportedDetails ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showImportedDetails ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4">
                  <div className="border-t border-amber-200 pt-3 text-xs leading-6 text-amber-800">
                    <p>
                      {hasDomesticItems
                        ? "مبلغی که اکنون پرداخت می‌کنید شامل قیمت محصولات و هزینه ارسال کالای موجود ایران است."
                        : "مبلغی که اکنون پرداخت می‌کنید فقط شامل قیمت محصول است."}
                    </p>
                    <p className="mt-2">
                      هزینه ارسال داخلی محصول وارداتی، همراه با هزینه باربری آن،
                      پس از رسیدن کالا محاسبه و از شما درخواست خواهد شد.
                    </p>

                    <p className="mt-2">
                      هزینه باربری وارداتی در این مرحله مشخص نیست و پس از رسیدن
                      کالا و مشخص شدن وزن و هزینه واقعی باربری محاسبه خواهد شد.
                    </p>

                    <p className="mt-2">
                      مبلغ باربری پس از مشخص شدن به شما اعلام می‌شود و پرداخت آن
                      برای ارسال نهایی کالا الزامی است.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <label className="flex items-start gap-3 px-4 py-4 border-t border-amber-200 bg-amber-100/50 cursor-pointer">
              <input
                type="checkbox"
                checked={importedFreightAccepted}
                onChange={(e) =>
                  onImportedFreightAcceptedChange(e.target.checked)
                }
                className="mt-1 w-4 h-4 accent-pink-500 cursor-pointer"
              />

              <span className="text-xs leading-5 text-amber-900">
                متوجه شدم
              </span>
            </label>
          </div>
        )}

        {shippingCost > 0 && (
          <div className="rounded-2xl border border-pink-200 bg-white p-4">
            <div className="mb-4">
              <p className="font-semibold text-gray-800">
                نحوه پرداخت هزینه ارسال داخلی
              </p>

              <p className="text-xs text-gray-500 mt-1 leading-5">
                هزینه ارسال داخلی برای بسته شما محاسبه شده است. می‌توانید آن را
                اکنون پرداخت کنید یا به بعد موکول کنید.
              </p>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  shippingPaymentMode === "IMMEDIATE"
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="shippingPaymentMode"
                  value="IMMEDIATE"
                  checked={shippingPaymentMode === "IMMEDIATE"}
                  onChange={() => onShippingPaymentModeChange("IMMEDIATE")}
                  className="mt-1 accent-pink-500"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    پرداخت هزینه ارسال الان
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {shippingCost.toLocaleString()} تومان همراه مبلغ سفارش
                    پرداخت می‌شود.
                  </p>
                </div>
              </label>
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  shippingPaymentMode === "DEFERRED"
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="shippingPaymentMode"
                  value="DEFERRED"
                  checked={shippingPaymentMode === "DEFERRED"}
                  onChange={() => onShippingPaymentModeChange("DEFERRED")}
                  className="mt-1 accent-pink-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    پرداخت هزینه ارسال بعداً
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    مبلغ محصول را اکنون پرداخت می‌کنید. هزینه ارسال داخلی بعداً
                    به عنوان بدهی شما ثبت می‌شود و حداکثر تا یک ماه فرصت پرداخت
                    آن را دارید.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
        <div className="border-t pt-3 mt-3 border-pink-200">
          <div className="flex justify-between font-bold text-lg">
            <span>قابل پرداخت</span>
            <span className="text-pink-600">
              {finalPrice.toLocaleString()} تومان
            </span>
          </div>
          {hasImportedItems && (
            <p className="text-xs text-gray-500 mt-2 leading-5">
              مبلغ باربری و هزینه ارسال محصول وارداتی در این مبلغ لحاظ نشده است.
            </p>
          )}
        </div>
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
        <div className="mt-6 space-y-3">
          <button
            onClick={onCheckout}
            disabled={!canCheckout}
            className="w-full bg-pink-500 text-white py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ادامه فرآیند خرید
          </button>

          {hasImportedItems && !importedFreightAccepted && (
            <p className="text-center text-xs text-amber-600">
              برای ادامه خرید، تأیید هزینه باربری وارداتی الزامی است.
            </p>
          )}

          <Link
            href="/products"
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-pink-600 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            بازگشت به فروشگاه
          </Link>
        </div>
        <div
          className="bg-white contrast-110 rounded-2xl p-4 shadow-sm shadow-pink-200 border border-white"
          style={{
            backgroundImage: "url('/images/bg_point.png')",
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
