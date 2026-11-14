interface ProductPurchaseStatusProps {
  canPurchase: boolean;
  reason: string | null;
}

export function ProductPurchaseStatus({
  canPurchase,
  reason,
}: ProductPurchaseStatusProps) {
  if (canPurchase || !reason) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-600">
        !
      </div>

      <div>
        <p className="font-bold">
          امکان ثبت سفارش وجود ندارد
        </p>

        <p className="mt-0.5 text-amber-700">
          {reason}
        </p>
      </div>
    </div>
  );
}