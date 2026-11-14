"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Image as ImageIcon,
  Loader2,
  Package,
  RefreshCw,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import ShippingPaymentHistory from "./ShippingPaymentHistory";
import Image from "next/image";

type DebtType = "DOMESTIC_BATCH" | "FREIGHT";

type DebtItem = {
  orderItemId?: string;
  quantity: number;
  name: string;
  price: number;
  selectedColor?: string | null;
  selectedSize?: string | null;
  selectedNumber?: string | null;
  shippingClass?: string | null;
  volume?: number | null;
  volumeUnit?: string | null;
  availabilityType?: string | null;
};

type DebtOrder = {
  orderId: string;
  createdAt: string;
  status: string;
  items: DebtItem[];
};

type Debt = {
  paymentId: string;
  shipmentId: string;
  orderId: string;

  userId: string | null;
  username: string | null;
  email: string | null;

  amount: number;
  type: DebtType;

  parcelBatchId: string | null;

  shippingDue: number;
  freightDue: number;

  shippingDueAt: string | null;

  receiptImage: string | null;

  orders?: DebtOrder[];

  items?: DebtItem[];

  actualWeightGram?: number | null;
  freightRateYuan?: number | null;
  yuanExchangeRate?: number | null;
};

type DebtGroup = {
  receiptGroupId: string;
  receiptImage: string | null;
  createdAt: string;
  totalAmount: number;
  items: Debt[];
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatWeight(value: number | null | undefined) {
  if (!value) return "—";

  if (value >= 1000) {
    return `${formatPrice(value / 1000)} کیلوگرم`;
  }

  return `${formatPrice(value)} گرم`;
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "در انتظار بررسی";

    case "APPROVED":
      return "تأیید شده";

    case "REJECTED":
      return "رد شده";

    default:
      return status;
  }
}

function ProductItem({ item }: { item: DebtItem }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {item.name}
          </p>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            <span>تعداد: {formatPrice(item.quantity)}</span>

            <span>قیمت: {formatPrice(item.price)} تومان</span>

            {item.selectedColor && <span>رنگ: {item.selectedColor}</span>}

            {item.selectedSize && <span>سایز: {item.selectedSize}</span>}

            {item.selectedNumber && <span>شماره: {item.selectedNumber}</span>}
          </div>
        </div>

        {item.shippingClass && (
          <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs text-gray-600 ring-1 ring-gray-200">
            {item.shippingClass}
          </span>
        )}
      </div>
    </div>
  );
}

function UserInfo({ debt }: { debt: Debt }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-2">
        <User size={17} className="text-gray-500" />

        <span className="font-medium text-gray-900">
          {debt.username || "کاربر"}
        </span>
      </div>

      {debt.email && <p className="mt-1 text-sm text-gray-500">{debt.email}</p>}
    </div>
  );
}

function DomesticDebtCard({
  debt,
  onApprove,
  onReject,
  loading,
}: {
  debt: Debt;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Truck size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                هزینه ارسال بسته تجمیعی
              </h3>

              <p className="text-xs text-gray-500">بدهی ارسال داخلی</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700">
            <Clock size={14} />
            در انتظار بررسی
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <UserInfo debt={debt} />

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox label="شناسه بسته" value={debt.parcelBatchId || "—"} />

          <InfoBox
            label="مبلغ بدهی"
            value={`${formatPrice(debt.shippingDue)} تومان`}
            highlight
          />

          <InfoBox
            label="مبلغ رسید"
            value={`${formatPrice(debt.amount)} تومان`}
          />

          <InfoBox label="مهلت پرداخت" value={formatDate(debt.shippingDueAt)} />
        </div>

        {debt.orders && debt.orders.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Package size={17} className="text-gray-500" />

              <h4 className="font-medium text-gray-900">سفارش‌های داخل بسته</h4>
            </div>

            <div className="space-y-3">
              {debt.orders.map((order) => (
                <div
                  key={order.orderId}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      سفارش: {order.orderId}
                    </span>

                    <span className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <ProductItem
                        key={item.orderItemId ?? `${order.orderId}-${index}`}
                        item={item}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReceiptImage image={debt.receiptImage} />

        <ActionButtons
          loading={loading}
          onApprove={onApprove}
          onReject={onReject}
        />
      </div>
    </div>
  );
}

function FreightDebtCard({
  debt,
  onApprove,
  onReject,
  loading,
}: {
  debt: Debt;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <CreditCard size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">باربری وارداتی</h3>

              <p className="text-xs text-gray-500">
                هزینه باربری محصول وارداتی
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700">
            <Clock size={14} />
            در انتظار بررسی
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <UserInfo debt={debt} />

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoBox label="شماره سفارش" value={debt.orderId} />

          <InfoBox label="شناسه مرسوله" value={debt.shipmentId} />

          <InfoBox
            label="هزینه باربری"
            value={`${formatPrice(debt.freightDue)} تومان`}
            highlight
          />

          <InfoBox
            label="مبلغ رسید"
            value={`${formatPrice(debt.amount)} تومان`}
          />

          <InfoBox
            label="وزن واقعی"
            value={formatWeight(debt.actualWeightGram)}
          />

          <InfoBox
            label="نرخ باربری"
            value={
              debt.freightRateYuan != null
                ? `${debt.freightRateYuan} یوان`
                : "—"
            }
          />

          <InfoBox
            label="نرخ تبدیل یوان"
            value={
              debt.yuanExchangeRate != null
                ? `${formatPrice(debt.yuanExchangeRate)} تومان`
                : "—"
            }
          />
        </div>

        {debt.items && debt.items.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Package size={17} className="text-gray-500" />

              <h4 className="font-medium text-gray-900">محصولات این مرسوله</h4>
            </div>

            <div className="space-y-2">
              {debt.items.map((item, index) => (
                <ProductItem
                  key={item.orderItemId ?? `${debt.shipmentId}-${index}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        )}

        <ReceiptImage image={debt.receiptImage} />

        <ActionButtons
          loading={loading}
          onApprove={onApprove}
          onReject={onReject}
        />
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <p className="text-xs text-gray-500">{label}</p>

      <p
        className={`mt-1 break-all text-sm font-semibold ${
          highlight ? "text-blue-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ReceiptImage({ image }: { image: string | null }) {
  if (!image) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center text-sm text-gray-500">
        تصویر رسید ثبت نشده است.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <ImageIcon size={17} className="text-gray-500" />
        <h4 className="font-medium text-gray-900">تصویر رسید</h4>
      </div>

      <a
        href={image}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
      >
        <Image
          width={500}
          height={400}
          src={image}
          alt="رسید پرداخت"
          className="max-h-105 w-full object-contain transition-transform duration-200 group-hover:scale-[1.01]"
        />
      </a>
    </div>
  );
}

function ActionButtons({
  loading,
  onApprove,
  onReject,
}: {
  loading: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row">
      <button
        type="button"
        onClick={onApprove}
        disabled={loading}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <CheckCircle size={18} />
        )}
        تأیید پرداخت
      </button>

      <button
        type="button"
        onClick={onReject}
        disabled={loading}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <XCircle size={18} />
        رد رسید
      </button>
    </div>
  );
}

export default function AdminShippingDebtsPage() {
  const [groups, setGroups] = useState<DebtGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadDebts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/shipping-debts?status=PENDING", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "خطا در دریافت بدهی‌های ارسال");
      }

      setGroups(Array.isArray(data?.groups) ? data.groups : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت بدهی‌های ارسال",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDebts();
  }, [loadDebts]);

  const totalPending = useMemo(() => {
    return groups.reduce(
      (sum, group) => sum + Number(group.totalAmount || 0),
      0,
    );
  }, [groups]);

  const approvePayment = async (paymentId: string) => {
    try {
      setActionId(paymentId);
      setError("");

      const response = await fetch(
        `/api/admin/shipping-payments/${paymentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "APPROVE",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "خطا در تأیید پرداخت");
      }

      setGroups((current) =>
        current
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.paymentId !== paymentId),
          }))
          .filter((group) => group.items.length > 0),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در تأیید پرداخت");
    } finally {
      setActionId(null);
    }
  };

  const rejectPayment = async (paymentId: string) => {
    const rejectionReason = window.prompt("دلیل رد رسید را وارد کنید:");

    if (rejectionReason === null) {
      return;
    }

    if (!rejectionReason.trim()) {
      setError("دلیل رد رسید الزامی است.");
      return;
    }

    try {
      setActionId(paymentId);
      setError("");

      const response = await fetch(
        `/api/admin/shipping-payments/${paymentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "REJECT",
            rejectionReason: rejectionReason.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "خطا در رد رسید");
      }

      setGroups((current) =>
        current
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.paymentId !== paymentId),
          }))
          .filter((group) => group.items.length > 0),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در رد رسید");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">بدهی‌های ارسال</h1>

          <p className="mt-1 text-sm text-gray-500">
            بررسی و تأیید رسید هزینه ارسال داخلی و باربری وارداتی
          </p>
        </div>

        <button
          type="button"
          onClick={loadDebts}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          بروزرسانی
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">رسیدهای در انتظار بررسی</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatPrice(groups.length)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CreditCard size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">مجموع مبالغ رسیدها</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatPrice(totalPending)}
                <span className="mr-1 text-sm font-normal">تومان</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <XCircle size={18} className="mt-0.5 shrink-0" />

          <span>{error}</span>
        </div>
      )}
      {loading && (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 size={22} className="animate-spin" />
            در حال دریافت رسیدها...
          </div>
        </div>
      )}
      {!loading && groups.length === 0 && (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle size={28} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            رسیدی برای بررسی وجود ندارد
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            تمام رسیدهای ارسال بررسی شده‌اند.
          </p>
        </div>
      )}
      {!loading &&
        groups.map((group) => {
          const domesticDebts = group.items.filter(
            (item) => item.type === "DOMESTIC_BATCH",
          );

          const freightDebts = group.items.filter(
            (item) => item.type === "FREIGHT",
          );

          return (
            <div key={group.receiptGroupId} className="space-y-4">
              {group.items.length > 1 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        گروه رسید
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-500">
                        {group.receiptGroupId}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="text-xs text-gray-500">مبلغ کل رسید</p>

                      <p className="mt-1 font-bold text-gray-900">
                        {formatPrice(group.totalAmount)} تومان
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {domesticDebts.map((debt) => (
                <DomesticDebtCard
                  key={debt.paymentId}
                  debt={{
                    ...debt,
                    receiptImage: group.receiptImage,
                    orders: debt.orders ?? [],
                  }}
                  loading={actionId === debt.paymentId}
                  onApprove={() => approvePayment(debt.paymentId)}
                  onReject={() => rejectPayment(debt.paymentId)}
                />
              ))}

              {freightDebts.map((debt) => (
                <FreightDebtCard
                  key={debt.paymentId}
                  debt={{
                    ...debt,
                    receiptImage: group.receiptImage,
                  }}
                  loading={actionId === debt.paymentId}
                  onApprove={() => approvePayment(debt.paymentId)}
                  onReject={() => rejectPayment(debt.paymentId)}
                />
              ))}
            </div>
          );
        })}

      <ShippingPaymentHistory />
    </div>
  );
}
