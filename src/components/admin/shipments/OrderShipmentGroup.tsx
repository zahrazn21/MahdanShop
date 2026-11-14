"use client";

import { AdminShipment } from "@/src/shared/hooks/useAdminShipments";

import { ShipmentCard } from "./ShipmentCard";
import { formatPrice } from "@/src/shared/lib/format";

export function OrderShipmentGroup({
  order,
  orderId,
  shipments,
  expandedShipment,
  onToggleShipment,
  onRefresh,
}: {
  order: AdminShipment["order"];
  orderId: string;
  shipments: AdminShipment[];
  expandedShipment: string | null;
  onToggleShipment: (id: string) => void;
  onRefresh: () => void;
}) {
  const hasDomestic = shipments.some((s) => s.shipmentType === "DOMESTIC");
  const hasImported = shipments.some((s) => s.shipmentType === "IMPORTED");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-black text-gray-800">سفارش #{orderId.slice(-8)}</h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-gray-500 shadow-sm">
                {shipments.length.toLocaleString("fa-IR")} مرسوله
              </span>
              {hasDomestic && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">داخلی</span>}
              {hasImported && <span className="rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-bold text-pink-600">وارداتی</span>}
            </div>
            <p className="mt-2 text-xs text-gray-400">مشتری: {order.user?.username ?? "کاربر حذف شده"}</p>
            {order.user?.email && <p className="mt-1 text-xs text-gray-400">{order.user.email}</p>}
          </div>

          <div className="flex items-center justify-between gap-5 lg:justify-end">
            <div>
              <p className="text-xs text-gray-400">مبلغ سفارش</p>
              <p className="mt-1 font-bold text-gray-800">{formatPrice(order.totalPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">وضعیت سفارش</p>
              <p className="mt-1 text-sm font-bold text-gray-700">{order.status}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3 md:p-4">
        {shipments.map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
            expanded={expandedShipment === shipment.id}
            onToggle={() => onToggleShipment(shipment.id)}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}
