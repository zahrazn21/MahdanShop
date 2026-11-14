"use client";

import {
  useShippingDebts,
  usePayShippingDebts,
} from "@/src/shared/hooks/useShippingDebts";
import { useDebtSelection } from "@/src/shared/hooks/useDebtSelection";

import {
  isDomesticDebt,
  isFreightDebt,
  type ShippingDebt,
} from "@/src/shared/types/shippingDebt";

import { formatNumber } from "@/src/shared/lib/format";

import { DomesticBatchCard } from "@/src/components/shipping-debts/DomesticBatchCard";
import { DomesticUnbatchedCard } from "@/src/components/shipping-debts/DomesticUnbatchedCard";
import { FreightCard } from "@/src/components/shipping-debts/FreightCard";
import { PaymentBar } from "@/src/components/shipping-debts/PaymentBar";

import {
  DebtsEmpty,
  DebtsError,
  DebtsSkeleton,
} from "@/src/components/shipping-debts/DebtsStates";

import ShippingPaymentHistory from "./ShippingPaymentHistory";

const NO_DEBTS: ShippingDebt[] = [];

export default function ShippingDebtsPage() {
  const { data, isLoading, error, refetch } =
    useShippingDebts();

  const debts = data?.debts ?? NO_DEBTS;

  const selection = useDebtSelection(debts);

  const { mutate: pay, isPending: isPaying } =
    usePayShippingDebts();

  const selectedUnbatched =
    selection.selectedUnbatched;

  const selectedPaymentDebts =
    selection.selectedPaymentDebts;

  const selectedBatches =
    selectedPaymentDebts.filter(isDomesticDebt);

  const selectedFreights =
    selectedPaymentDebts.filter(isFreightDebt);

  const handleCreateBatch = async () => {
    const shipmentIds = selectedUnbatched.map(
      (debt) => debt.shipmentId,
    );

    if (shipmentIds.length === 0) {
      return;
    }

    try {
      const response = await fetch(
        "/api/shipping-debts/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipmentIds,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "تجمیع سفارش‌های داخلی انجام نشد",
        );
      }

      selection.deselectAll();

      await refetch();
    } catch (error) {
      console.error(
        "CREATE SHIPPING BATCH ERROR:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "خطا در تجمیع سفارش‌های داخلی",
      );
    }
  };

  const handleSubmit = (
    file: File,
    reset: () => void,
  ) => {
    pay(
      {
        file,
        parcelBatchIds: selectedBatches.map(
          (debt) => debt.parcelBatchId,
        ),
        shipmentIds: selectedFreights.map(
          (debt) => debt.shipmentId,
        ),
      },
      {
        onSuccess: () => {
          reset();
          selection.deselectAll();
        },
      },
    );
  };

  const hasUnbatchedSelection =
    selection.selectedUnbatchedCount > 0;

  const hasPaymentSelection =
    selection.selectedPaymentCount > 0;

 return (
  <div
    dir="rtl"
    className="w-full space-y-4 px-3 py-2 sm:space-y-6 sm:px-4 lg:mx-auto lg:max-w-7xl lg:p-6"
  >
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">بدهی‌های ارسال و باربری من</h1>

      <p className="mt-1 text-xs leading-6 text-gray-500 sm:mt-2 sm:text-sm">
        هزینه ارسال داخلی و باربری وارداتی سفارش‌های شما در این بخش نمایش داده
        می‌شود.
      </p>
    </div>

    {isLoading ? (
      <DebtsSkeleton />
    ) : error ? (
      <DebtsError message={error.message} onRetry={() => refetch()} />
    ) : debts.length === 0 ? (
      <DebtsEmpty />
    ) : (
      <div
        className={
          hasPaymentSelection
            ? "space-y-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0"
            : ""
        }
      >
        {hasPaymentSelection && (
          <aside className="hidden lg:sticky lg:top-4 lg:block">
            <PaymentBar
              selectedCount={selection.selectedPaymentCount}
              total={selection.total}
              isPending={isPaying}
              onSubmit={handleSubmit}
            />
          </aside>
        )}

        <div className="min-w-0 space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={selection.allSelected}
                onChange={selection.toggleAll}
                className="h-5 w-5 shrink-0 accent-pink-500"
              />
              <span className="text-sm font-bold sm:text-base">
                انتخاب همه بدهی‌ها
              </span>
            </label>

            <span className="text-xs text-gray-500 sm:text-sm">
              {formatNumber(selection.selectedCount)} از{" "}
              {formatNumber(debts.length)} مورد
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {debts.map((debt) => {
              if (isDomesticDebt(debt)) {
                return (
                  <DomesticBatchCard
                    key={`domestic-batch-${debt.parcelBatchId}`}
                    debt={debt}
                    selected={selection.isSelected(debt)}
                    onToggle={() => selection.toggle(debt)}
                  />
                );
              }

              if (debt.type === "DOMESTIC_UNBATCHED") {
                return (
                  <DomesticUnbatchedCard
                    key={`domestic-shipment-${debt.shipmentId}`}
                    debt={debt}
                    selected={selection.isSelected(debt)}
                    onToggle={() => selection.toggle(debt)}
                  />
                );
              }

              return (
                <FreightCard
                  key={`freight-${debt.shipmentId}`}
                  debt={debt}
                  selected={selection.isSelected(debt)}
                  onToggle={() => selection.toggle(debt)}
                />
              );
            })}
          </div>

          {hasUnbatchedSelection && (
            <div className="rounded-2xl border border-pink-200 bg-pink-50 p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 sm:text-base">
                    تجمیع سفارش‌های داخلی
                  </p>

                  <p className="mt-1 text-xs leading-6 text-gray-600 sm:text-sm">
                    {formatNumber(selection.selectedUnbatchedCount)} سفارش
                    داخلی انتخاب شده است. هزینه ارسال بر اساس حجم مجموع این
                    سفارش‌ها محاسبه می‌شود.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCreateBatch}
                  className="w-full rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-600 active:scale-[0.98] sm:px-5 sm:text-base md:w-auto md:shrink-0"
                >
                  تجمیع و محاسبه هزینه ارسال
                </button>
              </div>
            </div>
          )}
        </div>

        {hasPaymentSelection && (
          <div className="lg:hidden">
            <PaymentBar
              selectedCount={selection.selectedPaymentCount}
              total={selection.total}
              isPending={isPaying}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    )}

    <ShippingPaymentHistory />
  </div>
);
}
