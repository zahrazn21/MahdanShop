"use client";

import { useState } from "react";
import { CheckCircle, Clock, CreditCard, Eye, MapPin, Package, Truck, Weight } from "lucide-react";
import Image from "next/image";

import { AdminShipment, ShipmentStatus } from "@/src/shared/hooks/useAdminShipments";

import { formatDate, formatPrice, formatWeight, freightStatusMap, getPendingPayment, statusMap } from  "@/src/shared/types/shipment-format";
import { ActionButton, InfoCard, InfoRow, ReceiptModal, SectionTitle } from "./shared";
import { ShipmentFreightForm } from "./ShipmentFreightForm";
import { ShipmentPayments } from "./ShipmentPayments";

export function ShipmentDetails({ shipment, onRefresh }: { shipment: AdminShipment; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<{ image: string; title: string } | null>(null);

  const status = statusMap[shipment.status];
  const freight = freightStatusMap[shipment.freightPaymentStatus];
  const pendingPayment = getPendingPayment(shipment);

  const isDomestic = shipment.shipmentType === "DOMESTIC";
  const isImported = shipment.shipmentType === "IMPORTED";

  const domesticShippingUnpaid =
    shipment.shippingPaymentStatus === "AWAITING_USER_PAYMENT" ||
    shipment.shippingPaymentStatus === "EXPIRED" ||
    (shipment.shippingCost !== null && shipment.shippingCost > 0 && shipment.shippingPaymentStatus !== "PAID");

  const importedFreightPaid = shipment.freightPaymentStatus === "PAID";

  const canPrepareDomestic = isDomestic && !domesticShippingUnpaid;
  const canPrepareImported = isImported && importedFreightPaid;
  const canPrepareToShip = canPrepareDomestic || canPrepareImported;
  const canShip = canPrepareToShip && shipment.status === "READY_TO_SHIP";

  const blockedMessage = isDomestic
    ? "هزینه ارسال این مرسوله هنوز پرداخت و تأیید نشده است. تا پرداخت هزینه ارسال، امکان ارسال مرسوله وجود ندارد."
    : "هزینه باربری این مرسوله هنوز پرداخت و تأیید نشده است. تا پرداخت هزینه باربری، امکان ارسال مرسوله وجود ندارد.";

  const changeStatus = async (nextStatus: ShipmentStatus, trackingNumber?: string) => {
    if ((nextStatus === "READY_TO_SHIP" || nextStatus === "SHIPPED") && !canPrepareToShip) {
      alert(blockedMessage);
      return;
    }
    if (nextStatus === "SHIPPED" && !trackingNumber?.trim()) {
      alert("برای ارسال مرسوله، کد رهگیری الزامی است.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/admin/orders/${shipment.orderId}/shipments/${shipment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, ...(trackingNumber ? { trackingNumber: trackingNumber.trim() } : {}) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "خطا در تغییر وضعیت");

      await onRefresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در تغییر وضعیت مرسوله");
    } finally {
      setLoading(false);
    }
  };

  const handleShip = () => {
    if (!canShip) {
      alert(blockedMessage);
      return;
    }
    const tracking = window.prompt("کد رهگیری مرسوله را وارد کنید:");
    if (!tracking?.trim()) return;
    changeStatus("SHIPPED", tracking.trim());
  };

  const insufficientPayment =
    ((shipment.shipmentType === "DOMESTIC" &&
      shipment.shippingPaymentStatus !== "PAID" &&
      shipment.shippingCost !== null &&
      shipment.shippingCost > 0) ||
      (shipment.shipmentType === "IMPORTED" && shipment.freightPaymentStatus !== "PAID")) &&
    (shipment.status === "PENDING" || shipment.status === "READY_TO_SHIP" || shipment.status === "WAITING_FOR_FREIGHT");

  return (
    <div className="border-t border-gray-100 bg-gray-50 p-4 md:p-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard icon={<Package size={18} />} title="اطلاعات مرسوله">
          <InfoRow label="شناسه سفارش" value={`#${shipment.orderId.slice(-8)}`} />
          <InfoRow label="شناسه مرسوله" value={`#${shipment.id.slice(-8)}`} />
          <InfoRow label="نوع" value={shipment.shipmentType === "IMPORTED" ? "وارداتی" : "داخلی"} />
          <InfoRow
            label="وضعیت"
            value={<span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>}
          />
          {shipment.batch && <InfoRow label="دوره" value={`دوره ${shipment.batch.batchNumber.toLocaleString("fa-IR")}`} />}
          <InfoRow label="تاریخ ثبت" value={formatDate(shipment.createdAt)} />
        </InfoCard>

        <InfoCard icon={<MapPin size={18} />} title="مشتری">
          <InfoRow label="نام کاربری" value={shipment.order.user?.username ?? "-"} />
          <InfoRow label="ایمیل" value={shipment.order.user?.email ?? "-"} />
          <InfoRow label="مبلغ سفارش" value={formatPrice(shipment.order.totalPrice)} />
          <InfoRow label="وضعیت سفارش" value={shipment.order.status} />
        </InfoCard>

        <InfoCard icon={<Weight size={18} />} title="اطلاعات باربری">
          <InfoRow label="وزن واقعی" value={formatWeight(shipment.actualWeightGram)} />
          <InfoRow
            label="نرخ باربری"
            value={shipment.freightRateYuan ? `${shipment.freightRateYuan.toLocaleString("fa-IR")} یوان/کیلو` : "-"}
          />
          <InfoRow
            label="نرخ یوان"
            value={shipment.yuanExchangeRate ? `${shipment.yuanExchangeRate.toLocaleString("fa-IR")} تومان` : "-"}
          />
          <InfoRow label="هزینه باربری" value={shipment.freightCostToman ? formatPrice(shipment.freightCostToman) : "-"} />
          <InfoRow
            label="پرداخت باربری"
            value={
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${freight.className}`}>
                {pendingPayment ? "رسید در انتظار بررسی" : freight.label}
              </span>
            }
          />
        </InfoCard>

        <ShipmentFreightForm shipment={shipment} onRefresh={onRefresh} />
      </div>

      <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
        <SectionTitle icon={<Package size={18} />} title={`محصولات این مرسوله (${shipment.items.length.toLocaleString("fa-IR")})`} />
        <div className="space-y-2">
          {shipment.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-xl bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {item.orderItem.image ? (
                  <Image
                    width={500}
                    height={500}
                    src={item.orderItem.image}
                    alt={item.orderItem.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200">
                    <Package size={18} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">{item.orderItem.name}</p>
                  <p className="mt-1 text-xs text-gray-400">تعداد: {item.quantity.toLocaleString("fa-IR")}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                    {item.orderItem.selectedColor && <span>رنگ: {item.orderItem.selectedColor}</span>}
                    {item.orderItem.selectedSize && <span>سایز: {item.orderItem.selectedSize}</span>}
                    {item.orderItem.variantName && <span>مدل: {item.orderItem.variantName}</span>}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">{formatPrice(item.orderItem.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
        <SectionTitle icon={<Truck size={18} />} title="اطلاعات ارسال" />
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow label="کد رهگیری" value={shipment.trackingNumber ?? "ثبت نشده"} />
          <InfoRow label="زمان ارسال" value={shipment.shippedAt ? formatDate(shipment.shippedAt) : "-"} />
          <InfoRow label="زمان تحویل" value={shipment.deliveredAt ? formatDate(shipment.deliveredAt) : "-"} />
          <InfoRow
            label="تحویل تقریبی"
            value={shipment.estimatedDeliveryDays ? `${shipment.estimatedDeliveryDays.toLocaleString("fa-IR")} روز` : "-"}
          />
        </div>
      </section>

      <ShipmentPayments shipment={shipment} onOpenReceipt={(image, title) => setReceipt({ image, title })} onRefresh={onRefresh} />

      {shipment.freightReceiptImage && shipment.shippingPayments.length === 0 && (
        <section className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-blue-500" />
              <div>
                <p className="font-bold text-gray-800">رسید پرداخت باربری</p>
                <p className="mt-1 text-xs text-gray-400">رسید قدیمی ذخیره‌شده روی مرسوله</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReceipt({ image: shipment.freightReceiptImage!, title: "رسید پرداخت باربری" })}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm"
            >
              <Eye size={16} />
              مشاهده رسید
            </button>
          </div>
        </section>
      )}

      {insufficientPayment && (
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CreditCard size={19} />
            </div>
            <div>
              <p className="font-black text-orange-800">این مرسوله هنوز قابل ارسال نیست</p>
              <p className="mt-1 text-sm leading-6 text-orange-700">
                {shipment.shipmentType === "DOMESTIC"
                  ? "هزینه ارسال داخلی هنوز پرداخت و تأیید نشده است. تا زمان پرداخت، امکان آماده‌سازی و ارسال مرسوله وجود ندارد."
                  : "هزینه باربری این مرسوله هنوز پرداخت و تأیید نشده است. تا زمان پرداخت، امکان آماده‌سازی و ارسال مرسوله وجود ندارد."}
              </p>
              <div className="mt-2 text-xs font-bold text-orange-600">
                وضعیت پرداخت:{" "}
                {shipment.shipmentType === "DOMESTIC"
                  ? shipment.shippingPaymentStatus === "AWAITING_USER_PAYMENT"
                    ? "در انتظار پرداخت مشتری"
                    : shipment.shippingPaymentStatus === "EXPIRED"
                    ? "پرداخت منقضی شده"
                    : "پرداخت نشده"
                  : shipment.freightPaymentStatus === "AWAITING_USER_PAYMENT"
                  ? "در انتظار پرداخت مشتری"
                  : "پرداخت نشده"}
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
        <SectionTitle icon={<Truck size={18} />} title="عملیات مرسوله" />
        <div className="flex flex-wrap gap-2">
          {shipment.status === "PENDING" &&
            (shipment.shipmentType === "IMPORTED" ? (
              <ActionButton disabled={loading} onClick={() => changeStatus("WAITING_IMPORT")} className="bg-purple-500 hover:bg-purple-600">
                <Package size={16} />
                ارسال برای تأمین
              </ActionButton>
            ) : canPrepareDomestic ? (
              <ActionButton disabled={loading} onClick={() => changeStatus("READY_TO_SHIP")} className="bg-purple-500 hover:bg-purple-600">
                <Package size={16} />
                آماده ارسال
              </ActionButton>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700">
                <CreditCard size={16} />
                هزینه ارسال هنوز پرداخت نشده است
              </div>
            ))}

          {shipment.status === "WAITING_IMPORT" && (
            <ActionButton disabled={loading} onClick={() => changeStatus("WAITING_FOR_FREIGHT")} className="bg-blue-500 hover:bg-blue-600">
              <Weight size={16} />
              رسیدن بار و محاسبه باربری
            </ActionButton>
          )}

          {shipment.status === "WAITING_FOR_FREIGHT" &&
            shipment.shipmentType === "IMPORTED" &&
            (shipment.freightPaymentStatus === "PAID" ? (
              <ActionButton disabled={loading} onClick={() => changeStatus("READY_TO_SHIP")} className="bg-purple-500 hover:bg-purple-600">
                <CheckCircle size={16} />
                آماده ارسال
              </ActionButton>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700">
                <CreditCard size={16} />
                هزینه باربری هنوز پرداخت و تأیید نشده است
              </div>
            ))}

          {shipment.status === "READY_TO_SHIP" && (
            <ActionButton disabled={loading} onClick={handleShip} className="bg-indigo-500 hover:bg-indigo-600">
              <Truck size={16} />
              ارسال مرسوله
            </ActionButton>
          )}

          {shipment.status === "SHIPPED" && (
            <ActionButton disabled={loading} onClick={() => changeStatus("DELIVERED")} className="bg-green-500 hover:bg-green-600">
              <CheckCircle size={16} />
              تحویل داده شد
            </ActionButton>
          )}

          {loading && (
            <div className="flex items-center gap-2 px-3 text-sm text-gray-400">
              <Clock size={16} className="animate-pulse" />
              در حال بروزرسانی...
            </div>
          )}
        </div>
      </section>

      {receipt && <ReceiptModal image={receipt.image} title={receipt.title} onClose={() => setReceipt(null)} />}
    </div>
  );
}
