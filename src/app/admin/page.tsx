"use client";

import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowLeft,
  TrendingUp,
  CalendarDays,
  BarChart3,
} from "lucide-react";

import { useAdminDashboard } from "@/src/shared/hooks/useAdminDashboard";

const formatPrice = (price: number) =>
  `${Number(price || 0).toLocaleString("fa-IR")} تومان`;

const formatNumber = (value: number) =>
  Number(value || 0).toLocaleString("fa-IR");

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const orderStatusMap: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
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
};

const formatChartDate = (date: string) => {
  return new Intl.DateTimeFormat("fa-IR", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export default function AdminPage() {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center px-4"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 text-gray-500 shadow-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          <span>در حال دریافت اطلاعات داشبورد...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center px-4"
      >
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-red-600">
          {error instanceof Error
            ? error.message
            : "خطا در دریافت اطلاعات داشبورد"}
        </div>
      </div>
    );
  }

  const {
    stats,
    recentOrders,
    lowStockProducts,
    salesChart,
    orderStatusStats,
  } = data;

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  داشبورد مدیریت
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  نمای کلی فروشگاه، فروش و وضعیت سفارش‌ها
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600">
                <CalendarDays size={17} />
                <span>امروز</span>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-base font-bold text-gray-800">خلاصه فروش</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="فروش امروز"
                value={formatPrice(stats.todaySales)}
                icon={<TrendingUp size={22} />}
                isPrice
              />

              <StatCard
                title="فروش ۷ روز اخیر"
                value={formatPrice(stats.weekSales)}
                icon={<BarChart3 size={22} />}
                isPrice
              />

              <StatCard
                title="فروش ۳۰ روز اخیر"
                value={formatPrice(stats.monthSales)}
                icon={<CreditCard size={22} />}
                isPrice
              />

              <StatCard
                title="کل فروش"
                value={formatPrice(stats.totalSales)}
                icon={<CreditCard size={22} />}
                isPrice
              />
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-base font-bold text-gray-800">آمار کلی</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <StatCard
                title="سفارش امروز"
                value={stats.todayOrders}
                icon={<ShoppingBag size={22} />}
              />

              <StatCard
                title="سفارش این هفته"
                value={stats.weekOrders}
                icon={<ShoppingBag size={22} />}
              />

              <StatCard
                title="کل سفارش‌ها"
                value={stats.totalOrders}
                icon={<ShoppingBag size={22} />}
              />

              <StatCard
                title="کاربران"
                value={stats.totalUsers}
                icon={<Users size={22} />}
              />

              <StatCard
                title="پرداخت‌های منتظر بررسی"
                value={stats.pendingPayments}
                icon={<Clock size={22} />}
                danger={stats.pendingPayments > 0}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="min-w-0 rounded-3xl bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    فروش ۷ روز اخیر
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    روند فروش بر اساس سفارش‌های پرداخت‌شده
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                  <TrendingUp size={20} />
                </div>
              </div>

              <SalesChart data={salesChart} />
            </div>

            <div className="min-w-0 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <h2 className="font-bold text-gray-800">وضعیت سفارش‌ها</h2>

                  <p className="mt-1 text-xs text-gray-400">
                    نمای کلی سفارش‌های ثبت‌شده
                  </p>
                </div>
              </div>

              {orderStatusStats.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-400">
                  اطلاعاتی برای نمایش وجود ندارد
                </div>
              ) : (
                <div className="space-y-5">
                  {orderStatusStats.map((item) => {
                    const status = orderStatusMap[item.status] ?? {
                      label: item.status,
                      className: "bg-gray-100 text-gray-600",
                    };

                    const total = stats.totalOrders || 1;

                    const percentage = Math.min(
                      Math.round((item.count / total) * 100),
                      100,
                    );

                    return (
                      <div key={item.status}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="min-w-0 truncate text-sm text-gray-600">
                            {status.label}
                          </span>

                          <span className="shrink-0 text-sm font-bold text-gray-800">
                            {formatNumber(item.count)}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-pink-500 transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <div className="mt-1 text-left text-[11px] text-gray-400">
                          {formatNumber(percentage)}٪
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="min-w-0 rounded-3xl bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    آخرین سفارش‌ها
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    جدیدترین سفارش‌های ثبت‌شده
                  </p>
                </div>

                <Link
                  href="/admin/orders"
                  className="flex shrink-0 items-center gap-1 text-sm font-bold text-pink-500 transition hover:text-pink-600"
                >
                  <span>مشاهده همه</span>
                  <ArrowLeft size={16} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 p-8 text-center text-sm text-gray-400">
                  هنوز سفارشی ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => {
                    const status = orderStatusMap[order.status] ?? {
                      label: order.status,
                      className: "bg-gray-100 text-gray-600",
                    };

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-gray-100 p-4 transition hover:border-pink-100 hover:bg-gray-50"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(180px,1.5fr)_1fr_auto_auto] md:items-center">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                              <ShoppingBag size={20} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold text-gray-800">
                                سفارش #{order.id.slice(-8)}
                              </p>

                              <p className="mt-1 truncate text-xs text-gray-400">
                                {order.user?.username || "کاربر"}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 sm:text-sm">
                            {formatDate(order.createdAt)}
                          </div>

                          <div className="font-bold text-gray-800">
                            {formatPrice(order.totalPrice)}
                          </div>

                          <span
                            className={`w-fit whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="min-w-0 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <AlertTriangle size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-gray-800">موجودی کم</h2>

                  <p className="mt-1 text-xs text-gray-400">
                    محصولاتی که نیاز به بررسی دارند
                  </p>
                </div>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="rounded-2xl bg-green-50 p-6 text-center">
                  <CheckCircle className="mx-auto mb-2 text-green-500" />

                  <p className="text-sm font-bold text-green-700">
                    موجودی محصولات مناسب است
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-700">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-red-500">
                          موجودی: {formatNumber(product.stock)}
                        </p>
                      </div>

                      <Package size={20} className="shrink-0 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/admin/products"
                className="mt-5 block text-center text-sm font-bold text-pink-500 transition hover:text-pink-600"
              >
                مدیریت محصولات
              </Link>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-800">دسترسی سریع</h2>

              <p className="mt-1 text-xs text-gray-400">
                دسترسی سریع به بخش‌های مدیریتی فروشگاه
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction
                href="/admin/products"
                icon={<Package size={21} />}
                title="مدیریت محصولات"
                description="افزودن و ویرایش محصولات"
              />

              <QuickAction
                href="/admin/orders"
                icon={<ShoppingBag size={21} />}
                title="مدیریت سفارش‌ها"
                description="بررسی و پردازش سفارش‌ها"
              />

              <QuickAction
                href="/admin/orders?payment=REVIEW"
                icon={<CreditCard size={21} />}
                title="بررسی پرداخت‌ها"
                description="رسیدهای منتظر تأیید"
              />

              <QuickAction
                href="/admin/products"
                icon={<AlertTriangle size={21} />}
                title="موجودی محصولات"
                description="بررسی موجودی کالاها"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SalesChart({
  data,
}: {
  data: {
    date: string;
    sales: number;
    orders: number;
  }[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-400">
        اطلاعات فروش کافی نیست
      </div>
    );
  }

  const maxSales = Math.max(...data.map((item) => Number(item.sales) || 0), 1);
  const chartData = [...data].reverse();

  return (
    <div className="min-w-0">
      <div className="relative h-72 rounded-2xl bg-gray-50/80 px-3 pb-3 pt-5 sm:px-5">
        <div className="pointer-events-none absolute inset-x-4 top-6 bottom-12 flex flex-col justify-between">
          <div className="border-t border-dashed border-gray-200" />
          <div className="border-t border-dashed border-gray-200" />
          <div className="border-t border-dashed border-gray-200" />
          <div className="border-t border-dashed border-gray-200" />
          <div className="border-t border-gray-200" />
        </div>

        <div className="relative z-10 flex h-full items-end gap-2 sm:gap-4">
          {chartData.map((item) => {
            const sales = Number(item.sales) || 0;

            const height =
              sales === 0 ? 4 : Math.max((sales / maxSales) * 100, 6);

            return (
              <div
                key={item.date}
                className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
              >
                <div className="relative flex h-[calc(100%-28px)] w-full items-end justify-center">
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                    <div className="font-bold">{formatPrice(sales)}</div>

                    <div className="mt-1 text-gray-300">
                      {formatNumber(item.orders)} سفارش
                    </div>
                  </div>

                  <div
                    className="w-full max-w-14 rounded-t-xl bg-pink-500 transition-all duration-300 hover:bg-pink-600"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>

                <span className="mt-2 block w-full truncate text-center text-[10px] text-gray-400 sm:text-xs">
                  {formatChartDate(item.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-pink-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-pink-700">
          <TrendingUp size={17} />
          <span>فروش ۷ روز اخیر</span>
        </div>

        <span className="text-sm font-bold text-pink-700 sm:text-base">
          {formatPrice(
            data.reduce((sum, item) => sum + (Number(item.sales) || 0), 0),
          )}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  danger = false,
  isPrice = false,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  danger?: boolean;
  isPrice?: boolean;
}) {
  return (
    <div className="flex min-h-37.5 flex-col justify-between rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            danger ? "bg-red-50 text-red-500" : "bg-pink-50 text-pink-500"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm text-gray-400">{title}</p>

        <p
          className={`mt-2 wrap-break-word font-bold text-gray-800 ${
            isPrice ? "text-lg" : "text-2xl"
          }`}
        >
          {typeof value === "number" ? value.toLocaleString("fa-IR") : value}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-100 p-4 transition hover:border-pink-200 hover:bg-pink-50/40"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition group-hover:bg-pink-100 group-hover:text-pink-500">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate font-bold text-gray-800">{title}</p>

          <p className="mt-1 truncate text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}