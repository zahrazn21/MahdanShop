import type { ReactNode } from "react";

export function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${className}`}
    >
      {label}
    </span>
  );
}

export function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <SectionTitle icon={icon} title={title} />

      <div className="space-y-3 text-sm">
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-pink-500">{icon}</span>

      <h3 className="font-bold text-gray-800">
        {title}
      </h3>
    </div>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
      <span className="shrink-0 text-gray-400">
        {label}
      </span>

      <span className="max-w-[65%] wrap-break-word text-left font-medium text-gray-700">
        {value}
      </span>
    </div>
  );
}

export function PriceRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${className}`}
    >
      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
  );
}

export function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        {icon}

        <span>{label}</span>
      </div>

      <p className="mt-2 wrap-break-word text-sm font-bold text-gray-700">
        {value}
      </p>
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  disabled,
  className = "",
  icon,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {icon}

      {children}
    </button>
  );
}

export function EmptyText({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}