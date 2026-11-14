"use client";

import { 
  CreditCard, 
  Check, 
  Shield, 
} from "lucide-react";

// export type PaymentType = "card" | "transfer" | "online";
export type PaymentType = "CARD_TO_CARD";

interface PaymentMethodProps {
  onSelect: (method: PaymentType) => void;
  selected: PaymentType | null;
  isLoading?: boolean;
}

export default function PaymentMethod({ 
  onSelect, 
  selected, 
  isLoading = false 
}: PaymentMethodProps) {
const methods = [
  {
    id: "CARD_TO_CARD" as PaymentType,
    name: "کارت به کارت",
    icon: CreditCard,
    description: "پرداخت از طریق کارت بانکی",
    details: "شماره کارت: ۶۰۳۷-۷۹۹۷-۹۴۵۶-۱۲۳۴",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
];

  const handleSelect = (methodId: PaymentType) => {
    onSelect(methodId);
  };

  return (
    <div className="bg-white rounded-4xl shadow-sm shadow-pink-100 border border-white p-6">
      <div className="flex items-center gap-2 justify-center mb-8" dir="rtl">
        <CreditCard className="w-6 h-6 text-pink-500" />
        <h2 className="text-lg font-bold text-gray-800">انتخاب روش پرداخت</h2>
      </div>

      <div className="space-y-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelect(method.id)}
            disabled={isLoading}
            className={`w-full p-4 border-2 rounded-2xl transition-all text-right flex items-start gap-4 ${
              selected === method.id
                ? "border-pink-500 bg-pink-50 shadow-md"
                : "border-gray-200 hover:border-pink-200 hover:bg-pink-50/50"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                selected === method.id
                  ? "bg-pink-500 text-white"
                  : `${method.color} ${method.iconColor}`
              }`}
            >
              <method.icon className="w-6 h-6" />
            </div>

            <div className="flex-1 text-right">
              <div className="font-medium text-gray-800">{method.name}</div>
              <div className="text-sm text-gray-500">{method.description}</div>
              {selected === method.id && (
                <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded-xl border border-gray-100">
                  {method.details}
                </div>
              )}
            </div>

            {selected === method.id && (
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 justify-center">
          <Shield className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-700">
            تمامی پرداخت‌ها با امنیت کامل و با استفاده از گواهی SSL انجام می‌شود
          </p>
        </div>
      </div>
    </div>
  );
}