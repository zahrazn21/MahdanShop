"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { formatNumber } from "@/src/shared/lib/format";

interface Props {
  label: string;
  count: number;
  children: ReactNode;
}

export function ProductsAccordion({ label, count, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-2xl border border-pink-200 bg-pink-200/10 px-4 py-3 text-sm font-bold hover:bg-gray-100"
      >
        <span>
          {label}
          <span className="mr-2 text-xs font-normal text-gray-500">
            ({formatNumber(count)} کالا)
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}