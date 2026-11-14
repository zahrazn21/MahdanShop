"use client";

import { useMemo, useState } from "react";
import { RefreshCw, Search, Truck } from "lucide-react";

import { AdminShipment, useAdminShipments } from "@/src/shared/hooks/useAdminShipments";
import { FilterButton, Stat } from "@/src/components/admin/shipments/shared";
import { OrderShipmentGroup } from "@/src/components/admin/shipments/OrderShipmentGroup";
import { FilterStatus } from "@/src/shared/types/shipment-format";


const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "ALL", label: "همه" },
  { key: "PENDING", label: "در انتظار" },
  { key: "WAITING_IMPORT", label: "تأمین" },
  { key: "WAITING_FOR_FREIGHT", label: "باربری" },
  { key: "READY_TO_SHIP", label: "آماده ارسال" },
  { key: "SHIPPED", label: "ارسال شده" },
  { key: "DELIVERED", label: "تحویل شده" },
];

export default function AdminShipmentsPage() {
  const { data, isLoading, error, refetch } = useAdminShipments();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);

  const shipments = data?.shipments ?? [];

  const filteredShipments = useMemo(() => {
    const value = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      if (filter !== "ALL" && shipment.status !== filter) return false;
      if (!value) return true;

      const username = shipment.order.user?.username?.toLowerCase() ?? "";
      const email = shipment.order.user?.email?.toLowerCase() ?? "";
      const orderId = shipment.orderId.toLowerCase();
      const tracking = shipment.trackingNumber?.toLowerCase() ?? "";
      const batch = shipment.batch?.batchNumber?.toString() ?? "";

      return (
        username.includes(value) ||
        email.includes(value) ||
        orderId.includes(value) ||
        tracking.includes(value) ||
        batch.includes(value)
      );
    });
  }, [shipments, search, filter]);

  const groupedOrders = useMemo(() => {
    const groups = new Map<string, { orderId: string; order: AdminShipment["order"]; shipments: AdminShipment[] }>();

    for (const shipment of filteredShipments) {
      const existing = groups.get(shipment.orderId);
      if (existing) existing.shipments.push(shipment);
      else groups.set(shipment.orderId, { orderId: shipment.orderId, order: shipment.order, shipments: [shipment] });
    }

    return Array.from(groups.values());
  }, [filteredShipments]);

  const counts = {
    pending: shipments.filter((s) => s.status === "PENDING").length,
    waitingImport: shipments.filter((s) => s.status === "WAITING_IMPORT").length,
    freight: shipments.filter((s) => s.status === "WAITING_FOR_FREIGHT").length,
    ready: shipments.filter((s) => s.status === "READY_TO_SHIP").length,
    shipped: shipments.filter((s) => s.status === "SHIPPED").length,
    delivered: shipments.filter((s) => s.status === "DELIVERED").length,
  };

  const toggleShipment = (id: string) => setExpandedShipment((prev) => (prev === id ? null : id));

  if (isLoading) {
    return (
      <div dir="rtl" className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          در حال دریافت مرسوله‌ها...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-red-700">خطا در دریافت مرسوله‌ها</h3>
            <p className="mt-1 text-sm text-red-500">{error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید."}</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm"
          >
            <RefreshCw size={16} />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
              <Truck size={23} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800">مدیریت مرسوله‌ها</h1>
              <p className="mt-1 text-sm text-gray-400">مدیریت ارسال، باربری و وضعیت مرسوله‌های سفارش‌ها</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            بروزرسانی
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="در انتظار" value={counts.pending} className="bg-yellow-50 text-yellow-700" />
          <Stat label="تأمین" value={counts.waitingImport} className="bg-orange-50 text-orange-700" />
          <Stat label="باربری" value={counts.freight} className="bg-blue-50 text-blue-700" />
          <Stat label="آماده ارسال" value={counts.ready} className="bg-purple-50 text-purple-700" />
          <Stat label="ارسال شده" value={counts.shipped} className="bg-indigo-50 text-indigo-700" />
          <Stat label="تحویل شده" value={counts.delivered} className="bg-green-50 text-green-700" />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی سفارش، مشتری، رهگیری یا دوره..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-10 pl-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <FilterButton key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </FilterButton>
            ))}
          </div>
        </div>
      </div>

      {groupedOrders.length === 0 ? (
        <div className="rounded-2xl bg-white p-14 text-center shadow-sm">
          <Truck className="mx-auto mb-4 h-14 w-14 text-gray-200" />
          <h3 className="font-bold text-gray-700">مرسوله‌ای پیدا نشد</h3>
          <p className="mt-2 text-sm text-gray-400">فیلتر یا عبارت جستجوی دیگری امتحان کنید.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedOrders.map((group) => (
            <OrderShipmentGroup
              key={group.orderId}
              order={group.order}
              orderId={group.orderId}
              shipments={group.shipments}
              expandedShipment={expandedShipment}
              onToggleShipment={toggleShipment}
              onRefresh={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}