import type { ReactNode } from "react";
import { formatPrice } from "@/src/shared/lib/format";

interface Props {
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
  title: string;
  badge?: ReactNode;
  subtitle: ReactNode;
  amount: number;
  children: ReactNode;
}

export function DebtCardShell({
  selected,
  onToggle,
  disabled = false,
  title,
  badge,
  subtitle,
  amount,
  children,
}: Props) {
  return (
    <div
      className={`rounded-3xl border bg-white p-5 shadow-sm transition ${
        selected
          ? "border-pink-300 ring-1 ring-pink-200"
          : "border-gray-200"
      } ${disabled ? "opacity-90" : ""}`}
    >
      <div className="flex gap-4">
        <input
          type="checkbox"
          checked={selected}
          disabled={disabled}
          onChange={onToggle}
          aria-label={`انتخاب ${title}`}
          className="mt-1 h-5 w-5 shrink-0 accent-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-800">
                  {title}
                </h3>

                {badge}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                {subtitle}
              </div>
            </div>

            <div className="shrink-0 text-lg font-black text-pink-600">
              {formatPrice(amount)}
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}