"use client";

import { useState } from "react";
import { CheckCircle, CreditCard, Eye, XCircle } from "lucide-react";

import { AdminShipment } from "@/src/shared/hooks/useAdminShipments";

import { formatPrice } from  "@/src/shared/types/shipment-format";
import { ActionButton, SectionTitle } from "./shared";

export function ShipmentPayments({
  shipment,
  onOpenReceipt,
  onRefresh,
}: {
  shipment: AdminShipment;
  onOpenReceipt: (image: string, title: string) => void;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  if (shipment.shippingPayments.length === 0) {
    return null;
  }

  const review = async (payment: (typeof shipment.shippingPayments)[number], action: "APPROVE" | "REJECT") => {
    if (!payment.receiptGroupId) {
      alert("شناسه گروه رسید این پرداخت پیدا نشد.");
      return;
    }

    let rejectionReason = "";

    if (action === "REJECT") {
      const reason = window.prompt("دلیل رد رسید را وارد کنید:");
      if (!reason?.trim()) return;
      rejectionReason = reason.trim();
    }

    if (action === "APPROVE" && !window.confirm("آیا از تأیید این رسید اطمینان دارید؟")) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/admin/shipping-debts/${payment.receiptGroupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...(action === "REJECT" ? { rejectionReason } : {}) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "خطا در بررسی رسید");

      await onRefresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در بررسی رسید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <SectionTitle icon={<CreditCard size={18} />} title="پرداخت‌های مرسوله" />

      <div className="space-y-3">
        {shipment.shippingPayments.map((payment) => {
          const pending = payment.status === "PENDING" && !!payment.receiptImage;

          return (
            <div key={payment.id} className="rounded-xl bg-white p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-bold text-gray-800">
                    {shipment.shipmentType === "IMPORTED" ? "رسید پرداخت باربری" : "رسید پرداخت هزینه ارسال"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>مبلغ: {formatPrice(payment.amount)}</span>
                    {payment.payerName && <span>پرداخت‌کننده: {payment.payerName}</span>}
                    {payment.payerCardLast4 && <span>کارت: ****{payment.payerCardLast4}</span>}
                  </div>

                  <div className="mt-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        payment.status === "PENDING"
                          ? "bg-orange-100 text-orange-700"
                          : payment.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {payment.status === "PENDING" ? "در انتظار بررسی" : payment.status === "APPROVED" ? "تأیید شده" : "رد شده"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {payment.receiptImage && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenReceipt(
                          payment.receiptImage!,
                          shipment.shipmentType === "IMPORTED" ? "رسید پرداخت باربری" : "رسید پرداخت هزینه ارسال",
                        )
                      }
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      مشاهده رسید
                    </button>
                  )}

                  {pending && (
                    <>
                      <ActionButton disabled={loading} onClick={() => review(payment, "APPROVE")} className="bg-green-500 hover:bg-green-600">
                        <CheckCircle size={16} />
                        تأیید
                      </ActionButton>
                      <ActionButton disabled={loading} onClick={() => review(payment, "REJECT")} className="bg-red-500 hover:bg-red-600">
                        <XCircle size={16} />
                        رد رسید
                      </ActionButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
