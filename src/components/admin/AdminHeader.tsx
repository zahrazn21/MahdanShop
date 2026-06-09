import { Package } from "lucide-react";
import Link from "next/link";

export default function AdminHeader() {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">پنل مدیریت</h1>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-pink-600">
            بازگشت به سایت
          </Link>
        </div>
      </div>
    </div>
  );
}