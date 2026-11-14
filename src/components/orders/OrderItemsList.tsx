import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  CreditCard,
  Plane,
  Box,
} from "lucide-react";

import type {
  OrderItem,
  OrderShipment,
  ShipmentStatus,
} from "@/src/shared/types/order";

import { formatNumber, formatPrice } from "@/src/shared/lib/format";
import Link from "next/link";

interface Props {
  items: OrderItem[];
  shipments: OrderShipment[];
}

const shipmentStatusMap: Record<
  ShipmentStatus,
  {
    text: string;
    className: string;
    icon: typeof Clock;
  }
> = {
  PENDING: {
    text: "در انتظار آماده‌سازی",
    className: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },

  WAITING_IMPORT: {
    text: "در انتظار تأمین",
    className: "bg-orange-100 text-orange-700",
    icon: Plane,
  },

  WAITING_FOR_FREIGHT: {
    text: "در انتظار باربری",
    className: "bg-blue-100 text-blue-700",
    icon: CreditCard,
  },

  READY_TO_SHIP: {
    text: "آماده ارسال",
    className: "bg-purple-100 text-purple-700",
    icon: Box,
  },

  SHIPPED: {
    text: "ارسال شده",
    className: "bg-indigo-100 text-indigo-700",
    icon: Truck,
  },

  DELIVERED: {
    text: "تحویل داده شده",
    className: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
};

function getShipmentForItem(
  itemId: string,
  shipments: OrderShipment[],
) {
  return shipments.find((shipment) =>
    shipment.items.some(
      (shipmentItem) =>
        shipmentItem.orderItemId === itemId,
    ),
  );
}
function ShippingStatus({
  shipment,
}: {
  shipment: OrderShipment | undefined;
}) {
  if (!shipment) {
    return (
      <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500">
        مرسوله هنوز ثبت نشده است
      </div>
    );
  }

  const status = shipmentStatusMap[shipment.status];
  const StatusIcon = status.icon;

  return (
    <div className="space-y-2">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
      >
        <StatusIcon size={14} />
        {status.text}
      </div>

      {shipment.status === "SHIPPED" &&
        shipment.trackingNumber && (
          <div className="rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
            <span className="font-bold">کد رهگیری:</span>{" "}
            {shipment.trackingNumber}
          </div>
        )}

      {shipment.status === "DELIVERED" &&
        shipment.trackingNumber && (
          <div className="rounded-xl bg-green-50 px-3 py-2 text-xs text-green-700">
            <span className="font-bold">کد رهگیری:</span>{" "}
            {shipment.trackingNumber}
          </div>
        )}
    </div>
  );
}
function ShipmentDebtsBanner({
  shipments,
}: {
  shipments: OrderShipment[];
}) {
  const debtShipments = shipments.filter((shipment) => {
    const shippingPaymentRequired =
      shipment.shipmentType === "DOMESTIC" &&
      (shipment.shippingCost ?? 0) > 0;

    const shippingNotPaid =
      shippingPaymentRequired &&
      shipment.shippingPaymentStatus !== "PAID";

    const freightRequired =
      shipment.shipmentType === "IMPORTED" &&
      (shipment.freightCostToman ?? 0) > 0;

    const freightNotPaid =
      freightRequired && shipment.freightPaymentStatus !== "PAID";

    return shippingNotPaid || freightNotPaid;
  });

  if (debtShipments.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {debtShipments.map((shipment) => {
        const isFreight = shipment.shipmentType === "IMPORTED";

        return (
          <div
            key={shipment.id}
            className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-bold leading-5 text-orange-700"
          >
            <p>
              {isFreight
                ? "هزینه باربری این مرسوله هنوز پرداخت و تأیید نشده است."
                : "هزینه ارسال این مرسوله هنوز پرداخت و تأیید نشده است."}
            </p>

            <Link
              href="/profile/shipping-debts"
              className="mt-2 inline-flex items-center gap-1 text-orange-800 underline underline-offset-2 hover:text-orange-900"
            >
              {isFreight
                ? "پرداخت هزینه باربری از اینجا"
                : "پرداخت هزینه ارسال از اینجا"}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
export function OrderItemsList({
  items,
  shipments,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
        <Package className="text-pink-500" />
        محصولات سفارش
      </h2>
      
      <ShipmentDebtsBanner shipments={shipments} />

      <div className="space-y-4">
        {items.map((item) => {
          const shipment = getShipmentForItem(
            item.id,
            shipments,
          );

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={
                      item.image ||
                      "/placeholder.png"
                    }
                    alt={item.name}
                    width={200}
                    height={200}
                    className="h-20 w-20 rounded-xl bg-gray-100 object-cover"
                  />

                  <div>
                    <p className="font-bold text-gray-800">
                      {item.name}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      تعداد:{" "}
                      {formatNumber(item.quantity)}
                    </p>

                    {item.selectedColor && (
                      <p className="mt-1 text-xs text-gray-400">
                        رنگ:{" "}
                        {item.selectedColor}
                      </p>
                    )}

                    {item.selectedSize && (
                      <p className="mt-1 text-xs text-gray-400">
                        سایز:{" "}
                        {item.selectedSize}
                      </p>
                    )}

                    {item.selectedNumber && (
                      <p className="mt-1 text-xs text-gray-400">
                        شماره:{" "}
                        {item.selectedNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:text-left">
                  <p className="font-bold text-pink-600">
                    {formatPrice(
                      item.price *
                        item.quantity,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    هر عدد{" "}
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>


              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Truck size={15} />
                  وضعیت ارسال محصول
                </div>

                <ShippingStatus
                  shipment={shipment}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}