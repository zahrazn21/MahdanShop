"use client";

import { useState } from "react";
import Image from "next/image";

import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Eye,
  Package,
  Receipt,
  Truck,
  XCircle,
} from "lucide-react";

import type { AdminShipment } from "@/src/shared/hooks/useAdminShipments";

import { ActionButton, MiniInfo, StatusBadge } from "./components";

import { formatPrice } from "./utils";
import Link from "next/link";

export default function FreightSection({
  orderId,
  shipment,
  onRefresh,
}: {
  orderId: string;
  shipment: AdminShipment;
  onRefresh: () => void;
}) {
  const [freightWeight, setFreightWeight] = useState("");
  const [freightRateYuan, setFreightRateYuan] = useState("");
  const [yuanExchangeRate, setYuanExchangeRate] = useState("");
  const [freightCostToman, setFreightCostToman] = useState("");

  const [savingFreight, setSavingFreight] = useState(false);

  const [freightReceiptOpen, setFreightReceiptOpen] = useState(false);

  const [selectedFreightReceipt, setSelectedFreightReceipt] = useState<
    string | null
  >(null);

  const [reviewingFreight, setReviewingFreight] = useState(false);

  const saveFreight = async () => {
    if (!freightCostToman.trim()) {
      alert("هزینه نهایی باربری را وارد کنید");
      return;
    }

    try {
      setSavingFreight(true);

      const res = await fetch(
        `/api/admin/orders/${orderId}/shipments/${shipment.id}/freight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            freightCostToman: Number(freightCostToman),

            ...(freightWeight.trim()
              ? {
                  actualWeightGram: Number(freightWeight),
                }
              : {}),

            ...(freightRateYuan.trim()
              ? {
                  freightRateYuan: Number(freightRateYuan),
                }
              : {}),

            ...(yuanExchangeRate.trim()
              ? {
                  yuanExchangeRate: Number(yuanExchangeRate),
                }
              : {}),
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "خطا در ثبت هزینه باربری");
      }

      setFreightWeight("");
      setFreightRateYuan("");
      setYuanExchangeRate("");
      setFreightCostToman("");

      await onRefresh();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "خطا در ثبت هزینه باربری");
    } finally {
      setSavingFreight(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500">
            <Truck className="h-5 w-5" />
          </div>

          <div>
            <h4 className="font-bold text-gray-800">باربری وارداتی</h4>

            <p className="mt-1 text-xs leading-6 text-gray-500">
              هزینه باربری پس از مشخص شدن وزن واقعی تعیین می‌شود.
            </p>
          </div>
        </div>

        <StatusBadge
          label={
            shipment.freightPaymentStatus === "PAID"
              ? "پرداخت شده"
              : shipment.freightPaymentStatus === "AWAITING_USER_PAYMENT"
                ? "در انتظار پرداخت مشتری"
                : shipment.freightPaymentStatus === "PENDING"
                  ? shipment.freightCostToman
                    ? "در انتظار بررسی رسید"
                    : "هزینه هنوز مشخص نشده"
                  : "نامشخص"
          }
          className={
            shipment.freightPaymentStatus === "PAID"
              ? "bg-green-50 text-green-700 border-green-200"
              : shipment.freightPaymentStatus === "AWAITING_USER_PAYMENT"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : shipment.freightPaymentStatus === "PENDING"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
          }
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniInfo
          icon={<Package className="h-4 w-4" />}
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
          icon={<CreditCard className="h-4 w-4" />}
          label="نرخ باربری"
          value={
            shipment.freightRateYuan
              ? `${Number(shipment.freightRateYuan).toLocaleString(
                  "fa-IR",
                )} یوان`
              : "ثبت نشده"
          }
        />

        <MiniInfo
          icon={<CreditCard className="h-4 w-4" />}
          label="نرخ یوان"
          value={
            shipment.yuanExchangeRate
              ? formatPrice(Number(shipment.yuanExchangeRate))
              : "ثبت نشده"
          }
        />

        <MiniInfo
          icon={<CreditCard className="h-4 w-4" />}
          label="هزینه نهایی باربری"
          value={
            shipment.freightCostToman
              ? formatPrice(shipment.freightCostToman)
              : "مشخص نشده"
          }
        />
      </div>

      {shipment.status === "WAITING_FOR_FREIGHT" &&
        shipment.freightPaymentStatus !== "PAID" && (
          <div className="mt-4 rounded-xl border border-orange-200 bg-white p-4">
            <div className="mb-4">
              <h5 className="font-bold text-gray-800">تعیین هزینه باربری</h5>

              <p className="mt-1 text-xs text-gray-400">
                پس از ثبت مبلغ، کاربر می‌تواند هزینه باربری را پرداخت و رسید
                ارسال کند.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input
                type="number"
                placeholder="وزن واقعی (گرم)"
                value={freightWeight}
                onChange={(event) => setFreightWeight(event.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
              />

              <input
                type="number"
                placeholder="نرخ باربری (یوان)"
                value={freightRateYuan}
                onChange={(event) => setFreightRateYuan(event.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
              />

              <input
                type="number"
                placeholder="نرخ یوان به تومان"
                value={yuanExchangeRate}
                onChange={(event) => setYuanExchangeRate(event.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
              />

              <input
                type="number"
                placeholder="هزینه نهایی (تومان)"
                value={freightCostToman}
                onChange={(event) => setFreightCostToman(event.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-bold outline-none focus:border-orange-400"
              />
            </div>

            <div className="mt-3 flex justify-end">
              <ActionButton
                onClick={saveFreight}
                disabled={savingFreight}
                className="bg-orange-500 hover:bg-orange-600"
                icon={<CreditCard className="h-4 w-4" />}
              >
                {savingFreight ? "در حال ثبت..." : "ثبت هزینه و اعلام به مشتری"}
              </ActionButton>
            </div>
          </div>
        )}

      {shipment.freightReceiptImage && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-blue-500" />

              <div>
                <p className="font-bold text-gray-800">رسید باربری مشتری</p>

                <p className="mt-1 text-xs text-gray-500">
                  {shipment.freightPaymentStatus === "PENDING"
                    ? "در انتظار بررسی ادمین"
                    : "رسید ثبت شده"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setFreightReceiptOpen(true);
                  setSelectedFreightReceipt(
                    shipment.freightReceiptImage ?? null,
                  );
                }}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-600 shadow-sm hover:bg-blue-100"
              >
                <Eye className="h-4 w-4" />
                مشاهده رسید
              </button>
              {shipment.freightReceiptImage && (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <Receipt className="h-5 w-5 text-blue-500" />

                      <div>
                        <p className="font-bold text-gray-800">
                          رسید باربری مشتری
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {shipment.freightPaymentStatus === "PENDING"
                            ? "در انتظار بررسی ادمین"
                            : "رسید ثبت شده"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFreightReceiptOpen(true);
                          setSelectedFreightReceipt(
                            shipment.freightReceiptImage ?? null,
                          );
                        }}
                        className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-600 shadow-sm hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                        مشاهده رسید
                      </button>

                      {shipment.freightPaymentStatus === "PENDING" && (
                        <Link
                          href="/admin/shipping-debts"
                          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                          بررسی و تأیید در بدهی‌های ارسال
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {shipment.freightCostToman &&
        shipment.freightPaymentStatus !== "PAID" && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div>
              <p className="font-bold text-red-700">بدهی باربری مشتری</p>

              <p className="mt-1 text-sm leading-6 text-red-600">
                مبلغ <strong>{formatPrice(shipment.freightCostToman)}</strong>{" "}
                هنوز تسویه نشده است. تا زمان تأیید پرداخت، این مرسوله نباید
                ارسال شود.
              </p>
            </div>
          </div>
        )}

      {shipment.freightPaymentStatus === "PAID" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          <CheckCircle className="h-5 w-5" />
          هزینه باربری این مرسوله تسویه و تأیید شده است.
        </div>
      )}

      {freightReceiptOpen && selectedFreightReceipt && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => {
            setFreightReceiptOpen(false);
            setSelectedFreightReceipt(null);
          }}
        >
          <div
            className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setFreightReceiptOpen(false);
                setSelectedFreightReceipt(null);
              }}
              className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <XCircle className="h-5 w-5" />
            </button>

            <Image
              src={selectedFreightReceipt}
              alt="رسید پرداخت باربری وارداتی"
              width={1200}
              height={1600}
              className="max-h-[88vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
