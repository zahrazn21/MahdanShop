import { Minus, Plus } from "lucide-react";

interface ProductQuantityProps {
  quantity: number;
  currentStock: number;
  isInStock: boolean;
  isPreOrder: boolean;
  canPurchase: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function ProductQuantity({
  quantity,
  currentStock,
  isInStock,
  isPreOrder,
  canPurchase,
  onIncrement,
  onDecrement,
}: ProductQuantityProps) {
  return (
    <div className="space-y-3">
      <label className="block font-semibold text-gray-700">
        تعداد:
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border-2 border-pink-100 bg-white">
          <button
            type="button"
            onClick={onDecrement}
            disabled={quantity <= 1 || !canPurchase}
            className="flex h-12 w-12 items-center justify-center rounded-r-full transition-colors hover:bg-pink-50 disabled:opacity-50"
          >
            <Minus className="h-5 w-5 text-gray-600" />
          </button>

          <span className="w-16 text-center text-lg font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={onIncrement}
            disabled={
              !canPurchase ||
              (isInStock && quantity >= currentStock)
            }
            className="flex h-12 w-12 items-center justify-center rounded-l-full transition-colors hover:bg-pink-50 disabled:opacity-50"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <span className="text-sm text-gray-500">
          {isPreOrder
            ? canPurchase
              ? "قابل ثبت به صورت پیش‌سفارش"
              : "ثبت پیش‌سفارش در حال حاضر امکان‌پذیر نیست"
            : canPurchase
              ? `حداکثر ${currentStock} عدد موجود است`
              : "این محصول در حال حاضر موجود نیست"}
        </span>
      </div>
    </div>
  );
}