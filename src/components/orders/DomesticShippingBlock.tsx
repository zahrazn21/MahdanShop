import type { DomesticKind } from "@/src/shared/lib/domesticShipping";
import { Truck } from "lucide-react";
import Link from "next/link";

const CONFIG = {
  DEFERRED_PAID: {
    title: "پرداخت شده",
    tone: "green",
    text: "هزینه ارسال داخلی این سفارش پرداخت و توسط مدیریت تأیید شده است.",
  },
  DEFERRED_UNKNOWN: {
    title: "در حال بررسی",
    tone: "gray",
    text: "وضعیت هزینه ارسال داخلی هنوز مشخص نشده است.",
  },
  DEFERRED_DEBT: {
    title: "پرداخت ارسال در آینده",
    tone: "amber",
    text: "هزینه ارسال داخلی فعلاً پرداخت نمی‌شود. این سفارش بعداً در بخش بدهی‌های ارسال قرار می‌گیرد و در صورت انتخاب شما، هزینه ارسال آن با سایر سفارش‌های داخلی قابل تجمیع و محاسبه خواهد بود.",
  },
} as const;

const TONE = {
  green: {
    text: "text-green-600",
    box: "bg-green-50 border-green-200",
  },

  amber: {
    text: "text-amber-600",
    box: "bg-amber-50 border-amber-200",
  },

  gray: {
    text: "text-gray-500",
    box: "bg-gray-50 border-gray-200",
  },
} as const;

type DeferredDomesticKind = Exclude<DomesticKind, "IMMEDIATE" | "NOT_REQUIRED">;

interface Props {
  kind: DeferredDomesticKind;
  variant: "card" | "row";
}

export function DomesticShippingBlock({ kind, variant }: Props) {
  const c = CONFIG[kind];
  const t = TONE[c.tone];

  if (variant === "card") {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex gap-2 items-center text-gray-500">
          <Truck size={20} />

          <span>هزینه ارسال داخلی</span>
        </div>

        <p className={`text-lg font-bold mt-3 ${t.text}`}>{c.title}</p>

        <p className="text-xs text-gray-400 mt-2 leading-6">{c.text}</p>

        {kind === "DEFERRED_DEBT" && (
          <Link
            href="/profile/shipping-debts"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
          >
            مشاهده و پرداخت بدهی ارسال
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-4 ${t.box}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold">هزینه ارسال داخلی</p>

        <span className={`text-xs font-bold ${t.text}`}>{c.title}</span>
      </div>

      <p className="text-xs mt-3 leading-6 text-gray-600">{c.text}</p>

      {kind === "DEFERRED_DEBT" && (
        <Link
          href="/profile/shipping-debts"
          className="mt-3 inline-flex items-center text-sm font-bold text-amber-700 hover:text-amber-800"
        >
          مشاهده بدهی‌های ارسال
        </Link>
      )}
    </div>
  );
}
