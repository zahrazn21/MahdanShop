"use client";

import { useEffect, useState } from "react";

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Eye,
  FileText,
  Loader2,
  Package,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react";

import type { ShippingPaymentHistoryItem } from "@/src/shared/types/shippingPaymentHistory";
import {
  formatDateSafe,
  formatNumber,
  formatPrice,
} from "@/src/shared/lib/format";

function formatWeight(weight: number | null) {
  if (weight === null) return "-";
  return `${formatNumber(weight)} گرم`;
}

function formatPriceOrDash(value: number | null | undefined) {
  return value === null || value === undefined ? "-" : formatPrice(value);
}

function getTypeLabel(type: ShippingPaymentHistoryItem["type"]) {
  return type === "DOMESTIC_BATCH"
    ? "هزینه ارسال داخلی"
    : "هزینه باربری وارداتی";
}

function getStatusLabel(status: ShippingPaymentHistoryItem["status"]) {
  return status === "APPROVED" ? "تأیید شده" : "رد شده";
}

export default function ShippingPaymentHistory() {
  const [history, setHistory] = useState<ShippingPaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/shipping-debts/history", {
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "خطا در دریافت تاریخچه");
      }

      setHistory(data?.history ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت تاریخچه");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteHistory = async (receiptGroupId: string) => {
    const confirmed = window.confirm(
      "آیا از حذف این مورد از تاریخچه خود مطمئن هستید؟ این عملیات فقط آن را از تاریخچه شما مخفی می‌کند.",
    );
    if (!confirmed) return;

    try {
      setDeletingId(receiptGroupId);
      setError(null);

      const res = await fetch(
        `/api/shipping-debts/history/${encodeURIComponent(receiptGroupId)}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "خطا در حذف تاریخچه");
      }

      setHistory((current) =>
        current.filter((item) => item.receiptGroupId !== receiptGroupId),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در حذف تاریخچه");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section dir="rtl" className="min-w-0 rounded-2xl bg-white shadow-sm sm:rounded-3xl">
      <div className="border-b border-gray-200 p-3 sm:p-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <FileText className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
          <div className="min-w-0">
            <h2 className="text-base font-bold sm:text-xl">
              تاریخچه پرداخت‌های ارسال
            </h2>
            <p className="mt-0.5 text-[11px] leading-5 text-gray-500 sm:mt-1 sm:text-sm">
              جزئیات رسیدها، هزینه‌ها، سفارش‌ها و وضعیت بررسی پرداخت‌های شما
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="m-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:m-5 sm:rounded-2xl sm:p-4 sm:text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center sm:p-10">
          <FileText className="mx-auto h-10 w-10 text-gray-300" />
          <div className="mt-3 text-sm font-bold sm:text-base">
            تاریخچه‌ای وجود ندارد
          </div>
          <div className="mt-1 text-xs text-gray-500 sm:text-sm">
            هنوز پرداخت تأیید یا رد شده‌ای ندارید.
          </div>
        </div>
      ) : (
        <div className="space-y-3 p-3 sm:space-y-4 sm:p-5">
          {history.map((item) => {
            const rejected = item.status === "REJECTED";
            const deleting = deletingId === item.receiptGroupId;
            const expanded = expandedId === item.paymentId;

            return (
              <article
                key={`${item.receiptGroupId}-${item.paymentId}`}
                className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:rounded-3xl"
              >
                <div className="p-3 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                        {item.type === "DOMESTIC_BATCH" ? (
                          <Truck className="h-4 w-4 shrink-0 text-pink-600 sm:h-5 sm:w-5" />
                        ) : (
                          <Package className="h-4 w-4 shrink-0 text-pink-600 sm:h-5 sm:w-5" />
                        )}

                        <h3 className="text-sm font-bold sm:text-base">
                          {getTypeLabel(item.type)}
                        </h3>

                        {rejected ? (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 sm:px-3 sm:py-1.5 sm:text-xs">
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            {getStatusLabel(item.status)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 sm:px-3 sm:py-1.5 sm:text-xs">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            {getStatusLabel(item.status)}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 text-[11px] text-gray-500 sm:mt-2 sm:text-xs">
                        پرداخت در {formatDateSafe(item.createdAt)}
                      </div>
                    </div>

                    <div className="shrink-0 text-left">
                      <div className="text-[10px] text-gray-500 sm:text-xs">
                        مبلغ پرداخت
                      </div>
                      <div className="mt-0.5 whitespace-nowrap text-sm font-black text-pink-600 sm:mt-1 sm:text-xl">
                        {formatPrice(item.amount)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 lg:grid-cols-4">
                    <InfoBox
                      label="تعداد سفارش"
                      value={formatNumber(item.orderCount)}
                    />
                    <InfoBox
                      label="تعداد محصول"
                      value={formatNumber(item.productCount)}
                    />

                    {item.type === "DOMESTIC_BATCH" && (
                      <InfoBox
                        label="حجم کل بسته"
                        value={
                          item.totalVolume !== null
                            ? formatNumber(item.totalVolume)
                            : "-"
                        }
                      />
                    )}

                    {item.type === "FREIGHT" && (
                      <InfoBox
                        label="وزن واقعی"
                        value={formatWeight(item.actualWeightGram)}
                      />
                    )}
                  </div>
                  <div className="mt-2 rounded-xl bg-gray-50 p-3 sm:mt-3 sm:rounded-2xl sm:p-4">
                    <div className="mb-2 text-sm font-bold sm:mb-3 sm:text-base">
                      جزئیات هزینه
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 sm:gap-3 lg:grid-cols-4">
                      {item.type === "DOMESTIC_BATCH" && (
                        <>
                          <CostRow
                            label="هزینه کل بسته"
                            value={formatPriceOrDash(item.shippingCost)}
                          />
                          <CostRow
                            label="شناسه بسته"
                            value={item.parcelBatchId || "-"}
                            ltr
                          />
                        </>
                      )}

                      {item.type === "FREIGHT" && (
                        <>
                          <CostRow
                            label="هزینه باربری"
                            value={formatPriceOrDash(item.freightCostToman)}
                          />
                          <CostRow
                            label="وزن واقعی"
                            value={formatWeight(item.actualWeightGram)}
                          />
                          <CostRow
                            label="نرخ باربری"
                            value={
                              item.freightRateYuan !== null
                                ? `${formatNumber(item.freightRateYuan)} یوان`
                                : "-"
                            }
                          />
                          <CostRow
                            label="نرخ یوان"
                            value={formatPriceOrDash(item.yuanExchangeRate)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expanded ? null : item.paymentId)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-50 sm:flex-none sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
                    >
                      {expanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      )}
                      {expanded ? "بستن جزئیات" : "سفارش‌ها و محصولات"}
                    </button>

                    {item.receiptImage && (
                      <a
                        href={item.receiptImage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-50 sm:flex-none sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
                      >
                        <Eye className="h-4 w-4 shrink-0" />
                        مشاهده رسید
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => deleteHistory(item.receiptGroupId)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 shrink-0" />
                      )}
                      حذف از تاریخچه
                    </button>
                  </div>
                </div>
                {expanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-5">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                      <h4 className="text-sm font-bold sm:text-base">
                        سفارش‌ها و محصولات
                      </h4>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {item.orders.map((order) => (
                        <div
                          key={order.orderId}
                          className="min-w-0 rounded-xl border border-gray-200 bg-white p-2.5 sm:rounded-2xl sm:p-4"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-bold sm:text-base">
                                سفارش #<span dir="ltr">{order.orderId}</span>
                              </div>
                              <div className="mt-0.5 text-[11px] text-gray-500 sm:mt-1 sm:text-xs">
                                {formatDateSafe(order.createdAt)}
                              </div>
                            </div>

                            <div className="shrink-0 whitespace-nowrap text-[11px] text-gray-500 sm:text-xs">
                              {formatNumber(order.products.length)} قلم
                            </div>
                          </div>

                          <div className="mt-2.5 space-y-2 sm:mt-4">
                            {order.products.map((product) => (
                              <div
                                key={product.orderItemId}
                                className="rounded-lg bg-gray-50 p-2.5 sm:rounded-xl sm:p-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1 wrap-break-word text-xs font-semibold sm:text-base">
                                    {product.name}
                                  </div>
                                  <div className="shrink-0 whitespace-nowrap text-xs font-bold sm:text-sm">
                                    × {formatNumber(product.quantity)}
                                  </div>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-gray-500 sm:gap-2 sm:text-xs">
                                  {product.selectedColor && (
                                    <span className="rounded-md bg-white px-2 py-1 sm:rounded-lg">
                                      رنگ: {product.selectedColor}
                                    </span>
                                  )}
                                  {product.selectedSize && (
                                    <span className="rounded-md bg-white px-2 py-1 sm:rounded-lg">
                                      سایز: {product.selectedSize}
                                    </span>
                                  )}
                                  {product.selectedNumber && (
                                    <span className="rounded-md bg-white px-2 py-1 sm:rounded-lg">
                                      شماره: {product.selectedNumber}
                                    </span>
                                  )}
                                  <span className="rounded-md bg-white px-2 py-1 sm:rounded-lg">
                                    قیمت واحد: {formatPrice(product.price)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {rejected && item.rejectionReason && (
                  <div className="border-t border-red-100 bg-red-50 p-3 text-xs text-red-800 sm:p-5 sm:text-sm">
                    <div className="font-bold">دلیل رد رسید</div>
                    <div className="mt-1.5 wrap-break-word leading-6 sm:mt-2 sm:leading-7">
                      {item.rejectionReason}
                    </div>
                  </div>
                )}
                {item.adminNote && (
                  <div className="border-t border-blue-100 bg-blue-50 p-3 text-xs text-blue-800 sm:p-5 sm:text-sm">
                    <div className="font-bold">توضیحات ادمین</div>
                    <div className="mt-1.5 wrap-break-word leading-6 sm:mt-2 sm:leading-7">
                      {item.adminNote}
                    </div>
                  </div>
                )}
                {item.reviewedAt && (
                  <div className="border-t border-gray-100 px-3 py-2.5 sm:px-5 sm:py-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 sm:gap-2 sm:text-xs">
                      <Clock3 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      بررسی شده در: {formatDateSafe(item.reviewedAt)}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-gray-50 p-2.5 sm:rounded-2xl sm:p-3">
      <div className="text-[11px] text-gray-500 sm:text-xs">{label}</div>
      <div className="mt-0.5 wrap-break-word text-sm font-bold sm:mt-1 sm:text-base">
        {value}
      </div>
    </div>
  );
}

function CostRow({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-gray-500 sm:text-xs">{label}</div>
      <div
        dir={ltr ? "ltr" : undefined}
        className={`mt-0.5 wrap-break-word text-xs font-semibold sm:mt-1 sm:text-sm ${
          ltr ? "text-right" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}