"use client";

import { XCircle } from "lucide-react";
import Image from "next/image";

export function Stat({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className={`rounded-xl px-3 py-3 text-center ${className}`}>
      <p className="text-lg font-black">{value.toLocaleString("fa-IR")}</p>
      <p className="mt-1 text-[11px] font-bold">{label}</p>
    </div>
  );
}

export function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
        active ? "bg-pink-500 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-pink-500">{icon}</span>
      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
  );
}

export function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <SectionTitle icon={icon} title={title} />
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-gray-400">{label}</span>
      <span className="text-left font-medium text-gray-700">{value}</span>
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-400"
      />
    </label>
  );
}

export function ReceiptModal({ image, title, onClose }: { image: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="relative max-h-[90vh] max-w-3xl rounded-2xl bg-white p-2" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <XCircle size={20} />
        </button>
        <div className="px-3 pb-2 pt-2 text-sm font-bold text-gray-700">{title}</div>
        <Image src={image} alt={title} className="max-h-[85vh] w-auto rounded-xl object-contain" />
      </div>
    </div>
  );
}
