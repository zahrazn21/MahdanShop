"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  User,
  Mail,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  Clock3,
  XCircle,
  Package,
  ChevronLeft,
  ShieldCheck,
  Star,
} from "lucide-react";

import {
  useAdminUser,
  AdminUserOrder,
} from "@/src/shared/hooks/useAdminUser";
import { formatDateSafe, formatPrice } from "@/src/shared/lib/format";



const paymentStatusMap = {
  PENDING: {
    label: "در انتظار پرداخت",
    className: "bg-yellow-100 text-yellow-700",
  },
  REVIEW: {
    label: "در انتظار بررسی",
    className: "bg-blue-100 text-blue-700",
  },
  PAID: {
    label: "پرداخت شده",
    className: "bg-green-100 text-green-700",
  },
  REJECTED: {
    label: "پرداخت رد شده",
    className: "bg-red-100 text-red-700",
  },
} as const;

const orderStatusMap = {
  PENDING_PAYMENT: {
    label: "در انتظار پرداخت",
    className: "bg-yellow-100 text-yellow-700",
  },
  WAITING_CONFIRMATION: {
    label: "در انتظار تأیید",
    className: "bg-blue-100 text-blue-700",
  },
  CONFIRMED: {
    label: "تأیید شده",
    className: "bg-green-100 text-green-700",
  },
  PREPARING: {
    label: "در حال آماده‌سازی",
    className: "bg-purple-100 text-purple-700",
  },
  SHIPPED: {
    label: "ارسال شده",
    className: "bg-indigo-100 text-indigo-700",
  },
  DELIVERED: {
    label: "تحویل داده شده",
    className: "bg-emerald-100 text-emerald-700",
  },
  CANCELLED: {
    label: "لغو شده",
    className: "bg-red-100 text-red-700",
  },
} as const;

export default function AdminUserPage() {
  const params = useParams();

  const userId = params.id as string;

  const { data, isLoading, error } = useAdminUser(userId);

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />

          <span className="text-sm text-gray-500">
            در حال دریافت اطلاعات کاربر...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-pink-600"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به کاربران
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error instanceof Error
            ? error.message
            : "خطا در دریافت اطلاعات کاربر"}
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div dir="rtl" className="rounded-2xl bg-white p-10 text-center">
        <User className="mx-auto mb-3 h-12 w-12 text-gray-300" />

        <h2 className="font-bold text-gray-700">
          کاربر پیدا نشد
        </h2>

        <Link
          href="/admin/users"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600"
        >
          بازگشت به کاربران
        </Link>
      </div>
    );
  }

  const { user, statistics, orders } = data;

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/users"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:border-pink-200 hover:text-pink-600"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به کاربران
        </Link>

        <div className="text-sm text-gray-400">
          مدیریت کاربر
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-24 bg-linear-to-l from-pink-500 via-pink-400 to-rose-300" />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-pink-50 text-pink-500 shadow-sm">
                <User className="h-9 w-9" />
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-gray-800">
                    {user.username}
                  </h1>

                  {user.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-bold text-purple-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      مدیر
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-400">
                  شناسه: {user.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-yellow-50 px-4 py-2.5 text-sm font-bold text-yellow-700">
              <Star className="h-4 w-4" />
              {user.points.toLocaleString("fa-IR")} امتیاز
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon={Mail}
              label="ایمیل"
              value={user.email}
            />

            <InfoItem
              icon={CalendarDays}
              label="تاریخ عضویت"
              value={formatDateSafe(user.createdAt)}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="کل سفارش‌ها"
          value={statistics.totalOrders}
          suffix="سفارش"
        />
        <StatCard
          icon={CreditCard}
          label="پرداخت‌های تأیید شده"
          value={statistics.paidOrders}
          suffix="پرداخت"
          iconClass="text-green-500"
          bgClass="bg-green-50"
        />
        <StatCard
          icon={Clock3}
          label="در انتظار بررسی"
          value={statistics.pendingOrders}
          suffix="پرداخت"
          iconClass="text-blue-500"
          bgClass="bg-blue-50"
        />
        <StatCard
          icon={XCircle}
          label="پرداخت‌های رد شده"
          value={statistics.rejectedOrders}
          suffix="پرداخت"
          iconClass="text-red-500"
          bgClass="bg-red-50"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">
                مجموع خرید
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                مجموع سفارش‌های پرداخت‌شده
              </p>
            </div>
          </div>
          <p className="mt-5 text-2xl font-black text-pink-600">
            {formatPrice(statistics.totalPurchased)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">
                محصولات خریداری‌شده
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                مجموع تعداد آیتم‌ها
              </p>
            </div>
          </div>
          <p className="mt-5 text-2xl font-black text-gray-800">
            {statistics.totalItems.toLocaleString("fa-IR")}
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="font-black text-gray-800">
              سفارش‌های کاربر
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {orders.length.toLocaleString("fa-IR")} سفارش
            </p>
          </div>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-gray-200" />

            <p className="font-bold text-gray-500">
              این کاربر هنوز سفارشی ثبت نکرده است.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  iconClass = "text-pink-500",
  bgClass = "bg-pink-50",
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: number;
  suffix: string;
  iconClass?: string;
  bgClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgClass} ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <span className="text-xs text-gray-400">
          {label}
        </span>
      </div>

      <div className="mt-5 flex items-end gap-2">
        <span className="text-2xl font-black text-gray-800">
          {value.toLocaleString("fa-IR")}
        </span>

        <span className="mb-1 text-xs text-gray-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function OrderRow({
  order,
}: {
  order: AdminUserOrder;
}) {
  const paymentStatus =
    paymentStatusMap[order.paymentStatus];

  const orderStatus =
    orderStatusMap[order.status];

  return (
    <div className="p-5 transition hover:bg-gray-50">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Order */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <div>
            <p className="font-bold text-gray-800">
              سفارش #{order.id.slice(-8)}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {formatDateSafe(order.createdAt)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-[11px] text-gray-400">
            مبلغ سفارش
          </p>

          <p className="mt-1 font-bold text-gray-800">
            {formatPrice(order.totalPrice)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400">
            محصولات
          </p>

          <p className="mt-1 font-medium text-gray-700">
            {order.items.length.toLocaleString("fa-IR")} محصول
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatus.className}`}
          >
            {orderStatus.label}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStatus.className}`}
          >
            {paymentStatus.label}
          </span>
        </div>
        <Link
          href={`/admin/orders?order=${order.id}`}
          className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-pink-200 hover:text-pink-600"
        >
          جزئیات
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}