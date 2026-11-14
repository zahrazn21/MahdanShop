// src/components/shipping-debts/DebtsStates.tsx
import { Check } from "lucide-react";

export function DebtsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      {[0, 1].map((i) => (
        <div key={i} className="h-44 animate-pulse rounded-3xl bg-gray-100" />
      ))}
    </div>
  );
}

export function DebtsEmpty() {
  return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
        <Check className="h-7 w-7 text-green-600" />
      </div>
      <h2 className="font-bold">بدهی ارسالی ندارید</h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        در حال حاضر هیچ هزینه ارسال یا باربری معوقی برای شما ثبت نشده است.
      </p>
    </div>
  );
}

export function DebtsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        تلاش مجدد
      </button>
    </div>
  );
}