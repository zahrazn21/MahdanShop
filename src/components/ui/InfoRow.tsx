import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
  icon?: ReactNode;
}

export function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="rounded-2xl bg-gray-50 md:p-4 px-4 py-1 flex md:block justify-between items-center">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
        {icon}<span>{label}</span>
      </div>
      <p className="font-medium text-gray-700 wrap-break-word">{value || "-"}</p>
    </div>
  );
}