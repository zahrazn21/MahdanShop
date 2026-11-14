import { useReceiptPicker } from "@/src/shared/hooks/useReceiptPicker";
import { Upload } from "lucide-react";
import Image from "next/image";

type Props = {
  title?: string;
  label: string;
  submitLabel: string;
  accent: "pink" | "purple";
  isPending: boolean;
  disabled?: boolean; 
  onSubmit: (file: File, reset: () => void) => void;
};

const ACCENT = {
  pink:   { hover: "hover:border-pink-300",   btn: "bg-pink-500 hover:bg-pink-600" },
  purple: { hover: "hover:border-purple-300", btn: "bg-purple-600 hover:bg-purple-700" },
};

export function ReceiptUploader({ title, label, submitLabel, accent, isPending, onSubmit }: Props) {
  const { file, preview, pick, clear } = useReceiptPicker();
  const a = ACCENT[accent];

  return (
    <div>
      <h3 className="font-bold text-gray-800 mb-3 ">{title}</h3>

      <label className={` block w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-2 md:p-6 cursor-pointer text-center transition ${a.hover}`}>
        <Upload className="mx-auto text-gray-400 mb-3 text-xs md:text-base"  />
        <span className="font-bold text-gray-700 text-sm md:text-base">{label}</span>
        <p className="md:text-xs text-[10px] text-gray-400 mt-2">JPG، PNG، WEBP - حداکثر ۵ مگابایت</p>
        <input
          type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
        />
      </label>

      {file && (
        <div className="mt-4 rounded-2xl bg-gray-50 p-4">
          <p className="text-sm text-gray-600 text-center mb-4">
            فایل انتخاب‌شده: <span className="font-bold mr-1">{file.name}</span>
          </p>
          {preview && (
            <Image
            
            src={preview} alt="پیش‌نمایش" className="mx-auto max-h-96 max-w-full rounded-xl object-contain" />
          )}
        </div>
      )}

      <button
        disabled={isPending || !file}
        onClick={() => file && onSubmit(file, clear)}
        className={`mt-4 w-full text-white py-3 rounded-full font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${a.btn}`}
      >
        {isPending ? "در حال ارسال رسید..." : submitLabel}
      </button>
    </div>
  );
}