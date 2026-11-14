"use client";
import { Check } from "lucide-react";

interface ProductOptionsProps {
  colors?: string[];
  sizes?: string[];
  numbers?: string[];
  selectedColor?: string;
  selectedSize?: string;
  selectedNumber?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
  onNumberChange?: (number: string) => void;
}

export default function ProductOptions({
  colors = [],
  sizes = [],
  numbers = [],
  selectedColor,
  selectedSize,
  selectedNumber,
  onColorChange,
  onSizeChange,
  onNumberChange,
}: ProductOptionsProps) {
  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            رنگ:
            {selectedColor && (
              <span className="text-pink-600 mr-2">({selectedColor})</span>
            )}
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange?.(color)}
                className={`relative group transition-all duration-200 ${
                  selectedColor === color
                    ? " ring-offset-2"
                    : "hover:scale-105"
                }`}
              >
                <div
                  title={color}
                  style={{ backgroundColor: getColorCode(color) }}
                  className="w-8 h-8  rounded-[60%_40%_30%_70%/60%_30%_70%_40%] shadow-md "
                ></div>
                {selectedColor === color && (
                  <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {sizes.length > 0 && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            سایز:
            {selectedSize && (
              <span className="text-pink-600 mr-2">({selectedSize})</span>
            )}
          </label>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange?.(size)}
                className={`px-4 py-2 border-2 border-pink-900/10 rounded-lg transition-all duration-200 ${
                  selectedSize === size
                    ? "border-pink-500 bg-pink-50 text-pink-600 font-semibold"
                    : "border-gray-200 hover:border-pink-300 text-gray-600"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      {numbers.length > 0 && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            شماره / سایه:
            {selectedNumber && (
              <span className="text-pink-600 mr-2">
                (شماره {selectedNumber})
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-3">
            {numbers.map((number) => (
              <button
                key={number}
                onClick={() => onNumberChange?.(number)}
                className={`w-12 h-12 rounded-full border-2 border-pink-900/10 transition-all duration-200 ${
                  selectedNumber === number
                    ? "border-pink-500 bg-pink-100 text-pink-600 font-bold"
                    : "border-gray-200 hover:border-pink-300 text-gray-500"
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function getColorCode(colorName: string): string {
  const colors: Record<string, string> = {
    قرمز: "#DC2626",
    صورتی: "#EC4899",
    نود: "#F5C6A0",
    بنفش: "#8B5CF6",
    مرجانی: "#FB7185",
    مشکی: "#1F2937",
    سفید: "#FFFFFF",
    قهوه‌ای: "#78350F",
    طلایی: "#FBBF24",
    نارنجی: "#F97316",
    سبز: "#10B981",
    آبی: "#3B82F6",
  };
  return colors[colorName] || "#CBD5E1";
}
