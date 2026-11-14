"use client";

import { ChevronDown, ChevronUp, Package } from "lucide-react";

import { AdminShipment } from "@/src/shared/hooks/useAdminShipments";

import { ShipmentDetails } from "./ShipmentDetails";
import { getPendingPayment ,statusMap ,shipmentTypeMap, formatDate, freightStatusMap} from "@/src/shared/types/shipment-format";

export function ShipmentCard({
  shipment,
  expanded,
  onToggle,
  onRefresh,
}: {
  shipment: AdminShipment;
  expanded: boolean;
  onToggle: () => void;
  onRefresh: () => void;
}) {
  const status = statusMap[shipment.status];
  const StatusIcon = status.icon;
  const type = shipmentTypeMap[shipment.shipmentType];
  const pendingPayment = getPendingPayment(shipment);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <button type="button" onClick={onToggle} className="w-full p-4 text-right transition hover:bg-gray-50">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
              <Package size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800">مرسوله #{shipment.id.slice(-8)}</p>
              <p className="mt-1 text-xs text-gray-400">{shipment.shipmentType === "IMPORTED" ? "مرسوله وارداتی" : "مرسوله داخلی"}</p>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${type.className}`}>{type.label}</span>
              {shipment.batch && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">
                  دوره {shipment.batch.batchNumber.toLocaleString("fa-IR")}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">{formatDate(shipment.createdAt)}</p>
          </div>

          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}>
              <StatusIcon size={14} />
              {status.label}
            </span>
            {pendingPayment ? (
              <p className="mt-2 text-xs font-bold text-orange-600">رسید در انتظار بررسی</p>
            ) : shipment.shipmentType === "IMPORTED" ? (
              <p className="mt-2 text-xs text-gray-400">باربری: {freightStatusMap[shipment.freightPaymentStatus].label}</p>
            ) : null}
          </div>

          <div className="flex justify-end text-gray-400">{expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
        </div>
      </button>

      {expanded && <ShipmentDetails shipment={shipment} onRefresh={onRefresh} />}
    </div>
  );
}
