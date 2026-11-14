"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, ChevronLeft, Clock, CreditCard } from "lucide-react";
import { ORDER_STATUS } from "@/src/shared/lib/constants";
import type { OrderStatus } from "@/src/shared/types/order";

const statusMap: Record<
  string,
  {
    text: string;
    color: string;
  }
> = {
  PENDING_PAYMENT: {
    text: "در انتظار پرداخت",
    color: "bg-yellow-100 text-yellow-700",
  },

  WAITING_CONFIRMATION: {
    text: "در انتظار بررسی پرداخت",
    color: "bg-blue-100 text-blue-700",
  },

  CONFIRMED: {
    text: "تأیید شده",
    color: "bg-green-100 text-green-700",
  },

  PREPARING: {
    text: "در حال آماده‌سازی",
    color: "bg-purple-100 text-purple-700",
  },

  SHIPPED: {
    text: "ارسال شده",
    color: "bg-indigo-100 text-indigo-700",
  },

  DELIVERED: {
    text: "تحویل داده شده",
    color: "bg-green-100 text-green-700",
  },

  CANCELLED: {
    text: "لغو شده",
    color: "bg-red-100 text-red-700",
  },
};
type OrderListItem = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  totalPrice: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders ?? data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div dir="rtl" className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <Package
            size={45}
            className="mx-auto mb-4 animate-pulse text-pink-500"
          />
          <p className="font-bold">در حال دریافت سفارش‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">سفارش‌های من</h1>

          <p className="mt-2 text-sm text-gray-500">
            تمام سفارش‌هایی که ثبت کرده‌اید
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center">
            <Package size={50} className="mx-auto mb-4 text-gray-300" />

            <h2 className="font-bold text-gray-700">
              هنوز سفارشی ثبت نکرده‌اید
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = ORDER_STATUS[order.status as OrderStatus] ?? {
                text: order.status,
                color: "bg-gray-100 text-gray-600",
              };
              return (
                <Link
                  key={order.id}
                  href={`/profile/orders/${order.id}`}
                  className="
                    block
                    rounded-3xl
                    bg-white
                    p-5
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50">
                        <Package className="text-pink-500" />
                      </div>

                      <div>
                        <h3 className="font-bold">
                          سفارش #{order.id.slice(-8)}
                        </h3>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-400">مبلغ</p>

                        <p className="mt-1 font-bold text-pink-600">
                          {order.totalPrice?.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${status.color}`}
                      >
                        {status.text}
                      </span>

                      <ChevronLeft size={20} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
