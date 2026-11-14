"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatNumber, formatPrice } from "@/src/shared/lib/format";
import { ReceiptUploader } from "../ui/ReceiptUploader";

const SELLER_CARD_NUMBER = process.env.NEXT_PUBLIC_SELLER_CARD_NUMBER ?? "";
const SELLER_CARD_OWNER = process.env.NEXT_PUBLIC_SELLER_CARD_OWNER ?? "";

const formatCardNumber = (value: string) =>
  value.replace(/(.{4})/g, "$1 ").trim();

interface Props {
  selectedCount: number;
  total: number;
  isPending: boolean;
  onSubmit: (file: File, reset: () => void) => void;
}

export function PaymentBar({
  selectedCount,
  total,
  isPending,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);

return (
  <div dir="rtl">
    <div className="h-20 lg:hidden" aria-hidden />

    <div
      className="
        fixed inset-x-3 bottom-16 z-30
        rounded-2xl border border-pink-200 bg-white shadow-lg
        md:inset-x-6
        lg:static lg:inset-auto lg:z-auto lg:rounded-3xl
      "
    >
      <div className="flex items-center justify-between gap-3 p-3 lg:hidden">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800">مبلغ قابل پرداخت</p>
          <p className="mt-0.5 text-[11px] text-gray-500">
            {formatNumber(selectedCount)} مورد انتخاب شده
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-base font-black text-pink-600">
            {formatPrice(total)}
          </span>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-pink-600 transition active:scale-95"
            aria-label={open ? "بستن پرداخت" : "باز کردن پرداخت"}
          >
            {open ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-y-auto transition-all duration-300 lg:max-h-none lg:opacity-100 ${
          open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-3 p-3 pt-0 lg:space-y-4 lg:p-5">
          <div className="hidden lg:block">
            <p className="text-base font-bold">مبلغ قابل پرداخت</p>
            <p className="mt-1 text-xs text-gray-500">
              {formatNumber(selectedCount)} مورد انتخاب شده
            </p>
            <p className="mt-3 text-2xl font-black text-pink-600">
              {formatPrice(total)}
            </p>
          </div>

          {SELLER_CARD_NUMBER && (
            <div className="rounded-xl border border-pink-100 bg-pink-50 p-3 lg:rounded-2xl lg:p-4">
              <p className="mb-2 text-[11px] leading-5 text-gray-500 lg:text-xs">
                لطفاً مبلغ را به شماره کارت زیر واریز کرده و رسید آن را ارسال کنید:
              </p>

              <p
                dir="ltr"
                className="break-all text-center text-sm font-bold tracking-wider text-pink-700 lg:text-base"
              >
                {formatCardNumber(SELLER_CARD_NUMBER)}
              </p>

              {SELLER_CARD_OWNER && (
                <p className="mt-1 text-center text-xs text-gray-600 lg:text-sm">
                  به نام {SELLER_CARD_OWNER}
                </p>
              )}
            </div>
          )}

          <ReceiptUploader
            label="تصویر رسید پرداخت را انتخاب کنید"
            submitLabel={
              total > 0 ? `ثبت پرداخت (${formatPrice(total)})` : "ثبت پرداخت"
            }
            accent="pink"
            isPending={isPending}
            disabled={selectedCount === 0}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  </div>
);
}