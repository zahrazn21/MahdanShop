"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSearchOverlay({
  open,
  onClose,
}: MobileSearchOverlayProps) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = searchTerm.trim();

    if (!value) return;

    onClose();
    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  const clearSearch = () => {
    setSearchTerm("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  if (!open) return null;

  return (
    <div
      dir="rtl"
      className="
        fixed inset-0 z-9999
        flex flex-col
        bg-white
        md:hidden
      "
    >
      <div
        className="
          flex h-16 shrink-0 items-center gap-2
          border-b border-gray-100
          bg-white px-3
        "
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن جستجو"
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-full
            text-gray-600
            transition
            hover:bg-gray-100
            active:scale-95
          "
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        <form
          onSubmit={handleSubmit}
          className="relative min-w-0 flex-1"
        >
          <Search
            className="
              pointer-events-none
              absolute right-3 top-1/2
              h-5 w-5
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="جستجوی محصول..."
            autoComplete="off"
            aria-label="جستجوی محصول"
            className="
              h-11 w-full
              rounded-full
              border border-gray-200
              bg-gray-50
              px-11
              text-right
              text-sm
              text-gray-700
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-pink-400
              focus:bg-white
              focus:ring-4
              focus:ring-pink-100
              [&::-webkit-search-cancel-button]:appearance-none
              [&::-webkit-search-decoration]:appearance-none
            "
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="پاک کردن جستجو"
              className="
                absolute left-2 top-1/2
                flex h-8 w-8
                -translate-y-1/2
                items-center justify-center
                rounded-full
                text-gray-400
                transition
                hover:bg-gray-200
                hover:text-gray-600
                active:scale-95
              "
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <p className="mb-5 text-sm font-bold text-gray-800">
          چه محصولی دنبالش هستید؟
        </p>

        {!searchTerm && (
          <div className="text-sm text-gray-400">
            نام محصول مورد نظر خود را جستجو کنید.
          </div>
        )}

        {searchTerm && (
          <p className="text-sm text-gray-500">
            برای مشاهده نتایج، جستجو را انجام دهید.
          </p>
        )}
      </div>
    </div>
  );
}

