// components/checkout/OrderSummary.tsx
"use client";

import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  Percent,
  ShieldCheck,
  Clock,
  Star,
} from "lucide-react";
import type { CheckoutCartItem } from "@/src/shared/types/checkout";

type ShippingPaymentMode = "IMMEDIATE" | "DEFERRED";

interface OrderSummaryProps {
  items: CheckoutCartItem[];

  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  shippingPaymentMode: ShippingPaymentMode;
  hasImportedItems?: boolean;
  hasDomesticItems?: boolean;
  onProceed: () => void;
  currentStep: number;
  canProceed?: boolean;
  isLoading?: boolean;
  userPoints?: number;
  estimatedDelivery?: string;
}

export default function OrderSummary({
  items,
  subtotal,
  discount,
  shippingCost,
  total,
  shippingPaymentMode,
  hasImportedItems,
  hasDomesticItems,
  onProceed,
  currentStep,
  canProceed = true,
  isLoading = false,
  userPoints = 0,
  estimatedDelivery = "۳-۵ روز کاری",
}: OrderSummaryProps) {
  const hasItems = items.length > 0;

  const buttonText = () => {
    switch (currentStep) {
      case 1:
        return "ادامه به روش پرداخت";

      case 2:
        return "ادامه به تایید سفارش";

      case 3:
        return "ثبت نهایی سفارش";

      default:
        return "ادامه";
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const shippingToPayNow =
    shippingPaymentMode === "IMMEDIATE" ? shippingCost : 0;

  const payableTotal = subtotal - discount + shippingToPayNow;

  return (
    <div
      className="
      bg-white
      rounded-4xl
      shadow-sm
      shadow-pink-100
      p-6
      sticky
      top-8
    "
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-pink-500" />

          <h3 className="font-bold text-lg">خلاصه سفارش</h3>
        </div>

        <span
          className="
          text-xs
          bg-pink-50
          text-pink-600
          px-3
          py-1
          rounded-full
        "
        >
          {itemCount} کالا
        </span>
      </div>
      {hasItems ? (
        <div
          className="
          space-y-3
          max-h-72
          overflow-y-auto
        "
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="
                flex
                gap-3
                p-2
                rounded-xl
                hover:bg-pink-50
              "
            >
              {item.image && (
                <div
                  className="
                  w-14
                  h-14
                  rounded-xl
                  overflow-hidden
                  bg-gray-100
                  shrink-0
                "
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="flex-1">
                <p
                  className="
                  text-sm
                  font-semibold
                  text-gray-800
                "
                >
                  {item.name}
                </p>

                <div
                  className="
                  text-xs
                  text-gray-500
                  mt-1
                  space-y-1
                "
                >
                  {item.selectedColor && <div>رنگ: {item.selectedColor}</div>}

                  {item.selectedSize && <div>سایز: {item.selectedSize}</div>}

                  {item.selectedNumber && (
                    <div>شماره: {item.selectedNumber}</div>
                  )}

                  <div>تعداد: {item.quantity}</div>
                </div>
              </div>

              <span
                className="
                text-sm
                font-bold
                whitespace-nowrap
              "
              >
                {(item.price * item.quantity).toLocaleString()} تومان
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-gray-400 py-6">
          سبد خرید شما خالی است
        </div>
      )}
      <div
        className="
        border-t
        mt-5
        pt-4
        space-y-3
      "
      >
        <Row title="قیمت کالاها" value={subtotal} />

        {discount > 0 && (
          <div
            className="
            flex
            justify-between
            text-green-600
            text-sm
          "
          >
            <span className="flex items-center gap-1">
              <Percent size={16} />
              تخفیف
            </span>

            <span>-{discount.toLocaleString()} تومان</span>
          </div>
        )}
        <div
          className="
          flex
          justify-between
          text-sm
        "
        >
          <span className="flex items-center gap-1">
            <Truck size={16} />
            ارسال داخلی
          </span>

          <span>
            {!hasDomesticItems && hasImportedItems ? (
              <span className="text-amber-600 font-medium">
                بعداً مشخص می‌شود
              </span>
            ) : shippingPaymentMode === "DEFERRED" ? (
              <span className="text-amber-600 font-medium">پرداخت بعداً</span>
            ) : shippingCost === 0 ? (
              "رایگان"
            ) : (
              `${shippingCost.toLocaleString()} تومان`
            )}
          </span>
        </div>
        {hasImportedItems && hasDomesticItems && (
          <p className="text-xs text-purple-600 mt-2 leading-5 my-4">
            هزینه ارسال نمایش‌داده‌شده فقط مربوط به کالاهای داخلی است. هزینه
            باربری و ارسال کالای وارداتی بعداً محاسبه می‌شود.
          </p>
        )}
        {hasImportedItems && !hasDomesticItems && (
          <p className="text-xs text-purple-600 mt-2 leading-5 my-4">
            هزینه باربری و ارسال داخلی کالای وارداتی پس از رسیدن کالا و مشخص شدن
            هزینه واقعی محاسبه می‌شود.
          </p>
        )}

        <div
          className="
          flex
          items-center
          gap-2
          text-xs
          bg-gray-50
          p-3
          rounded-xl
        "
        >
          <Clock size={16} className="text-pink-500 shrink-0" />

          <span>تحویل: {estimatedDelivery}</span>
        </div>
        {userPoints > 0 && (
          <div
            className="
            flex
            items-center
            gap-2
            text-xs
            bg-amber-50
            text-amber-600
            p-3
            rounded-xl
          "
          >
            <Star size={16} className="shrink-0" />

            <span>
              {userPoints.toLocaleString()} امتیاز از این خرید کسب می‌کنید
            </span>
          </div>
        )}

        <div
          className="
          border-t
          pt-4
          flex
          justify-between
          font-bold
          text-lg
        "
        >
          <span>قابل پرداخت</span>

          <span className="text-pink-600">
            {payableTotal.toLocaleString()} تومان
          </span>
        </div>
      </div>
      <button
        type={currentStep === 1 ? "submit" : "button"}
        form={currentStep === 1 ? "checkout-shipping-form" : undefined}
        onClick={currentStep === 1 ? undefined : onProceed}
        disabled={isLoading || !hasItems || !canProceed}
        className="
          w-full
          mt-6
          py-4
          rounded-full
          bg-linear-to-l
          from-pink-500
          to-pink-600
          text-white
          font-bold
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {isLoading ? "در حال پردازش..." : buttonText()}
      </button>
      <div
        className="
        mt-5
        bg-pink-50
        rounded-2xl
        p-4
      "
      >
        <div className="flex gap-3">
          <ShieldCheck className="text-pink-600 shrink-0" />

          <div>
            <p className="font-medium text-sm">اطلاعات شما محفوظ است</p>

            <p className="text-xs text-gray-500">
              پرداخت امن و ضمانت بازگشت کالا
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ title, value }: { title: string; value: number }) {
  return (
    <div
      className="
      flex
      justify-between
      text-sm
    "
    >
      <span>{title}</span>

      <span>{value.toLocaleString()} تومان</span>
    </div>
  );
}