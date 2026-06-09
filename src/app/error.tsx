// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // لاگ خطا در کنسول
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center">
        {/* بخش بالایی با آیکون */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        {/* محتوای خطا */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">اوه! خطایی رخ داد</h2>
          <p className="text-gray-500 mb-6">
            متأسفانه در پردازش درخواست شما مشکلی پیش آمد. لطفاً دوباره تلاش کنید.
          </p>
          
          {/* نمایش خطا در محیط توسعه */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
              <p className="text-red-600 font-mono text-sm break-all">
                {error.message}
              </p>
            </div>
          )}
          
          {/* دکمه‌های اقدام */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              تلاش مجدد
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}