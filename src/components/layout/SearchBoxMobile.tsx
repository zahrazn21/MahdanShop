"use client";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function SearchBoxMobile() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("جستجو:", searchTerm);
      // TODO: redirect to search results
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      {/* آیکون جستجو در سمت راست */}
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* اینپوت جستجو */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="جستجوی محصول..."
        className="w-full bg-white border border-gray-200 rounded-full py-2.5 pr-10 pl-12 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-all"
      />

      {/* آیکون فیلتر در سمت چپ */}
      <button
        type="button"
        onClick={() => console.log("باز کردن فیلتر")}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors"
      >
        <Filter className="w-5 h-5" />
      </button>
    </form>
  );
}