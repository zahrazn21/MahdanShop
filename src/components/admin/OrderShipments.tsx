"use client";

import {
  Box,
  Calendar,
  CheckCircle,
  Clock,
  Hash,
  Package,
  Truck,
  Weight,
} from "lucide-react";

import type { AdminShipment } from "@/src/shared/hooks/useAdminShipments";

import { shipmentStatusMap } from "./constants";
import { MiniInfo, SectionTitle, StatusBadge } from "./components";
import { formatDate, formatPrice } from "./utils";
import Link from "next/link";

export default function OrderShipments({
  shipments,
}: {
  orderId: string;
  shipments: AdminShipment[];
  onRefresh: () => void;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionTitle
          icon={<Truck className="h-5 w-5" />}
          title="خلاصه مرسوله‌ها"
        />

        {shipments.length > 0 && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
            {shipments.length.toLocaleString("fa-IR")} مرسوله
          </span>
        )}
      </div>
      {shipments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <Box className="mx-auto h-8 w-8 text-gray-300" />

          <p className="mt-2 text-sm font-medium text-gray-500">
            برای این سفارش هنوز مرسوله‌ای ثبت نشده است.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            اطلاعات ارسال پس از ایجاد مرسوله در این بخش نمایش داده می‌شود.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shipments.map((shipment, index) => {
            const status = shipmentStatusMap[shipment.status] ?? {
              label: shipment.status,
              className: "bg-gray-50 text-gray-600 border-gray-200",
            };

            const isImported = shipment.shipmentType === "IMPORTED";

            return (
              <div
                key={shipment.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500">
                      <Truck className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-gray-800">
                        مرسوله {(index + 1).toLocaleString("fa-IR")}
                      </p>

                      <p className="mt-1 font-mono text-[11px] text-gray-400">
                        {shipment.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      label={status.label}
                      className={status.className}
                    />

                    <Link
                      href={`/admin/shipments?shipmentId=${encodeURIComponent(
                        shipment.id,
                      )}`}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-pink-600 shadow-sm transition hover:bg-pink-50"
                    >
                      بررسی مرسوله
                    </Link>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <MiniInfo
                    icon={<Package className="h-4 w-4" />}
                    label="نوع مرسوله"
                    value={isImported ? "وارداتی" : "داخلی"}
                  />

                  <MiniInfo
                    icon={<Hash className="h-4 w-4" />}
                    label="کد رهگیری"
                    value={shipment.trackingNumber || "هنوز ثبت نشده"}
                  />

                  <MiniInfo
                    icon={<Weight className="h-4 w-4" />}
                    label="وزن واقعی"
                    value={
                      shipment.actualWeightGram
                        ? `${Number(shipment.actualWeightGram).toLocaleString(
                            "fa-IR",
                          )} گرم`
                        : "ثبت نشده"
                    }
                  />

                  <MiniInfo
                    icon={<Calendar className="h-4 w-4" />}
                    label="تاریخ ایجاد"
                    value={formatDate(shipment.createdAt)}
                  />
                </div>

                {(shipment.shippingCost ||
                  shipment.freightCostToman ||
                  shipment.freightRateYuan) && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {!isImported && shipment.shippingCost != null && (
                      <MiniInfo
                        icon={<Truck className="h-4 w-4" />}
                        label="هزینه ارسال"
                        value={formatPrice(shipment.shippingCost)}
                      />
                    )}

                    {isImported && shipment.freightCostToman != null && (
                      <MiniInfo
                        icon={<Package className="h-4 w-4" />}
                        label="هزینه باربری"
                        value={formatPrice(shipment.freightCostToman)}
                      />
                    )}

                    {isImported && shipment.freightPaymentStatus && (
                      <MiniInfo
                        icon={<Clock className="h-4 w-4" />}
                        label="وضعیت پرداخت باربری"
                        value={shipment.freightPaymentStatus}
                      />
                    )}

                    {!isImported && shipment.shippingPaymentStatus && (
                      <MiniInfo
                        icon={<Clock className="h-4 w-4" />}
                        label="وضعیت پرداخت ارسال"
                        value={shipment.shippingPaymentStatus}
                      />
                    )}
                  </div>
                )}

                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-3">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                    {shipment.shippedAt && (
                      <div className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-indigo-500" />

                        <span>
                          ارسال:{" "}
                          <span className="font-medium text-gray-700">
                            {formatDate(shipment.shippedAt)}
                          </span>
                        </span>
                      </div>
                    )}

                    {shipment.deliveredAt && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />

                        <span>
                          تحویل:{" "}
                          <span className="font-medium text-gray-700">
                            {formatDate(shipment.deliveredAt)}
                          </span>
                        </span>
                      </div>
                    )}

                    {!shipment.shippedAt && !shipment.deliveredAt && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="h-3.5 w-3.5" />

                        <span>هنوز ارسال نشده است</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-400">
                  <Truck className="h-3.5 w-3.5 shrink-0" />

                  <span>
                    مدیریت وضعیت، باربری، پرداخت حمل و کد رهگیری از بخش «مدیریت
                    مرسوله‌ها» انجام می‌شود.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
