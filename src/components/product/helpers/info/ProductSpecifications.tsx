"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ProductSpecification {
  key: string;
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specifications?: ProductSpecification[] | null;
}

export function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  const [showSpecs, setShowSpecs] = useState(false);

  if (!specifications?.length) {
    return null;
  }

  return (
    <div className="border-t border-pink-100 pt-4">
      <button
        type="button"
        onClick={() => setShowSpecs((value) => !value)}
        className="flex w-full items-center justify-between font-semibold text-gray-700"
      >
        مشخصات فنی

        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            showSpecs ? "rotate-180" : ""
          }`}
        />
      </button>

      {showSpecs && (
        <dl className="mt-4 divide-y divide-pink-100 overflow-hidden rounded-2xl bg-white/50">
          {specifications.map((specification) => (
            <div
              key={specification.key}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <dt className="text-gray-500">
                {specification.label}
              </dt>

              <dd className="font-medium text-gray-800">
                {specification.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}