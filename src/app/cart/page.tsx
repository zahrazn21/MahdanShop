
"use client";

import { ShoppingCart } from "lucide-react";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import UserPoints from "../../components/cart/UserPoints";
import EmptyCart from "../../components/cart/EmptyCart";
import { useCartActions } from "@/src/shared/hooks/useCart";

export default function CartPage() {
  const {
    cart: items,
    isLoading,
    totalPrice,
    itemCount,
    updateCart,
    removeFromCart,
    isUpdating,
    isRemoving,
  } = useCartActions();

  // loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin" />
      </div>
    );
  }

  // empty cart
  if (!items || items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 py-8">

        {/* header */}
        <div className="flex items-center gap-2 mb-8">
          <ShoppingCart className="w-6 h-6 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800">سبد خرید</h1>
          <span className="text-sm text-gray-500">
            ({itemCount} کالا)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* items */}
          <div className="lg:col-span-2">
            <div className="bg-(--color-pink-light) rounded-4xl shadow-sm shadow-pink-200 border border-white p-4 md:p-5">

              {items.map((item: any) => (
                <CartItem
                  key={item.id}
                  item={{
                    id: item.id,
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    quantity: item.quantity,
                    stock: item.product.stock,
                  }}
                  onUpdateQuantity={(id, quantity) =>
                    updateCart({ id, quantity })
                  }
                  onRemove={(id) => removeFromCart(id)}
                  isUpdating={isUpdating}
                  isRemoving={isRemoving}
                />
              ))}

            </div>
          </div>

          {/* summary */}
          <div>
            <CartSummary
              totalPrice={totalPrice}
              totalDiscount={0}
              finalPrice={totalPrice}
              onApplyCoupon={(code) => {
                console.log("coupon:", code);
              }}
            />
          </div>

        </div>

        <div className="mt-6">
          <UserPoints />
        </div>

      </div>
    </div>
  );
}