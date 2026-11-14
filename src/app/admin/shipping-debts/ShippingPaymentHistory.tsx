"use client";

import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";

import type { ShippingPaymentHistoryItem } from "@/src/shared/types/shippingPaymentHistory";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getTypeLabel(type: ShippingPaymentHistoryItem["type"]) {
  return type === "DOMESTIC_BATCH" ? "ارسال داخلی" : "باربری وارداتی";
}

export default function ShippingPaymentHistory() {
  const [history, setHistory] = useState<ShippingPaymentHistoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/shipping-debts/history", {
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
      "این مورد فقط از تاریخچه ادمین حذف می‌شود. ادامه می‌دهید؟",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(receiptGroupId);
      setError(null);

      const res = await fetch(
        `/api/admin/shipping-debts/history/${encodeURIComponent(
          receiptGroupId,
        )}`,
        {
          method: "DELETE",
        },
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
    <section dir="rtl" className="rounded-3xl bg-white shadow-sm">
      <div className="border-b border-gray-300 p-5">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6" />

          <div>
            <h2 className="text-xl font-bold">تاریخچه پرداخت‌های ارسال</h2>

            <p className="mt-1 text-sm text-gray-500">
              سوابق تأیید و رد رسیدهای کاربران
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300" />

          <div className="mt-3 font-bold">تاریخچه‌ای وجود ندارد</div>

          <div className="mt-1 text-sm text-gray-500">
            هنوز رسید تأیید یا رد شده‌ای وجود ندارد.
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-300">
          {history.map((item) => {
            const rejected = item.status === "REJECTED";

            const deleting = deletingId === item.receiptGroupId;

            return (
              <div
                key={`${item.receiptGroupId}-${item.paymentId}`}
                className="p-5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2 ">
                        <h3 className="font-bold">{getTypeLabel(item.type)}</h3>

                        {rejected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                            <XCircle className="h-4 w-4" />
                            رد شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            تأیید شده
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {item.receiptImage && (
                          <a
                            href={item.receiptImage}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                            مشاهده رسید
                          </a>
                        )}

                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => deleteHistory(item.receiptGroupId)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          حذف از تاریخچه
                        </button>
                      </div>
                    </div>

                    {/* User */}
                    {item.user && (
                      <div className="mt-4 rounded-2xl border  border-gray-200 bg-gray-50 p-4">
                        <div className="text-xs text-gray-500">کاربر</div>

                        <div className="mt-1 font-bold">
                          {item.user.username}
                        </div>

                        <div className="mt-1 text-xs text-gray-500" dir="ltr">
                          {item.user.email}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 ">
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <div className="text-xs text-gray-500">مبلغ رسید</div>

                        <div className="mt-1 font-bold">
                          {formatPrice(item.amount)} تومان
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-3">
                        <div className="text-xs text-gray-500">تاریخ ثبت</div>

                        <div className="mt-1 text-sm font-semibold">
                          {formatDate(item.createdAt)}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-3">
                        <div className="text-xs text-gray-500">سفارش</div>

                        <div className="mt-1 text-sm font-semibold" dir="ltr">
                          #{item.orderId}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-3">
                        <div className="text-xs text-gray-500">پرداخت</div>

                        <div
                          className="mt-1 truncate text-xs font-semibold"
                          dir="ltr"
                        >
                          {item.paymentId}
                        </div>
                      </div>
                    </div>

                    {rejected && item.rejectionReason && (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        <div className="font-bold">دلیل رد</div>

                        <div className="mt-2 leading-6">
                          {item.rejectionReason}
                        </div>
                      </div>
                    )}

                    {item.adminNote && (
                      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                        <div className="font-bold">یادداشت ادمین</div>

                        <div className="mt-2 leading-6">{item.adminNote}</div>
                      </div>
                    )}

                    {item.reviewedAt && (
                      <div className="mt-3 text-xs text-gray-400">
                        بررسی شده در: {formatDate(item.reviewedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
