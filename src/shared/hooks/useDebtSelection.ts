
import { useCallback, useMemo, useState } from "react";

import {
  debtKey,
  isDomesticDebt,
  isDomesticUnbatched,
  isFreightDebt,
  type ShippingDebt,
} from "@/src/shared/types/shippingDebt";

export function useDebtSelection(debts: ShippingDebt[]) {
  const [deselected, setDeselected] = useState<Set<string>>(
    new Set(),
  );

  const isOrderPaymentApproved = useCallback(
    (debt: ShippingDebt) => {
      if (isDomesticUnbatched(debt)) {
        return debt.orderPaymentStatus === "PAID";
      }

      if (isDomesticDebt(debt)) {
        return (
          debt.orders.length > 0 &&
          debt.orders.every(
            (order) => order.orderPaymentStatus === "PAID",
          )
        );
      }

      if (isFreightDebt(debt)) {
        return debt.orderPaymentStatus === "PAID";
      }

      return false;
    },
    [],
  );

  const isSelectable = useCallback(
    (debt: ShippingDebt) => {
      if (!isOrderPaymentApproved(debt)) {
        return false;
      }

      if (isDomesticDebt(debt)) {
        return debt.paymentStatus !== "PENDING";
      }

      if (isFreightDebt(debt)) {
        return debt.paymentStatus !== "PENDING";
      }

      if (isDomesticUnbatched(debt)) {
        return true;
      }

      return false;
    },
    [isOrderPaymentApproved],
  );

  const selectableDebts = useMemo(
    () => debts.filter(isSelectable),
    [debts, isSelectable],
  );

  const selectedDebts = useMemo(
    () =>
      selectableDebts.filter(
        (debt) => !deselected.has(debtKey(debt)),
      ),
    [selectableDebts, deselected],
  );

  const selectedUnbatched = useMemo(
    () => selectedDebts.filter(isDomesticUnbatched),
    [selectedDebts],
  );

  const selectedPaymentDebts = useMemo(
    () =>
      selectedDebts.filter(
        (debt) => !isDomesticUnbatched(debt),
      ),
    [selectedDebts],
  );

  const total = useMemo(
    () =>
      selectedPaymentDebts.reduce(
        (sum, debt) => sum + debt.totalDue,
        0,
      ),
    [selectedPaymentDebts],
  );

  const isSelected = useCallback(
    (debt: ShippingDebt) => {
      if (!isSelectable(debt)) {
        return false;
      }

      return !deselected.has(debtKey(debt));
    },
    [deselected, isSelectable],
  );

  const toggle = useCallback(
    (debt: ShippingDebt) => {
      if (!isSelectable(debt)) {
        return;
      }

      setDeselected((prev) => {
        const next = new Set(prev);
        const key = debtKey(debt);

        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }

        return next;
      });
    },
    [isSelectable],
  );

  const allSelected =
    selectableDebts.length > 0 &&
    selectedDebts.length === selectableDebts.length;

  const deselectAll = useCallback(() => {
    setDeselected(
      new Set(debts.map((debt) => debtKey(debt))),
    );
  }, [debts]);

  const toggleAll = useCallback(() => {
    if (allSelected) {
      deselectAll();
      return;
    }

    setDeselected(
      new Set(
        debts
          .filter(
            (debt) => !isSelectable(debt),
          )
          .map((debt) => debtKey(debt)),
      ),
    );
  }, [
    allSelected,
    deselectAll,
    debts,
    isSelectable,
  ]);

  return {
    selectedDebts,

    selectedUnbatched,

    selectedPaymentDebts,

    selectableDebts,

    selectedCount: selectedDebts.length,

    selectedUnbatchedCount:
      selectedUnbatched.length,

    selectedPaymentCount:
      selectedPaymentDebts.length,

    total,

    allSelected,

    isSelectable,
    isSelected,
    toggle,
    toggleAll,
    deselectAll,

    isOrderPaymentApproved,
  };
}