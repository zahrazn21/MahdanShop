"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          خطا در بارگذاری محصولات
        </h2>
        
        <p className="text-gray-500 mb-6">
          {error.message || "متأسفانه مشکلی در دریافت اطلاعات به وجود آمد"}
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            تلاش مجدد
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            بازگشت به خانه
          </Link>
        </div>
        
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-sm text-red-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}