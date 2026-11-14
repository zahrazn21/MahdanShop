"use client";

import { useParams } from "next/navigation";

export default function PaymentPage() {
  const params = useParams();

  const orderId = params.id as string;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      dir="rtl"
    >
      <div className="bg-white p-8 rounded-3xl shadow">

        <h1 className="text-xl font-bold mb-4">
          پرداخت سفارش
        </h1>

        <p>
          شماره سفارش:
        </p>

        <p className="font-bold text-pink-600">
          {orderId}
        </p>

        <p className="mt-6">
          لطفاً مبلغ سفارش را کارت به کارت کنید
          و تصویر رسید را ارسال کنید.
        </p>

      </div>
    </div>
  );
}