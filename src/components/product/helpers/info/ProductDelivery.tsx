import {
  Clock3,
  PackageCheck,
  Plane,
} from "lucide-react";

import type { Product } from "@/src/shared/types/product";

interface ProductDeliveryProps {
  product: Product;
  isPreOrder: boolean;
  hasBatch: boolean;
}

export function ProductDelivery({
  product,
  isPreOrder,
  hasBatch,
}: ProductDeliveryProps) {
  const estimatedDeliveryDays =
    product.estimatedDeliveryDays;

  const deliveryText =
    isPreOrder
      ? estimatedDeliveryDays && estimatedDeliveryDays > 0
        ? `تأمین تقریبی: ${estimatedDeliveryDays} روز`
        : "تأمین این محصول پس از ثبت سفارش انجام می‌شود"
      : estimatedDeliveryDays && estimatedDeliveryDays > 0
        ? `ارسال تقریبی: ${estimatedDeliveryDays} روز`
        : "آماده ارسال";

  return (
    <div className="space-y-3 rounded-2xl border border-pink-100 bg-white/60 p-4">
      <div className="flex items-center gap-2">
        {isPreOrder ? (
          <Plane className="h-5 w-5 text-pink-500" />
        ) : (
          <PackageCheck className="h-5 w-5 text-green-500" />
        )}

        <span className="font-semibold text-gray-700">
          {isPreOrder
            ? "محصول وارداتی / پیش‌سفارش"
            : "محصول آماده ارسال"}
        </span>
      </div>

      <div className="flex items-start gap-2 text-sm text-gray-600">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />

        <span>{deliveryText}</span>
      </div>

      {isPreOrder && product.batch && (
        <div className="space-y-2 rounded-xl border border-purple-100 bg-purple-50 p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">
              دوره سفارش‌گیری
            </span>

            <span className="font-semibold text-purple-700">
              {product.batch.title}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">
              وضعیت دوره
            </span>

            <span
              className={
                product.batch.status === "OPEN"
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-500"
              }
            >
              {product.batch.status === "OPEN"
                ? "در حال سفارش‌گیری"
                : "بسته"}
            </span>
          </div>
        </div>
      )}

      {isPreOrder && (
        <div className="rounded-xl bg-pink-50 p-3 text-sm leading-relaxed text-gray-600">
          این محصول به صورت پیش‌سفارش تأمین می‌شود. هزینه باربری وارداتی در
          زمان رسیدن کالا، بر اساس وزن واقعی و نرخ روز محاسبه و جداگانه از شما
          دریافت خواهد شد.
        </div>
      )}

      {isPreOrder && !hasBatch && (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
          در حال حاضر دوره سفارش‌گیری این محصول مشخص نشده است.
        </div>
      )}
    </div>
  );
}