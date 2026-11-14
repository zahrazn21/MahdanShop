"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Minus, Package, Plane, Plus, Trash2 } from "lucide-react";

import type { CartItemDisplay } from "@/src/shared/types/cart";
import { formatPrice, formatNumber } from "@/src/shared/lib/format";
import { getCartItemState } from "@/src/shared/lib/cart/cartItemState";

interface Props {
  item: CartItemDisplay;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

function Spinner({ className }: { className: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-pink-500 border-t-transparent ${className}`}
    />
  );
}

function TypeBadge({ imported }: { imported: boolean }) {
  const Icon = imported ? Plane : Package;
  const cls = imported
    ? "border-pink-200 bg-pink-50 text-pink-700"
    : "border-green-200 bg-green-50 text-green-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {imported ? "محصول وارداتی" : "محصول داخلی"}
    </span>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove, isUpdating, isRemoving }: Props) {
  const { isImported, isBatchClosed, canPurchase, discountPercent } =
    getCartItemState(item);

  const productUrl = `/products/${item.scope}/${item.category}/${item.slug ?? item.productId}`;
  
  const options = [
    item.selectedColor && ["رنگ", item.selectedColor],
    item.selectedSize && ["سایز", item.selectedSize],
    item.selectedNumber && ["شماره", item.selectedNumber],
  ].filter((o): o is [string, string] => Array.isArray(o));

  const variant = item.selectedVariant;

  return (
    <div className="flex flex-col gap-4 border-b border-pink-100 py-4 last:border-0 sm:flex-row">
      <Link
        href={productUrl}
        className="block h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-pink-50"
      >
        <Image
          src={item.image}
          alt={item.name}
          width={112}
          height={112}
          className="h-full w-full object-contain"
        />
      </Link>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={productUrl}>
              <h3 className="font-semibold text-gray-800 transition-colors hover:text-pink-600">
                {item.name}
              </h3>
            </Link>

            {item.brand && <p className="mt-1 text-sm text-gray-500">{item.brand}</p>}

            <div className="mt-2">
              <TypeBadge imported={isImported} />
            </div>

            {isBatchClosed && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  سفارش‌گیری این محصول به پایان رسیده و در حال حاضر امکان ثبت
                  سفارش جدید وجود ندارد.
                </span>
              </div>
            )}

            {options.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                {options.map(([label, value]) => (
                  <span key={label}>
                    {label}: <span className="text-gray-600">{value}</span>
                  </span>
                ))}
              </div>
            )}

            {variant?.name && (
              <p className="mt-1 text-xs text-gray-500">تنوع: {variant.name}</p>
            )}
            {variant?.volume != null && (
              <p className="mt-1 text-xs text-gray-500">
                حجم: {formatNumber(variant.volume)} {variant.volumeUnit}
              </p>
            )}
          </div>

          <button
            onClick={() => onRemove(item.id)}
            disabled={isRemoving}
            aria-label="حذف از سبد خرید"
            className="shrink-0 rounded-full bg-pink-100 p-2 text-pink-800 transition-colors hover:text-pink-500 disabled:opacity-50"
          >
            {isRemoving ? <Spinner className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center rounded-full border border-pink-200">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              aria-label="کاهش تعداد"
              className="flex h-8 w-8 items-center justify-center rounded-e-full border-s-2 border-pink-100 transition-colors hover:bg-pink-50 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="flex w-10 justify-center text-sm font-medium">
              {isUpdating ? <Spinner className="h-4 w-4" /> : formatNumber(item.quantity)}
            </span>

            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={isUpdating || !canPurchase}
              aria-label="افزایش تعداد"
              className="flex h-8 w-8 items-center justify-center rounded-s-full border-e-2 border-pink-100 transition-colors hover:bg-pink-50 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="text-left">
            {discountPercent > 0 && item.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                {formatPrice(item.originalPrice * item.quantity)}
              </div>
            )}
            <div className="font-bold text-pink-600">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CartItem);