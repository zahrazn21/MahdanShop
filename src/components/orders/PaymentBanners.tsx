import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { ReceiptPreview } from "../ui/ReceiptPreview";
import { StatusBanner } from "../ui/StatusBanner";

export function PendingBanner({ receipt }: { receipt: string }) {
  return (
    <StatusBanner
      size="lg"
      tone="blue"
      icon={Clock}
      title="رسید پرداخت ارسال شد"
      description="رسید شما ثبت شده و در انتظار بررسی ادمین است. پس از تأیید، سفارش وارد مرحله آماده‌سازی خواهد شد."
      footer={<ReceiptPreview src={receipt} title="رسید پرداخت شما" />}
    />
  );
}

export function ApprovedBanner({ receipt }: { receipt: string | null }) {
  return (
    <StatusBanner
      size="lg"
      tone="green"
      icon={CheckCircle}
      title="پرداخت تأیید شد"
      description="پرداخت سفارش توسط مدیریت تأیید شده است."
      footer={receipt && <ReceiptPreview src={receipt} title="رسید پرداخت" />}
    />
  );
}

interface RejectedProps {
  reason: string | null;
  onRetry: () => void;
  loading: boolean;
}

export function RejectedBanner({ reason, onRetry, loading }: RejectedProps) {
  return (
    <StatusBanner
      size="lg"
      tone="red"
      icon={AlertCircle}
      title="پرداخت تأیید نشد"
      description="رسید پرداخت توسط مدیریت تأیید نشده است. می‌توانید رسید جدید ارسال کنید."
      footer={
        <button
          onClick={onRetry}
          disabled={loading}
          className="mt-5 bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50"
        >
          {loading ? "لطفاً صبر کنید..." : "ارسال مجدد رسید"}
        </button>
      }
    >
      {reason && (
        <div className="mt-3 bg-white/70 rounded-xl p-3 text-sm text-red-700">
          <span className="font-bold">دلیل رد:</span> {reason}
        </div>
      )}
    </StatusBanner>
  );
}