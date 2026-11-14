"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  Eye,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  User,
  ShoppingBag,
} from "lucide-react";

import {
  AdminPayment,
  useAdminPayments,
} from "@/src/shared/hooks/useAdminPayments";

const formatPrice = (price: number) => {
  return `${price.toLocaleString("fa-IR")} تومان`;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const statusMap = {
  PENDING: {
    label: "در انتظار بررسی",
    className: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },

  APPROVED: {
    label: "تأیید شده",
    className: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },

  REJECTED: {
    label: "رد شده",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function AdminPaymentsPage() {
  const { data, isLoading, error, refetch } = useAdminPayments();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const [selectedPayment, setSelectedPayment] =
    useState<AdminPayment | null>(null);

  const [actionLoading, setActionLoading] = useState<
    string | null
  >(null);

  const [actionError, setActionError] = useState<string | null>(
    null,
  );

  const payments = data?.payments ?? [];

  const filteredPayments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        filter === "ALL" || payment.status === filter;

      if (!matchesStatus) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      const username =
        payment.order.user?.username?.toLowerCase() ?? "";

      const email =
        payment.order.user?.email?.toLowerCase() ?? "";

      const orderId = payment.orderId.toLowerCase();

      const payerName =
        payment.payerName?.toLowerCase() ?? "";

      return (
        username.includes(searchValue) ||
        email.includes(searchValue) ||
        orderId.includes(searchValue) ||
        payerName.includes(searchValue)
      );
    });
  }, [payments, search, filter]);

  const pendingCount = payments.filter(
    (payment) => payment.status === "PENDING",
  ).length;

  const approvedCount = payments.filter(
    (payment) => payment.status === "APPROVED",
  ).length;

  const rejectedCount = payments.filter(
    (payment) => payment.status === "REJECTED",
  ).length;

const handleApprove = async (payment: AdminPayment) => {
  const confirmed = window.confirm(
    `آیا از تأیید پرداخت سفارش #${payment.orderId.slice(-8)} اطمینان دارید؟`,
  );

  if (!confirmed) {
    return;
  }

  setActionError(null);
  setActionLoading(payment.id);

  try {
    const response = await fetch(
      `/api/admin/orders/${payment.orderId}/payment/approve`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "خطا در تأیید پرداخت",
      );
    }

    if (selectedPayment?.id === payment.id) {
      setSelectedPayment(null);
    }

    await refetch();
  } catch (error) {
    setActionError(
      error instanceof Error
        ? error.message
        : "خطا در تأیید پرداخت",
    );
  } finally {
    setActionLoading(null);
  }
};

const handleReject = async (payment: AdminPayment) => {
  const reason = window.prompt(
    "علت رد رسید را وارد کنید:",
  );

  if (reason === null) {
    return;
  }

  const normalizedReason = reason.trim();

  if (!normalizedReason) {
    setActionError("علت رد رسید الزامی است.");
    return;
  }

  const confirmed = window.confirm(
    `آیا از رد رسید سفارش #${payment.orderId.slice(-8)} اطمینان دارید؟`,
  );

  if (!confirmed) {
    return;
  }

  setActionError(null);
  setActionLoading(payment.id);

  try {
    const response = await fetch(
      `/api/admin/orders/${payment.orderId}/payment/reject`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          reason: normalizedReason,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "خطا در رد رسید",
      );
    }

    if (selectedPayment?.id === payment.id) {
      setSelectedPayment(null);
    }

    await refetch();
  } catch (error) {
    setActionError(
      error instanceof Error
        ? error.message
        : "خطا در رد رسید",
    );
  } finally {
    setActionLoading(null);
  }
};

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-100 items-center justify-center"
      >
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />

          در حال دریافت پرداخت‌ها...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600"
      >
        {error instanceof Error
          ? error.message
          : "خطا در دریافت پرداخت‌ها"}
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                <CreditCard size={22} />
              </div>

              <div>
                <h1 className="text-xl font-black text-gray-800">
                  مدیریت پرداخت‌ها
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  بررسی و مدیریت پرداخت‌های کارت‌به‌کارت
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <StatCard
              label="در انتظار"
              value={pendingCount}
              className="bg-yellow-50 text-yellow-700"
            />
            <StatCard
              label="تأیید شده"
              value={approvedCount}
              className="bg-green-50 text-green-700"
            />
            <StatCard
              label="رد شده"
              value={rejectedCount}
              className="bg-red-50 text-red-700"
            />
          </div>
        </div>
      </div>
      {actionError && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{actionError}</span>

          <button
            type="button"
            onClick={() => setActionError(null)}
            className="rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-red-100"
          >
            بستن
          </button>
        </div>
      )}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی سفارش، کاربر یا نام پرداخت‌کننده..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-3
                pr-10
                pl-4
                text-sm
                outline-none
                transition
                focus:border-pink-400
                focus:bg-white
              "
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === "ALL"}
              onClick={() => setFilter("ALL")}
            >
              همه
            </FilterButton>

            <FilterButton
              active={filter === "PENDING"}
              onClick={() => setFilter("PENDING")}
            >
              در انتظار بررسی
            </FilterButton>

            <FilterButton
              active={filter === "APPROVED"}
              onClick={() => setFilter("APPROVED")}
            >
              تأیید شده
            </FilterButton>

            <FilterButton
              active={filter === "REJECTED"}
              onClick={() => setFilter("REJECTED")}
            >
              رد شده
            </FilterButton>
          </div>
        </div>
      </div>
      {filteredPayments.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-300" />

          <h3 className="font-bold text-gray-700">
            پرداختی پیدا نشد
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            با فیلتر یا جستجوی دیگری امتحان کنید.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-right">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400">
                    پرداخت
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-gray-400">
                    مشتری
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-gray-400">
                    مبلغ
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-gray-400">
                    وضعیت
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-gray-400">
                    تاریخ
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-gray-400">
                    رسید
                  </th>

                  <th className="px-5 py-4 text-xs font-bold text-gray-400">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => {
                  const status = statusMap[payment.status];

                  const StatusIcon = status.icon;

                  const isLoadingAction =
                    actionLoading === payment.id;

                  return (
                    <tr
                      key={payment.id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-gray-800">
                            #{payment.orderId.slice(-8)}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            کارت‌به‌کارت
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                            <User
                              size={16}
                              className="text-gray-400"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {payment.order.user?.username ??
                                "کاربر حذف شده"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {payment.order.user?.email ?? "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-800">
                          {formatPrice(payment.amount)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                        >
                          <StatusIcon size={14} />

                          {status.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(payment.createdAt)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {payment.receiptImage ? (
                          <a
                            href={payment.receiptImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              bg-blue-50
                              px-3
                              py-2
                              text-xs
                              font-bold
                              text-blue-600
                              hover:bg-blue-100
                            "
                          >
                            <Receipt size={14} />
                            مشاهده
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            بدون رسید
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPayment(payment)
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-lg
                              bg-gray-100
                              px-3
                              py-2
                              text-xs
                              font-bold
                              text-gray-600
                              transition
                              hover:bg-pink-50
                              hover:text-pink-600
                            "
                          >
                            <Eye size={15} />
                            جزئیات
                          </button>

                          {payment.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={isLoadingAction}
                                onClick={() =>
                                  handleApprove(payment)
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-lg
                                  bg-green-50
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-green-700
                                  transition
                                  hover:bg-green-100
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >
                                {isLoadingAction ? (
                                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                                ) : (
                                  <CheckCircle size={15} />
                                )}

                                تأیید
                              </button>

                              <button
                                type="button"
                                disabled={isLoadingAction}
                                onClick={() =>
                                  handleReject(payment)
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-lg
                                  bg-red-50
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-red-700
                                  transition
                                  hover:bg-red-100
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >
                                <XCircle size={15} />

                                رد رسید
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          actionLoading={actionLoading === selectedPayment.id}
          onApprove={() => handleApprove(selectedPayment)}
          onReject={() => handleReject(selectedPayment)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div
      className={`min-w-22.5 rounded-xl px-4 py-3 text-center ${className}`}
    >
      <p className="text-lg font-black">
        {value.toLocaleString("fa-IR")}
      </p>

      <p className="mt-1 text-[11px] font-bold">
        {label}
      </p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl
        px-4
        py-2.5
        text-xs
        font-bold
        transition
        ${
          active
            ? "bg-pink-500 text-white shadow-sm"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }
      `}
    >
      {children}
    </button>
  );
}

function PaymentDetailsModal({
  payment,
  onClose,
  actionLoading,
  onApprove,
  onReject,
}: {
  payment: AdminPayment;
  onClose: () => void;
  actionLoading: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const status = statusMap[payment.status];

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="font-black text-gray-800">
              جزئیات پرداخت
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              سفارش #{payment.orderId.slice(-8)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
          >
            <XCircle size={22} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Status */}

          <div className="rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                وضعیت پرداخت
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <User size={18} className="text-pink-500" />

              <h3 className="font-bold text-gray-800">
                مشتری
              </h3>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">
                  نام کاربری:
                </span>{" "}
                {payment.order.user?.username ?? "-"}
              </p>

              <p>
                <span className="text-gray-400">
                  ایمیل:
                </span>{" "}
                {payment.order.user?.email ?? "-"}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard
                size={18}
                className="text-pink-500"
              />

              <h3 className="font-bold text-gray-800">
                اطلاعات پرداخت
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">
                  مبلغ:
                </span>{" "}
                <strong>
                  {formatPrice(payment.amount)}
                </strong>
              </p>

              <p>
                <span className="text-gray-400">
                  پرداخت‌کننده:
                </span>{" "}
                {payment.payerName ?? "-"}
              </p>

              <p>
                <span className="text-gray-400">
                  چهار رقم کارت:
                </span>{" "}
                {payment.payerCardLast4
                  ? `**** ${payment.payerCardLast4}`
                  : "-"}
              </p>

              <p>
                <span className="text-gray-400">
                  تاریخ:
                </span>{" "}
                {formatDate(payment.createdAt)}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag
                size={18}
                className="text-pink-500"
              />

              <h3 className="font-bold text-gray-800">
                سفارش
              </h3>
            </div>

            <p className="text-sm">
              <span className="text-gray-400">
                مبلغ سفارش:
              </span>{" "}
              {formatPrice(payment.order.totalPrice)}
            </p>
          </div>
          {payment.receiptImage && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Receipt
                  size={18}
                  className="text-blue-500"
                />

                <h3 className="font-bold text-gray-800">
                  رسید پرداخت
                </h3>
              </div>
              <a
                href={payment.receiptImage}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-blue-600
                  shadow-sm
                  hover:bg-blue-100
                "
              >
                <Eye size={17} />
                مشاهده رسید
              </a>
            </div>
          )}
          {payment.rejectionReason && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700">
                دلیل رد پرداخت
              </p>

              <p className="mt-2 text-sm text-red-600">
                {payment.rejectionReason}
              </p>
            </div>
          )}
          {payment.status === "PENDING" && (
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row">
              <button
                type="button"
                disabled={actionLoading}
                onClick={onApprove}
                className="
                  inline-flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-500
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-green-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {actionLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <CheckCircle size={18} />
                )}

                تأیید پرداخت
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={onReject}
                className="
                  inline-flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <XCircle size={18} />
                رد رسید
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
