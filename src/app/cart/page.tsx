"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import ProductSlider from "../../components/product/ProductSlider";

import { useCartActions } from "@/src/shared/hooks/useCart";
import { formatNumber } from "@/src/shared/lib/format";
import type { ShippingPaymentMode } from "@/src/shared/types/checkout";

export default function CartPage() {
  const router = useRouter();

  const [shippingPaymentMode, setShippingPaymentMode] =
    useState<ShippingPaymentMode>("IMMEDIATE");

  const [importedFreightAccepted, setImportedFreightAccepted] =
    useState(false);

  const {
    cart: items,
    isLoading,
    totalPrice,
    totalDiscount,
    itemCount,
    updateCart,
    removeFromCart,
    shippingCost,
    updatingId,
    removingId,
    hasImportedItems,
    hasDomesticItems,
  } = useCartActions();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-300 border-t-pink-600" />
      </div>
    );
  }

  /**
   * سبد خرید خالی
   *
   * علاوه بر EmptyCart، چند محصول پیشنهادی هم نمایش داده می‌شود.
   */
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen" dir="rtl">
        <EmptyCart />

        <div className="container mx-auto px-4 pb-12">
          <ProductSlider
            title="شاید این‌ها رو هم بپسندی"
            sortBy="newest"
            scope="all"
            limit={4}
          />
        </div>
      </div>
    );
  }

  const shippingToPayNow =
    shippingPaymentMode === "IMMEDIATE" ? shippingCost : 0;

  const finalPrice =
    totalPrice - totalDiscount + shippingToPayNow;

  const handleCheckout = () => {
    const params = new URLSearchParams({
      shippingPaymentMode,
    });

    if (hasImportedItems) {
      params.set(
        "importedFreightAccepted",
        String(importedFreightAccepted),
      );
    }

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="container md:mx-auto md:px-4 px-2 md:py-8 py-2">
        <div className="mb-8 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-pink-500" />

          <h1 className="text-2xl font-bold text-gray-800">
            سبد خرید
          </h1>

          <span className="text-sm text-gray-500">
            ({formatNumber(itemCount)} کالا)
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="self-start lg:col-span-2">
            <div className="rounded-4xl border border-white bg-(--color-pink-light) p-4 shadow-sm shadow-pink-200 md:p-5">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(id, quantity) =>
                    updateCart({ id, quantity })
                  }
                  onRemove={removeFromCart}
                  isUpdating={updatingId === item.id}
                  isRemoving={removingId === item.id}
                />
              ))}
            </div>
          </div>

          <CartSummary
            totalPrice={totalPrice}
            totalDiscount={totalDiscount}
            finalPrice={finalPrice}
            shippingCost={shippingCost}
            onCheckout={handleCheckout}
            hasImportedItems={hasImportedItems}
            hasDomesticItems={hasDomesticItems}
            shippingPaymentMode={shippingPaymentMode}
            onShippingPaymentModeChange={setShippingPaymentMode}
            importedFreightAccepted={importedFreightAccepted}
            onImportedFreightAcceptedChange={
              setImportedFreightAccepted
            }
          />
        </div>

        {/* <div className="mt-6">
          <UserPoints />
        </div> */}
      </div>
    </div>
  );
}
