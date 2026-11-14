"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Clock, Package } from "lucide-react";

import type { DomesticUnbatchedShipment } from "@/src/shared/types/shippingDebt";
import { formatDateSafe, formatNumber } from "@/src/shared/lib/format";

import { ProductItem } from "./ProductItem";
import { ProductsAccordion } from "./ProductsAccordion";
import { ORDER_STATUS } from "@/src/shared/lib/constants";

interface Props {
  debt: DomesticUnbatchedShipment;
  selected: boolean;
  onToggle: () => void;
}

function getDeadlineState(dueAt: Date | string | null, now: number) {
  if (!dueAt) {
    return null;
  }

  const dueDate = new Date(dueAt);

  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  const diffMs = dueDate.getTime() - now;

  if (diffMs <= 0) {
    return {
      expired: true,
      text: "مهلت پرداخت این سفارش به پایان رسیده است.",
      dueDate,
    };
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));

  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

  let text = "";

  if (days > 0) {
    text = `${formatNumber(days)} روز و ${formatNumber(hours)} ساعت باقی مانده`;
  } else if (hours > 0) {
    text = `${formatNumber(hours)} ساعت باقی مانده`;
  } else {
    text = "کمتر از یک ساعت باقی مانده";
  }

  return {
    expired: false,
    text,
    dueDate,
  };
}

export function DomesticUnbatchedCard({ debt, selected, onToggle }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const status = ORDER_STATUS[debt.status];

  const deadline = getDeadlineState(debt.shippingDueAt, now);

  const itemsCount = debt.items.length;
  const productPaymentApproved = debt.orderPaymentStatus === "PAID";

  const selectionDisabled = !productPaymentApproved;
  return (
    <div
      className={`rounded-3xl border-2 bg-white p-5 transition ${
        selected ? "border-blue-500 bg-blue-50/30" : "border-gray-200"
      }`}
    >
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onToggle}
          disabled={selectionDisabled}
          aria-label={
            selectionDisabled
              ? "ابتدا پرداخت محصول باید تأیید شود"
              : selected
                ? "لغو انتخاب سفارش"
                : "انتخاب سفارش برای تجمیع"
          }
          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
            selected
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 bg-white"
          } ${selectionDisabled ? "cursor-not-allowed opacity-40" : ""}`}
        >
          {selected && <Check className="h-4 w-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />

                <p className="font-bold text-gray-800">
                  سفارش #<span dir="ltr">{debt.orderId}</span>
                </p>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {formatDateSafe(debt.createdAt, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${status.color}`}
            >
              {status.text}
            </span>
          </div>
          {deadline && (
            <div
              className={`mt-4 rounded-xl border px-3 py-3 ${
                deadline.expired
                  ? "border-red-200 bg-red-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-start gap-2">
                {deadline.expired ? (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                ) : (
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                )}

                <div>
                  <p
                    className={`text-xs font-semibold ${
                      deadline.expired ? "text-red-700" : "text-amber-700"
                    }`}
                  >
                    {deadline.expired
                      ? "مهلت پرداخت تمام شده"
                      : "مهلت پرداخت این سفارش"}
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      deadline.expired ? "text-red-600" : "text-amber-700"
                    }`}
                  >
                    {formatDateSafe(debt.shippingDueAt, {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>

                  {!deadline.expired && (
                    <p className="mt-1 text-xs text-amber-600">
                      {deadline.text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {formatNumber(itemsCount)} محصول
            </p>

            <p className="text-xs font-medium text-blue-600">
              {selected ? "برای تجمیع انتخاب شده" : "برای تجمیع انتخاب کنید"}
            </p>
          </div>
          <div className="mt-4">
            <ProductsAccordion label="محصولات این سفارش" count={itemsCount}>
              <div className="space-y-3">
                {debt.items.map((item) => (
                  <ProductItem key={item.orderItemId} item={item} />
                ))}
              </div>
            </ProductsAccordion>
          </div>
        </div>
      </div>
    </div>
  );
}
