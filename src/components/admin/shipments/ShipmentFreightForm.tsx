"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

import { AdminShipment } from "@/src/shared/hooks/useAdminShipments";

import { ActionButton, InputField } from "./shared";

export function ShipmentFreightForm({ shipment, onRefresh }: { shipment: AdminShipment; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"DIRECT" | "CALCULATED">("DIRECT");
  const [actualWeightGram, setActualWeightGram] = useState(shipment.actualWeightGram?.toString() ?? "");
  const [freightRateYuan, setFreightRateYuan] = useState(shipment.freightRateYuan?.toString() ?? "");
  const [yuanExchangeRate, setYuanExchangeRate] = useState(shipment.yuanExchangeRate?.toString() ?? "");
  const [freightCostToman, setFreightCostToman] = useState(shipment.freightCostToman?.toString() ?? "");
  const [loading, setLoading] = useState(false);

  if (shipment.status !== "WAITING_FOR_FREIGHT" || shipment.freightPaymentStatus !== "PENDING") {
    return null;
  }


  const register = async () => {
    const cost = Number(freightCostToman);
    if (!Number.isFinite(cost) || cost <= 0) {
      alert("هزینه باربری را به‌صورت صحیح وارد کنید.");
      return;
    }

    const weight = actualWeightGram ? Number(actualWeightGram) : undefined;
    const rate = freightRateYuan ? Number(freightRateYuan) : undefined;
    const exchangeRate = yuanExchangeRate ? Number(yuanExchangeRate) : undefined;

    if (weight !== undefined && (!Number.isFinite(weight) || weight <= 0)) {
      alert("وزن واقعی صحیح نیست.");
      return;
    }
    if (rate !== undefined && (!Number.isFinite(rate) || rate <= 0)) {
      alert("نرخ باربری صحیح نیست.");
      return;
    }
    if (exchangeRate !== undefined && (!Number.isFinite(exchangeRate) || exchangeRate <= 0)) {
      alert("نرخ یوان صحیح نیست.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/admin/orders/${shipment.orderId}/shipments/${shipment.id}/freight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freightCostToman: Math.round(cost),
          ...(weight !== undefined ? { actualWeightGram: Math.round(weight) } : {}),
          ...(rate !== undefined ? { freightRateYuan: rate } : {}),
          ...(exchangeRate !== undefined ? { yuanExchangeRate: Math.round(exchangeRate) } : {}),
        }),
      });

      const text = await response.text();
      let data: { error?: string; message?: string } | null = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(`پاسخ نامعتبر از سرور دریافت شد. وضعیت: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data?.error ?? data?.message ?? `خطا در ثبت هزینه باربری (${response.status})`);
      }

      setOpen(false);
      await onRefresh();
    } catch (error) {
      console.error("REGISTER FREIGHT ERROR:", error);
      alert(error instanceof Error ? error.message : "خطا در ثبت هزینه باربری");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-4 w-full rounded-2xl border border-orange-100 bg-orange-50 p-4 lg:max-w-3xl md:w-3xl">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-gray-800">ثبت هزینه باربری وارداتی</h3>
          <p className="mt-1 text-xs text-gray-500">
            می‌توانید مبلغ نهایی باربری را مستقیماً وارد کنید یا هزینه را بر اساس وزن و نرخ محاسبه کنید.
          </p>
        </div>

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-fit rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            ثبت هزینه باربری
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2">
              <button
                type="button"
                onClick={() => {
                  setMode("DIRECT");
                  setActualWeightGram("");
                  setFreightRateYuan("");
                  setYuanExchangeRate("");
                }}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  mode === "DIRECT" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                ورود مستقیم مبلغ
              </button>
              <button
                type="button"
                onClick={() => setMode("CALCULATED")}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  mode === "CALCULATED" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                محاسبه بر اساس وزن
              </button>
            </div>

            {mode === "DIRECT" && (
              <div className="rounded-xl bg-white p-4">
                <InputField
                  label="هزینه نهایی باربری (تومان)"
                  value={freightCostToman}
                  onChange={setFreightCostToman}
                  placeholder="مثلاً 350000"
                  type="number"
                />
                <p className="mt-2 text-xs text-gray-400">فقط مبلغ نهایی اعلام‌شده توسط شرکت باربری را وارد کنید.</p>
              </div>
            )}

            {mode === "CALCULATED" && (
              <div className="grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-2">
                <InputField label="وزن واقعی (گرم)" value={actualWeightGram} onChange={setActualWeightGram} placeholder="مثلاً 2500" type="number" />
                <InputField
                  label="نرخ باربری (یوان/کیلو)"
                  value={freightRateYuan}
                  onChange={setFreightRateYuan}
                  placeholder="مثلاً 8.5"
                  type="number"
                />
                <InputField
                  label="نرخ یوان (تومان)"
                  value={yuanExchangeRate}
                  onChange={setYuanExchangeRate}
                  placeholder="مثلاً 18500"
                  type="number"
                />
                <InputField
                  label="هزینه نهایی باربری (تومان)"
                  value={freightCostToman}
                  onChange={setFreightCostToman}
                  placeholder="مبلغ محاسبه‌شده"
                  type="number"
                />
                <p className="text-xs text-gray-400 sm:col-span-2">مبلغ نهایی را می‌توانید خودتان بررسی و اصلاح کنید.</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <ActionButton disabled={loading} onClick={register} className="bg-orange-500 hover:bg-orange-600">
                <CheckCircle size={16} />
                {loading ? "در حال ثبت..." : "ثبت هزینه و اعلام به مشتری"}
              </ActionButton>
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
              >
                انصراف
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
