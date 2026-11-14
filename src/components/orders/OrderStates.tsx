import { Package } from "lucide-react";

export function OrderLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
        <Package className="mx-auto text-pink-500 mb-4 animate-pulse" size={45} />
        <p className="font-bold text-gray-700">در حال دریافت اطلاعات سفارش...</p>
      </div>
    </div>
  );
}

export function OrderNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
        <Package className="mx-auto mb-4 text-gray-300" size={50} />
        <p className="font-bold text-gray-700">سفارش پیدا نشد</p>
      </div>
    </div>
  );
}