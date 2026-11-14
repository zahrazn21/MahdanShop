import { CreditCard } from "lucide-react";
import type { OrderDetail, PaymentReviewStatus } from "@/src/shared/types/order";
import { formatPrice } from "@/src/shared/lib/format";
import { InfoRow } from "../ui/InfoRow";
import { PaymentBadge } from "../ui/PaymentBadge";

const REVIEW_BADGE: Record<PaymentReviewStatus, { text: string; cls: string }> = {
  PENDING: { text: "در انتظار بررسی ادمین", cls: "bg-blue-100 text-blue-700" },
  APPROVED: { text: "پرداخت تأیید شده", cls: "bg-green-100 text-green-700" },
  REJECTED: { text: "پرداخت رد شده", cls: "bg-red-100 text-red-700" },
};

const NO_RECEIPT_BADGE = {
  text: "در انتظار ارسال رسید",
  cls: "bg-yellow-100 text-yellow-700",
};

const SELLER_CARD_NUMBER = process.env.NEXT_PUBLIC_SELLER_CARD_NUMBER ?? "";
const SELLER_CARD_OWNER = process.env.NEXT_PUBLIC_SELLER_CARD_OWNER ?? "";

const formatCardNumber = (value: string) =>
  value.replace(/(.{4})/g, "$1 ").trim();

interface Props {
  order: OrderDetail;
  trackingNumber?: string | null;
}

export function PaymentInfoCard({ order, trackingNumber }: Props) {
  const payment = order.payment;
  const badge = !payment?.receiptImage
    ? NO_RECEIPT_BADGE
    : REVIEW_BADGE[payment.status];

  const showSellerCard =
    !payment?.receiptImage && SELLER_CARD_NUMBER;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center">
            <CreditCard className="text-pink-500" size={22} />
          </div>
          <div>
            <h2 className="font-bold text-lg">پرداخت سفارش</h2>
            <p className="text-xs text-gray-400 mt-1">
              پرداخت مربوط به مبلغ محصولات سفارش
            </p>
          </div>
        </div>
        <span className="text-xs font-bold rounded-full bg-gray-100 text-gray-600 px-3 py-1.5">
          کارت‌به‌کارت
        </span>
      </div>

      {showSellerCard && (
        <div className="mb-5 rounded-2xl bg-pink-50 border border-pink-100 p-4">
          <p className="text-xs text-gray-500 mb-2">
            لطفاً مبلغ سفارش را به شماره کارت زیر واریز کرده و رسید آن را ارسال کنید:
          </p>
          <p className="text-lg font-bold tracking-wider text-pink-700 text-center">
            {formatCardNumber(SELLER_CARD_NUMBER)}
          </p>
          {SELLER_CARD_OWNER && (
            <p className="text-sm text-gray-600 text-center mt-1">
              به نام {SELLER_CARD_OWNER}
            </p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <InfoRow label="مبلغ پرداختی" value={formatPrice(order.totalPrice)} />

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs text-gray-400 mb-2">وضعیت پرداخت</p>
          <PaymentBadge text={badge.text} className={badge.cls} />
        </div>

        {payment?.payerName && (
          <InfoRow label="نام پرداخت‌کننده" value={payment.payerName} />
        )}
        {payment?.payerCardLast4 && (
          <InfoRow label="چهار رقم آخر کارت" value={payment.payerCardLast4} />
        )}
        {trackingNumber && (
          <InfoRow label="کد رهگیری ارسال" value={trackingNumber} />
        )}
      </div>
    </div>
  );
}