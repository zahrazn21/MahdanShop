"use client";

import {
  CreditCard,
  MapPin,
  User,
} from "lucide-react";

import type { AdminOrder } from "@/src/shared/hooks/useAdminOrders";
import type { AdminShipment } from "@/src/shared/hooks/useAdminShipments";

import {
  InfoCard,
  InfoRow,
  PriceRow,
  StatusBadge,
} from "./components";

import { orderStatusMap, paymentStatusMap } from "./constants";
import { formatPrice } from "./utils";

import OrderItems from "./OrderItems";
import OrderShipments from "./OrderShipments";
import ShippingInfo from "./ShippingInfo";

export default function OrderDetails({
  order,
  onRefresh,
}: {
  order: AdminOrder;
  onRefresh: () => void;
}) {
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
    

  const shipments =
    (
      order as AdminOrder & {
        shipments?: AdminShipment[];
      }
    ).shipments ?? [];

  const domesticShipment = shipments.find(
    (shipment) => shipment.shipmentType === "DOMESTIC",
  );

  return (
    <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">

      <div className="grid gap-4 lg:grid-cols-3">

        <InfoCard
          icon={<User className="h-5 w-5" />}
          title="اطلاعات مشتری"
        >
          <InfoRow
            label="نام کاربری"
            value={order.user?.username ?? "کاربر حذف شده"}
          />

          <InfoRow
            label="ایمیل"
            value={order.user?.email ?? "-"}
          />

          <InfoRow
            label="وضعیت سفارش"
            value={
              <StatusBadge
                label={orderStatus.label}
                className={orderStatus.className}
              />
            }
          />
        </InfoCard>

        <InfoCard
          icon={<CreditCard className="h-5 w-5" />}
          title="خلاصه پرداخت"
        >
          <InfoRow
            label="روش پرداخت"
            value="کارت‌به‌کارت"
          />

          <InfoRow
            label="وضعیت پرداخت"
            value={
              <StatusBadge
                label={paymentStatus.label}
                className={paymentStatus.className}
              />
            }
          />

          <InfoRow
            label="مبلغ سفارش"
            value={formatPrice(order.totalPrice)}
          />

          <p className="mt-2 text-xs leading-5 text-gray-400">
            بررسی و تأیید رسید پرداخت از بخش «مدیریت پرداخت‌ها»
            انجام می‌شود.
          </p>
        </InfoCard>
        <InfoCard
          icon={<MapPin className="h-5 w-5" />}
          title="آدرس ارسال"
        >
          <ShippingInfo
            shippingInfo={order.shippingInfo}
          />
        </InfoCard>
      </div>
      <OrderItems order={order} />
      <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-pink-500">
            <CreditCard className="h-5 w-5" />
          </span>

          <h3 className="font-bold text-gray-800">
            خلاصه مبلغ سفارش
          </h3>
        </div>

        <div className="space-y-3 text-sm">
          <PriceRow
            label="مبلغ محصولات"
            value={formatPrice(order.subtotal)}
          />

          <PriceRow
            label="هزینه ارسال"
            value={formatPrice(
              domesticShipment?.shippingCost ?? 0,
            )}
          />

          {Number(order.discount ?? 0) > 0 && (
            <PriceRow
              label="تخفیف"
              value={`- ${formatPrice(order.discount)}`}
              className="text-green-600"
            />
          )}

          {Number(order.tax ?? 0) > 0 && (
            <PriceRow
              label="مالیات"
              value={formatPrice(order.tax)}
            />
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-base font-black">
            <span className="text-gray-800">
              مبلغ نهایی
            </span>

            <span className="text-pink-600">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>
      </section>
      <OrderShipments
        orderId={order.id}
        shipments={shipments}
        onRefresh={onRefresh}
      />
    </div>
  );
}
