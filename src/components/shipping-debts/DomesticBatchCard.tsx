"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";

import type { DomesticBatchDebt } from "@/src/shared/types/shippingDebt";
import { formatDateSafe, formatNumber } from "@/src/shared/lib/format";
import { InfoRow } from "../ui/InfoRow";
import { StatusBanner } from "../ui/StatusBanner";
import { DebtCardShell } from "./DebtCardShell";
import { ProductItem } from "./ProductItem";
import { ProductsAccordion } from "./ProductsAccordion";
import { ORDER_STATUS } from "@/src/shared/lib/constants";

interface Props {
  debt: DomesticBatchDebt;
  selected: boolean;
  onToggle: () => void;
}

function getDeadlineState(dueAt: Date | string | null, now: number) {
  if (!dueAt) return null;

  const dueDate = new Date(dueAt);
  if (Number.isNaN(dueDate.getTime())) return null;

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

  let remainingText = "";

  if (days > 0) {
    remainingText = `${formatNumber(days)} روز و ${formatNumber(hours)} ساعت باقی مانده`;
  } else if (hours > 0) {
    remainingText = `${formatNumber(hours)} ساعت باقی مانده`;
  } else {
    remainingText = "کمتر از یک ساعت باقی مانده";
  }

  return { expired: false, text: remainingText, dueDate };
}

export function DomesticBatchCard({ debt, selected, onToggle }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const itemsCount = debt.orders.reduce(
    (sum, order) => sum + order.items.length,
    0,
  );

  const isOpen = debt.status === "OPEN";
  const isPaymentPending = debt.paymentStatus === "PENDING";
  const isPaymentRejected = debt.paymentStatus === "REJECTED";

  const hasExpiredOrder = debt.orders
    .filter((order) => order.shippingDueAt)
    .some((order) => getDeadlineState(order.shippingDueAt, now)?.expired);

  const productPaymentApproved =
    debt.orders.length > 0 &&
    debt.orders.every((order) => order.orderPaymentStatus === "PAID");

  const selectionDisabled = isPaymentPending || !productPaymentApproved;

  return (
    <DebtCardShell
      selected={selected}
      onToggle={onToggle}
      disabled={selectionDisabled}
      title="هزینه ارسال داخلی"
      amount={debt.totalDue}
      badge={
        <span
          className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs ${
            isOpen ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {isOpen ? "در حال تجمیع" : "در انتظار پرداخت"}
        </span>
      }
      subtitle={
        <>
          شناسه بسته:{" "}
          <span dir="ltr" className="break-all">
            {debt.parcelBatchId}
          </span>
        </>
      }
    >
      <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <InfoRow label="حجم کل بسته" value={formatNumber(debt.totalVolume)} />
          <InfoRow
            label="تعداد سفارش‌ها"
            value={formatNumber(debt.orders.length)}
          />
        </div>

        {isPaymentPending && (
          <StatusBanner
            tone="blue"
            icon={Clock}
            title="رسید پرداخت شما ارسال شده و در انتظار بررسی است"
            description="تا زمان بررسی رسید، امکان ارسال مجدد رسید برای این بسته وجود ندارد."
          />
        )}

        {isPaymentRejected && (
          <StatusBanner
            tone="red"
            icon={AlertCircle}
            title="رسید پرداخت قبلی رد شده است"
            description={
              debt.rejectionReason ? (
                <>
                  <span className="font-semibold">دلیل رد:</span>{" "}
                  {debt.rejectionReason}
                </>
              ) : (
                "رسید پرداخت قبلی تأیید نشده است."
              )
            }
            note="می‌توانید با توجه به دلیل اعلام‌شده، رسید جدید ثبت کنید."
          />
        )}

        {!productPaymentApproved && (
          <StatusBanner
            tone="amber"
            icon={AlertCircle}
            title="پرداخت هزینه محصولات این بسته هنوز کامل تأیید نشده است"
            description="تا زمانی که هزینه محصول همه سفارش‌های این بسته تأیید نشود، امکان پرداخت هزینه ارسال وجود ندارد."
            note="پس از تأیید پرداخت همه سفارش‌ها، این بسته دوباره قابل انتخاب خواهد بود."
          />
        )}

        {hasExpiredOrder && (
          <StatusBanner
            tone="red"
            icon={AlertCircle}
            title="مهلت پرداخت یکی از سفارش‌های این بسته به پایان رسیده است"
            description="هزینه ارسال این بسته به‌صورت یکجا محاسبه شده و پرداخت آن از طریق همین بسته انجام می‌شود."
            note="لطفاً وضعیت پرداخت این بسته را بررسی کنید."
          />
        )}

        <ProductsAccordion
          label="محصولات و سفارش‌های این بسته"
          count={itemsCount}
        >
          {debt.orders.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-3 text-center text-xs text-gray-500 sm:rounded-2xl sm:p-4 sm:text-sm">
              اطلاعات محصولات این بسته موجود نیست.
            </p>
          ) : (
            debt.orders.map((order) => {
              const status = ORDER_STATUS[order.status];
              const deadline = getDeadlineState(order.shippingDueAt, now);

              return (
                <div
                  key={order.orderId}
                  className="min-w-0 rounded-xl border border-pink-200 bg-pink-50/70 p-2 sm:rounded-2xl sm:p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold sm:text-base">
                        سفارش #<span dir="ltr">{order.orderId}</span>
                      </p>
                      <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
                        {formatDateSafe(order.createdAt, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  {deadline && (
                    <div
                      className={`mt-2 rounded-lg border p-2 sm:mt-4 sm:rounded-xl sm:p-3 ${
                        deadline.expired
                          ? "border-red-200 bg-red-50"
                          : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="flex items-start gap-1.5 sm:gap-2">
                        {deadline.expired ? (
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600 sm:h-4 sm:w-4" />
                        ) : (
                          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 sm:h-4 sm:w-4" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[10px] font-semibold sm:text-xs ${
                              deadline.expired
                                ? "text-red-700"
                                : "text-amber-700"
                            }`}
                          >
                            {deadline.expired
                              ? "مهلت پرداخت تمام شده"
                              : "مهلت پرداخت این سفارش"}
                          </p>

                          <p
                            className={`mt-0.5 wrap-break-word text-[11px] leading-5 sm:mt-1 sm:text-sm ${
                              deadline.expired
                                ? "text-red-600"
                                : "text-amber-700"
                            }`}
                          >
                            {formatDateSafe(order.shippingDueAt, {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>

                          {!deadline.expired && (
                            <p className="mt-0.5 text-[10px] text-amber-600 sm:mt-1 sm:text-xs">
                              {deadline.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex min-w-0 flex-col gap-2 sm:mt-4 sm:gap-3">
                    {order.items.map((item) => (
                      <ProductItem key={item.orderItemId} item={item} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </ProductsAccordion>

        <p className="text-[10px] leading-5 text-gray-400 sm:text-xs">
          این مبلغ هزینه ارسال داخلی کل این بسته است و برای هر سفارش یا محصول
          جداگانه محاسبه نمی‌شود.
        </p>
      </div>
    </DebtCardShell>
  );
}