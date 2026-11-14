"use client";

import { Search } from "lucide-react";

interface SearchBoxMobileProps {
  onOpen: () => void;
}

export default function SearchBoxMobile({
  onOpen,
}: SearchBoxMobileProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="باز کردن جستجو"
      className="
        w-full
        text-right
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-pink-200
        rounded-full
      "
    >
      <div
        dir="rtl"
        className="
          flex
          h-11
          w-full
          items-center
          gap-2
          rounded-full
          border
          border-gray-200
          bg-white
          px-4
          text-sm
          text-gray-400
          shadow-sm
          transition-all
          hover:border-pink-300
          hover:shadow-md
          active:scale-[0.99]
        "
      >
        <Search className="h-5 w-5 shrink-0" />

        <span className="truncate">
          جستجوی محصول...
        </span>
      </div>
    </button>
  );
}

