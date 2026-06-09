"use client";
import { useState, useRef, useEffect } from "react";
import { Search, SearchIcon, X } from "lucide-react";

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // بستن با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // TODO: redirect to search results
      console.log("جستجو:", searchTerm);
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} dir="rtl" className="relative flex items-center">
      {/* دکمه جستجو */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-pink-100 transition-colors z-10"
      >
        <Search className="w-5 h-5 text-pink-600" />
      </button>

      {/* باکس جستجو - از راست به چپ باز میشه */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            flex items-center justify-between
            transition-all duration-300 ease-in-out absolute top-12 h-12 shadow-md shadow-[#dc8cb1]
            bg-(--color-pink-light)  rounded-full py-2 pr-10 pl-2
            focus:outline-none focus:border-pink-500
            text-gray-700 text-sm
            ${open ? "w-160 opacity-100 mr-12" : "w-0 opacity-0 p-0 border-0 mr-0"}
          `}
        >
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی محصول..."
            className="focus:outline-none text-base w-full"
          
          />
          <SearchIcon className="text-pink-800 bg-pink-200 p-1.5 rounded-full w-8 h-8 rotate-90"/>
        </div>

        {/* دکمه پاک کردن */}
        {open && searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
}
