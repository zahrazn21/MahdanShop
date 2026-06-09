import React from "react";

export default function loading() {
  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">در حال بارگذاری سبد خرید...</p>
      </div>
    </div>
  );
}
