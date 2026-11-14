"use client";

import { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Package,
  RefreshCw,
  User,
} from "lucide-react";

import { useAdminOrders } from "@/src/shared/hooks/useAdminOrders";

import OrderDetails from "./OrderDetails";
import { paymentStatusMap, orderStatusMap } from "./constants";
import { formatDate, formatPrice } from "./utils";
import { StatusBadge } from "./components";

export default function AdminOrders() {
  const { data, isLoading, error, refetch } = useAdminOrders();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const orders = data?.orders ?? [];

  const toggleOrder = (orderId: string) => {
    setExpandedOrder((prev) =>
      prev === orderId ? null : orderId,
    );
  };

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-100 items-center justify-center rounded-2xl border border-gray-100 bg-white"
      >
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />

          <span className="text-sm font-medium">
            در حال دریافت سفارش‌ها...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="rounded-2xl border border-red-200 bg-red-50 p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-red-700">
                خطا در دریافت سفارش‌ها
              </h3>

              <p className="mt-1 text-sm text-red-500">
                اطلاعات سفارش‌ها دریافت نشد. لطفاً دوباره تلاش کنید.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                <Package className="h-5 w-5" />
              </div>

              <h1 className="text-xl font-black text-gray-800">
                مدیریت سفارش‌ها
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-400">
              مشاهده سفارش، اطلاعات مشتری، مبلغ و وضعیت کلی ارسال
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-pink-100 bg-pink-50 px-4 py-2.5 text-sm font-bold text-pink-600">
              {orders.length.toLocaleString("fa-IR")} سفارش
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
              title="بروزرسانی"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
            <Package className="h-8 w-8 text-gray-300" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-700">
            هنوز سفارشی ثبت نشده
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            وقتی مشتری سفارشی ثبت کند، اطلاعات آن اینجا نمایش داده می‌شود.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;

            const paymentStatus =
              paymentStatusMap[
                order.paymentStatus as keyof typeof paymentStatusMap
              ] ?? {
                label: order.paymentStatus,
                className:
                  "bg-gray-50 text-gray-600 border-gray-200",
              };

            const orderStatus =
              orderStatusMap[order.status] ?? {
                label: order.status,
                className:
                  "bg-gray-50 text-gray-600 border-gray-200",
              };

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => toggleOrder(order.id)}
                  className="w-full p-4 text-right transition hover:bg-gray-50 md:p-5"
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr_auto] lg:items-center">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                        <Package className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-gray-800">
                          سفارش #{order.id.slice(-8)}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0 text-gray-400" />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">
                          مشتری
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-gray-700">
                          {order.user?.username ?? "کاربر حذف شده"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        مبلغ نهایی
                      </p>

                      <p className="mt-1 font-bold text-gray-800">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        label={orderStatus.label}
                        className={orderStatus.className}
                      />

                      <StatusBadge
                        label={paymentStatus.label}
                        className={paymentStatus.className}
                      />
                    </div>

                    <div className="flex justify-end text-gray-400">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <OrderDetails
                    order={order}
                    onRefresh={refetch}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
