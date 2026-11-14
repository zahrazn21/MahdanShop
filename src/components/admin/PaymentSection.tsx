"use client";

import { useState } from "react";
import Image from "next/image";

import {
  CheckCircle,
  Eye,
  Receipt,
  XCircle,
} from "lucide-react";

import type { AdminOrder } from "@/src/shared/hooks/useAdminOrders";

import { paymentStatusMap } from "./constants";

export default function PaymentSection({
  order,
  onRefresh,
}: {
  order: AdminOrder;
  onRefresh: () => void;
}) {
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const paymentStatus =
    paymentStatusMap[
      order.paymentStatus as keyof typeof paymentStatusMap
    ] ?? {
      label: order.paymentStatus,
      className: "bg-gray-50 text-gray-600 border-gray-200",
    };

  const approvePayment = async () => {
    if (approving || rejecting) return;

    try {
      setApproving(true);

      const res = await fetch(
        `/api/admin/orders/${order.id}/payment/approve`,
        {
          method: "POST",
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "خطا در تأیید پرداخت");
      }

      await onRefresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "خطا در تأیید پرداخت",
      );
    } finally {
      setApproving(false);
    }
  };

  const rejectPayment = async () => {
    if (approving || rejecting) return;

    const reason = window.prompt("دلیل رد پرداخت را وارد کنید:");

    if (!reason?.trim()) return;

    try {
      setRejecting(true);

      const res = await fetch(
        `/api/admin/orders/${order.id}/payment/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: reason.trim(),
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "خطا در رد پرداخت");
      }

      await onRefresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "خطا در رد پرداخت",
      );
    } finally {
      setRejecting(false);
    }
  };

  if (!order.payment?.receiptImage) {
    return null;
  }

  return (
    <>
      <section className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-500">
              <Receipt className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">رسید پرداخت</h3>

              <p className="mt-1 text-xs text-gray-500">
                رسید ارسال‌شده توسط مشتری
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setReceiptOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-100"
            >
              <Eye className="h-4 w-4" />
              مشاهده رسید
            </button>

            {order.paymentStatus === "REVIEW" && (
              <>
                <button
                  type="button"
                  onClick={approvePayment}
                  disabled={approving || rejecting}
                  className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />

                  {approving ? "در حال تأیید..." : "تأیید پرداخت"}
                </button>

                <button
                  type="button"
                  onClick={rejectPayment}
                  disabled={approving || rejecting}
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />

                  {rejecting ? "در حال رد..." : "رد پرداخت"}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {receiptOpen && order.payment.receiptImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setReceiptOpen(false)}
        >
          <div
            className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setReceiptOpen(false)}
              className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <Image
              src={order.payment.receiptImage}
              alt="رسید پرداخت"
              width={1200}
              height={1600}
              className="max-h-[88vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}