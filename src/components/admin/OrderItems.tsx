"use client";

import Image from "next/image";
import { Package } from "lucide-react";

import type { AdminOrder } from "@/src/shared/hooks/useAdminOrders";

import { EmptyText, SectionTitle } from "./components";
import { formatPrice } from "./utils";

export default function OrderItems({ order }: { order: AdminOrder }) {
  return (
    <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
      <SectionTitle
        icon={<Package className="h-5 w-5" />}
        title="محصولات سفارش"
      />

      <div className="space-y-3">
        {order.items?.length ? (
          order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-200">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-800">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    تعداد:{" "}
                    {Number(item.quantity ?? 0).toLocaleString("fa-IR")}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                    {item.selectedColor && (
                      <span>رنگ: {item.selectedColor}</span>
                    )}

                    {item.selectedSize && (
                      <span>سایز: {item.selectedSize}</span>
                    )}

                    {item.selectedNumber && (
                      <span>شماره: {item.selectedNumber}</span>
                    )}

                    {item.variantName && (
                      <span>مدل: {item.variantName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 sm:text-left">
                <p className="font-bold text-gray-800">
                  {formatPrice(
                    Number(item.price ?? 0) * Number(item.quantity ?? 0),
                  )}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  هر عدد {formatPrice(Number(item.price ?? 0))}
                </p>
              </div>
            </div>
          ))
        ) : (
          <EmptyText text="محصولی برای این سفارش ثبت نشده است." />
        )}
      </div>
    </section>
  );
}