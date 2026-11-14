"use client";

import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: ToastType;
  duration?: number;
  title?: string;
}

export default function Toast({
  isOpen,
  onClose,
  message,
  type = "success",
  duration = 3000,
  title,
}: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      bg: "bg-green-500",
      title: title || "موفقیت",
    },
    error: {
      icon: <XCircle className="w-6 h-6" />,
      bg: "bg-red-500",
      title: title || "خطا",
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      bg: "bg-yellow-500",
      title: title || "اخطار",
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      bg: "bg-blue-500",
      title: title || "اطلاعیه",
    },
  };

  const current = icons[type];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
      <div className={`${current.bg} text-white rounded-xl shadow-lg overflow-hidden min-w-[300px] max-w-md`}>
        <div className="flex items-center gap-3 p-4">
          <div className="shrink-0">{current.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">{current.title}</h4>
            <p className="text-sm opacity-90">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="h-1 bg-white/30 relative">
          <div
            className="absolute inset-0 bg-white/50 animate-shrink"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
}