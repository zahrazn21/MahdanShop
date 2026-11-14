"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="
          fixed top-4 left-1/2 z-100 -translate-x-1/2
          flex flex-col items-center gap-2
          pointer-events-none
        "
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-2
              rounded-full px-4 py-2
              text-xs md:text-sm font-semibold text-white
              shadow-lg
              animate-in fade-in slide-in-from-top-3 duration-300
              ${
                toast.type === "success"
                  ? "bg-emerald-500"
                  : toast.type === "error"
                    ? "bg-red-500"
                    : "bg-pink-500"
              }
            `}
          >
            {toast.type === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
            {toast.type === "error" && <XCircle className="h-4 w-4 shrink-0" />}
            {toast.type === "info" && <Info className="h-4 w-4 shrink-0" />}
            <span className="whitespace-nowrap">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return ctx;
}