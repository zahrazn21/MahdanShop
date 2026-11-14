import { CalendarDays, Clock, Hash, Package } from "lucide-react";
import type { OrderDetail } from "@/src/shared/types/order";
import { formatDateSafe } from "@/src/shared/lib/format";
import { InfoRow } from "../ui/InfoRow";
import { ORDER_STATUS } from "@/src/shared/lib/constants";

export function OrderHeader({ order }: { order: OrderDetail }) {
  const status = ORDER_STATUS[order.status];
  const needsUserPayment = order.shipments.some((s) => {
    const shippingDue =
      s.shipmentType === "DOMESTIC" &&
      (s.shippingCost ?? 0) > 0 &&
      s.shippingPaymentStatus !== "PAID";

    const freightDue =
      s.shipmentType === "IMPORTED" &&
      (s.freightCostToman ?? 0) > 0 &&
      s.freightPaymentStatus !== "PAID" &&
      s.freightPaymentStatus !== "PENDING";

    return shippingDue || freightDue;
  });
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center">
            <Package className="text-pink-500" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">جزئیات سفارش</h1>
            <p className="text-sm text-gray-400 mt-1">
              اطلاعات کامل سفارش و وضعیت پرداخت
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-5 py-2.5 rounded-full text-sm font-bold w-fit ${status.color}`}
          >
            {status.text}
          </div>

          {needsUserPayment && (
            <div className="px-5 py-2.5 rounded-full text-sm font-bold w-fit bg-red-100 text-red-700">
              نیازمند پرداخت شما
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <InfoRow
          label="شماره سفارش"
          value={order.id}
          icon={<Hash size={16} />}
        />
        <InfoRow
          label="تاریخ ثبت"
          value={formatDateSafe(order.createdAt, { dateStyle: "full" })}
          icon={<CalendarDays size={16} />}
        />
        <InfoRow
          label="ساعت ثبت"
          value={formatDateSafe(order.createdAt, {
            hour: "2-digit",
            minute: "2-digit",
          })}
          icon={<Clock size={16} />}
        />
      </div>
    </div>
  );
}
