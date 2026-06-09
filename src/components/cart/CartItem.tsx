// components/cart/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { CartItemType } from "@/src/app/lib/db/cart";

// ✅ تعریف تایپ محلی (بدون addedAt)
interface CartItemDisplay {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  quantity: number;
  stock?: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedNumber?: string;
  productId: string;
  category: string;
  scope: "domestic" | "imported" | "all";
}

interface CartItemProps {
  item: CartItemDisplay;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  isRemoving,
}: CartItemProps) {
  const discount =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100,
        )
      : 0;

  const hasOptions =
    item.selectedColor || item.selectedSize || item.selectedNumber;

console.log("id being sent:", item.id);
  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-pink-100 last:border-0">
      {/* تصویر محصول */}
      <Link
        href={`/products/${item.scope}/${item.category}/${item.productId}`}
        className="block w-30 h-30 bg-pink-50 rounded-xl overflow-hidden flex-shrink-0"
      >
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={96}
          className="w-full h-full object-contain"
        />
      </Link>

      {/* اطلاعات محصول */}
      <div className="flex-1">
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            <Link
              href={`/products/${item.scope}/${item.category}/${item.productId}`}
            >
              <h3 className="font-semibold text-gray-800 hover:text-pink-600 transition-colors">
                {item.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1">{item.brand}</p>

            {/* نمایش ویژگی‌های انتخاب شده */}
            {hasOptions && (
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                {item.selectedColor && (
                  <span className="flex items-center gap-1">
                    <span>رنگ:</span>
                    <span className="text-gray-600">{item.selectedColor}</span>
                  </span>
                )}
                {item.selectedSize && (
                  <span className="flex items-center gap-1">
                    <span>سایز:</span>
                    <span className="text-gray-600">{item.selectedSize}</span>
                  </span>
                )}
                {item.selectedNumber && (
                  <span className="flex items-center gap-1">
                    <span>شماره:</span>
                    <span className="text-gray-600">{item.selectedNumber}</span>
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            disabled={isRemoving}
            className="text-pink-800 rounded-full bg-pink-100 p-2 hover:text-pink-500 transition-colors disabled:opacity-50"
            aria-label="حذف از سبد خرید"
          >
            {isRemoving ? (
              <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
          {/* انتخاب تعداد */}
          <div className="flex items-center border border-pink-200 rounded-full">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 disabled:opacity-50 transition-colors rounded-r-full border-l-2 border-l-pink-100"
              aria-label="کاهش تعداد"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-medium ">
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 flex items-center justify-center hover:bg-pink-50 disabled:opacity-50 transition-colors rounded-l-full border-r-2 border-r-pink-100"
              aria-label="افزایش تعداد"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* قیمت */}
          <div className="text-left">
            {discount > 0 && (
              <div className="text-xs text-gray-400 line-through">
                {(item.originalPrice! * item.quantity).toLocaleString()} تومان
              </div>
            )}
            <div className="font-bold text-pink-600">
              {(item.price * item.quantity).toLocaleString()} تومان
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
