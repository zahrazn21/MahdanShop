import Image from "next/image";
import { Receipt } from "lucide-react";

export function ReceiptPreview({ src, title }: { src: string; title: string }) {
  return (
    <div className="mt-5 border-t border-gray-200 pt-5">
      <div className="flex items-center gap-2 mb-3">
        <Receipt className="text-gray-500" size={18} />
        <p className="text-sm font-bold text-gray-700">{title}</p>
      </div>

      <div className="bg-white rounded-2xl p-3 border border-gray-200">
        <Image
          src={src} alt={title} width={800} height={800}
          className="w-full max-h-125 object-contain rounded-xl"
        />
      </div>
       <a
        href={src} target="_blank" rel="noopener noreferrer"
        className="mt-3 block text-center text-sm font-bold text-pink-600 hover:text-pink-700"
      >
        مشاهده تصویر در اندازه کامل
      </a>
    </div>
  );
}