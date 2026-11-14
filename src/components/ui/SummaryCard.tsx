import type { ReactNode } from "react";
import Link from "next/link";

interface Props {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
  action?: {
    href: string;
    label: string;
  };
}

export function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  highlight = false,
  action,
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex gap-2 items-center text-gray-500">
        {icon}
        <span>{title}</span>
      </div>

      <p className={`text-xl font-bold mt-3 ${highlight ? "text-pink-600" : "text-gray-800"}`}>
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
      )}

      {action && (
        <Link
          href={action.href}
          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-600 underline underline-offset-2 hover:text-orange-700"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}