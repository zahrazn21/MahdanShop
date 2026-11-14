/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  SearchIcon,
  X,
  Loader2,
} from "lucide-react";

import { useProducts } from "@/src/shared/hooks/useProducts";

export default function SearchBox() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchTerm]);


  const {
    data,
    isLoading,
    isFetching,
  } = useProducts({
    search:
      open && debouncedSearch.length >= 2
        ? debouncedSearch
        : undefined,
    page: 1,
    limit: 6,
  });
  const products = data?.products ?? [];

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setError("");

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };


  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = searchTerm.trim();

    if (!value) {
      setError("لطفاً عبارت مورد نظر را وارد کنید");
      return;
    }

    if (value.length < 2) {
      setError("لطفاً حداقل ۲ کاراکتر وارد کنید");
      return;
    }

    setError("");
    setOpen(false);

    router.push(
      `/products?search=${encodeURIComponent(value)}`,
    );
  };
  const handleProductClick = () => {
    setOpen(false);
    setSearchTerm("");
    setDebouncedSearch("");
    setError("");
  };
  const handleClear = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setError("");

    inputRef.current?.focus();
  };

  const showDropdown =
    open && searchTerm.trim().length >= 2;

  const showLoading =
    showDropdown && (isLoading || isFetching);

  const showEmpty =
    showDropdown &&
    !showLoading &&
    debouncedSearch.length >= 2 &&
    products.length === 0;

  const showValidationError =
    open && !!error;

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="relative flex items-center"
    >
      <button
        type="button"
        onClick={handleOpen}
        aria-label="جستجوی محصول"
        className="
          z-10
          rounded-full
          p-2
          transition-colors
          hover:bg-pink-100
        "
      >
        <Search className="h-5 w-5 text-pink-600" />
      </button>
      <form
        onSubmit={handleSubmit}
        className="relative"
      >
        <div
          className={`
            absolute
            top-12
            z-50
            flex
            h-12
            items-center
            justify-between
            rounded-full
            bg-(--color-pink-light)
            py-2
            pr-10
            pl-2
            text-sm
            text-gray-700
            shadow-md
            shadow-[#dc8cb1]
            transition-all
            duration-300
            ease-in-out

            ${
              open
                ? "mr-12 w-160 opacity-100"
                : "mr-0 w-0 border-0 p-0 opacity-0"
            }
          `}
        >
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) =>
              handleSearchChange(e.target.value)
            }
            placeholder="جستجوی محصول..."
            className="
              w-full
              bg-transparent
              text-base
              outline-none
            "
          />

          {showLoading ? (
            <Loader2
              className="
                h-8
                w-8
                shrink-0
                animate-spin
                rounded-full
                bg-pink-200
                p-1.5
                text-pink-800
              "
            />
          ) : (
            <SearchIcon
              className="
                h-8
                w-8
                shrink-0
                rotate-90
                rounded-full
                bg-pink-200
                p-1.5
                text-pink-800
              "
            />
          )}
        </div>
        {open && searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="پاک کردن جستجو"
            className="
              absolute
              left-3
              top-1/2
              z-60
              -translate-y-1/2
              text-gray-400
              transition
              hover:text-gray-600
            "
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {showValidationError && (
          <div
            className="
              absolute
              right-12
              top-25
              z-40
              w-160
              rounded-2xl
              border
              border-red-100
              bg-white
              px-5
              py-4
              shadow-[0_12px_35px_rgba(220,140,177,0.18)]
            "
          >
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          </div>
        )}
        {showDropdown && !error && (
          <div
            className="
              absolute
              right-12
              top-25
              z-40
              w-160
              overflow-hidden
              rounded-3xl
              border
              border-pink-100
              bg-white
              shadow-[0_12px_35px_rgba(220,140,177,0.25)]
            "
          >
            {showLoading && (
              <div className="flex items-center justify-center gap-2 px-5 py-6 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin text-pink-500" />

                <span>
                  در حال جستجو...
                </span>
              </div>
            )}
            {showEmpty && (
              <div className="px-5 py-7 text-center">
                <Search className="mx-auto mb-2 h-7 w-7 text-pink-300" />

                <p className="text-sm font-semibold text-gray-600">
                  محصولی پیدا نشد
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  عبارت دیگری را امتحان کنید
                </p>
              </div>
            )}
            {!showLoading &&
              products.length > 0 && (
                <>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {products.map((product: any) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.scope}/${product.category}/${product.slug}`}
                        onClick={handleProductClick}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          p-2
                          transition
                          hover:bg-pink-50
                        "
                      >
                        <div
                          className="
                            relative
                            h-14
                            w-14
                            shrink-0
                            overflow-hidden
                            rounded-xl
                            bg-pink-50
                          "
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {product.name}
                          </p>

                          {product.brand && (
                            <p className="mt-0.5 truncate text-xs text-gray-400">
                              {product.brand}
                            </p>
                          )}

                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-xs font-bold text-pink-600">
                              {product.price?.toLocaleString()}
                            </span>

                            <span className="text-[10px] text-gray-400">
                              تومان
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="
                      w-full
                      border-t
                      border-pink-100
                      bg-pink-50/50
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-pink-600
                      transition
                      hover:bg-pink-100
                    "
                  >
                    مشاهده همه نتایج برای «
                    {searchTerm.trim()}
                    »
                  </button>
                </>
              )}
          </div>
        )}
      </form>
    </div>
  );
}

