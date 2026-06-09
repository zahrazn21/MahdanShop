"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "تأیید حذف",
  message = "آیا از انجام این عمل مطمئن هستید؟",
  confirmText = "بله، حذف کن",
  cancelText = "انصراف",
  isLoading = false,
  type = "danger",
}: ConfirmModalProps) {
  // جلوگیری از اسکرول بک‌گراند
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: "text-red-500",
      bg: "bg-red-50",
      button: "bg-red-500 hover:bg-red-600",
    },
    warning: {
      icon: "text-yellow-500",
      bg: "bg-yellow-50",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    info: {
      icon: "text-blue-500",
      bg: "bg-blue-50",
      button: "bg-blue-500 hover:bg-blue-600",
    },
  };

  const currentColor = colors[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* بک‌گراند تیره */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* مودال */}
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* آیکون */}
        <div className="flex justify-center pt-8">
          <div className={`w-16 h-16 ${currentColor.bg} rounded-full flex items-center justify-center`}>
            <AlertTriangle className={`w-8 h-8 ${currentColor.icon}`} />
          </div>
        </div>

        {/* عنوان */}
        <h3 className="text-xl font-bold text-center mt-4 mb-2 text-gray-800">
          {title}
        </h3>

        {/* پیام */}
        <p className="text-gray-500 text-center px-6 mb-6">
          {message}
        </p>

        {/* دکمه‌ها */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${currentColor.button} text-white py-2.5 rounded-full font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال حذف...
              </>
            ) : (
              confirmText
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}