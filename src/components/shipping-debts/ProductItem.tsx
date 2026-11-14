import { memo } from "react";
import type { ShippingDebtItem } from "@/src/shared/types/shippingDebt";
import type { ShippingClass } from "@/src/shared/types/product";
import { formatNumber, formatPrice } from "@/src/shared/lib/format";

const SHIPPING_CLASS: Record<ShippingClass, string> = {
  SMALL: "کوچک",
  MEDIUM: "متوسط",
  LARGE: "بزرگ",
};

function Chip({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={`rounded-lg px-3 py-1.5 text-xs ${
        muted ? "bg-pink-50 text-gray-600" : "bg-pink-100 text-gray-700"
      }`}
    >
      {children}
    </span>
  );
}

export const ProductItem = memo(function ProductItem({
  item,
}: {
  item: ShippingDebtItem;
}) {
  const variants = [
    item.selectedColor && `رنگ: ${item.selectedColor}`,
    item.selectedSize && `سایز: ${item.selectedSize}`,
    item.selectedNumber && `شماره: ${item.selectedNumber}`,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="font-bold text-gray-800">{item.name}</h4>
          <p className="mt-1 text-xs text-gray-500">
            تعداد:{" "}
            <span className="font-semibold text-gray-700">
              {formatNumber(item.quantity)}
            </span>
          </p>
        </div>

        <div className="shrink-0 sm:text-left">
          <p className="text-sm font-bold text-gray-800">
            {formatPrice(item.price)}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">هر عدد</p>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {variants.map((v) => (
            <Chip key={String(v)}>{v}</Chip>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Chip muted>
          نوع:{" "}
          {item.availabilityType === "PRE_ORDER"
            ? "پیش‌ سفارش / وارداتی"
            : "موجود"}
        </Chip>
        <Chip muted>کلاس ارسال: {SHIPPING_CLASS[item.shippingClass]}</Chip>
        {item.volume !== null && (
          <Chip muted>
            حجم واحد: {formatNumber(item.volume)}
            {item.volumeUnit ? ` ${item.volumeUnit}` : ""}
          </Chip>
        )}
      </div>
    </div>
  );
});
