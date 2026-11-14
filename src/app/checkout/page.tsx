"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import PaymentMethod from "@/src/components/checkout/PaymentMethod";
import CheckoutForm from "@/src/components/checkout/CheckoutForm";
import OrderSummary from "@/src/components/checkout/OrderSummary";

import { useCartActions } from "@/src/shared/hooks/useCart";
import { useCreateOrder } from "@/src/shared/hooks/useCheckout";
import { calculateShippingCost } from "@/src/shared/lib/cart/shipping";

import type {
  ShippingInfo,
  PaymentType,
  CheckoutCartItem,
} from "@/src/shared/types/checkout";
interface RawCartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  name?: string;

  product?: {
    name?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    shippingClass?: "SMALL" | "MEDIUM" | "LARGE";
    availabilityType?: "IN_STOCK" | "PRE_ORDER";
  };

  price?: number;
  originalPrice?: number;
  image?: string;
  quantity: number;

  selectedColor?: string | null;
  selectedSize?: string | null;
  selectedNumber?: string | null;

  shippingClass?: "SMALL" | "MEDIUM" | "LARGE";

  availabilityType?: "IN_STOCK" | "PRE_ORDER";
  
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  type ShippingPaymentMode = "IMMEDIATE" | "DEFERRED";

  const shippingPaymentMode =
    searchParams.get("shippingPaymentMode") === "DEFERRED"
      ? "DEFERRED"
      : "IMMEDIATE";

  const importedFreightAccepted =
    searchParams.get("importedFreightAccepted") === "true";
  const { cart } = useCartActions();

  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createOrder = useCreateOrder();

  const cartItems: CheckoutCartItem[] =
  (cart as RawCartItem[] | undefined)?.map((item) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId ?? null,
    name: item.name || item.product?.name || "",
    price: item.price ?? item.product?.price ?? 0,
    originalPrice:
      item.originalPrice ?? item.product?.originalPrice ?? null,
    image: item.image ?? item.product?.image ?? null,
    quantity: item.quantity,

    selectedColor: item.selectedColor ?? null,
    selectedSize: item.selectedSize ?? null,
    selectedNumber: item.selectedNumber ?? null,

    shippingClass:
      item.shippingClass ?? item.product?.shippingClass ?? "SMALL",

    availabilityType:
      item.availabilityType ??
      item.product?.availabilityType ??
      "IN_STOCK",
  })) ?? [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity,
    0,
  );

  const discount = cartItems.reduce((sum, item) => {
    if (item.originalPrice != null && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }

    return sum;
  }, 0);
const domesticItems = cartItems.filter(
  (item) => item.availabilityType === "IN_STOCK",
);

const hasDomesticItems = domesticItems.length > 0;
const hasImportedItems = cartItems.some(
  (item) => item.availabilityType === "PRE_ORDER",
);

const shippingCost = hasDomesticItems
  ? calculateShippingCost(domesticItems)
  : 0;
  const shippingToPayNow =
    shippingPaymentMode === "IMMEDIATE" ? shippingCost : 0;

  const total = subtotal - discount + shippingToPayNow;
  const handleShippingSubmit = (data: ShippingInfo) => {
    setShippingInfo(data);
    setSubmitError(null);
    setStep(2);
  };

  const handlePaymentSelect = (method: PaymentType) => {
    setSelectedPayment(method);
    setSubmitError(null);
    setStep(3);
  };

  const handleFinalSubmit = () => {
    setSubmitError(null);

    if (!shippingInfo) {
      setSubmitError("اطلاعات ارسال کامل نیست");
      setStep(1);
      return;
    }

    if (!selectedPayment) {
      setSubmitError("لطفاً روش پرداخت را انتخاب کنید");
      setStep(2);
      return;
    }

    createOrder.mutate(
      {
        shippingInfo,
        paymentMethod: selectedPayment,
        items: cartItems,
        totalPrice: subtotal,
        discount,
        shippingCost,
        finalPrice: total,

        shippingPaymentMode,
        importedFreightAccepted,
      },
      {
        onSuccess: (data) => {
          router.push(`/profile/orders/${data.orderId}`);
        },

        onError: (err: unknown) => {
          console.error("CREATE ORDER ERROR:", err);

          const message =
            err instanceof Error ? err.message : "خطا در ثبت سفارش";

          setSubmitError(message);
        },
      },
    );
  };

  const paymentName = selectedPayment === "CARD_TO_CARD" ? "کارت به کارت" : "";

  return (
    <div className="min-h-screen py-8 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-pink-500" />
            <h1 className="text-2xl font-bold">تسویه حساب</h1>
          </div>

          <Link href="/cart" className="text-gray-500 flex items-center gap-1">
            <ChevronRight />
            بازگشت
          </Link>
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex gap-8">
            {["اطلاعات ارسال", "پرداخت", "تایید"].map((text, i) => {
              const currentStep = i + 1;
              return (
                <div key={text} className="text-center">
                  <div
                    className={`
                      w-10 h-10
                      rounded-full
                      flex items-center
                      justify-center
                      mx-auto mb-2
                      font-bold
                      ${
                        step === currentStep
                          ? "bg-pink-500 text-white"
                          : step > currentStep
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {step > currentStep ? "✓" : currentStep}
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {submitError && (
          <div className="max-w-2xl mx-auto mb-6 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <CheckoutForm
                onSubmit={handleShippingSubmit}
                initialData={shippingInfo}
                isLoading={createOrder.isPending}
              />
            )}

            {step === 2 && (
              <PaymentMethod
                onSelect={handlePaymentSelect}
                selected={selectedPayment}
                isLoading={createOrder.isPending}
              />
            )}

            {step === 3 && (
              <div className="bg-white p-6 rounded-4xl shadow-sm">
                <div className="flex gap-2 justify-center mb-8">
                  <CheckCircle className="text-pink-500" />
                  <h2 className="font-bold text-lg">تایید سفارش</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-gray-500">نام:</span>
                    <span className="font-medium mr-2">
                      {shippingInfo?.fullName}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500">شماره تماس:</span>
                    <span className="font-medium mr-2">
                      {shippingInfo?.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500">روش پرداخت:</span>
                    <span className="font-medium mr-2">{paymentName}</span>
                  </div>

                  <div>
                    <span className="text-gray-500">مبلغ قابل پرداخت:</span>
                    <span className="font-bold text-pink-600 mr-2">
                      {total.toLocaleString()} تومان
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={createOrder.isPending}
                  className="
                    w-full
                    mt-8
                    py-3
                    rounded-full
                    bg-pink-500
                    text-white
                    font-semibold
                    hover:bg-pink-600
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {createOrder.isPending
                    ? "در حال ثبت سفارش..."
                    : "ثبت نهایی سفارش"}
                </button>
              </div>
            )}
          </div>

          <div>
            <OrderSummary
  items={cartItems}
  subtotal={subtotal}
  discount={discount}
  shippingCost={shippingCost}
  total={total}
  onProceed={() => {
    if (step === 1) {
      if (!shippingInfo) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!selectedPayment) return;
      setStep(3);
      return;
    }

    handleFinalSubmit();
  }}
  currentStep={step}
  isLoading={createOrder.isPending}
  shippingPaymentMode={shippingPaymentMode}
  hasImportedItems={hasImportedItems}
  hasDomesticItems={hasDomesticItems}
/>
          </div>
        </div>
      </div>
    </div>
  );
}
