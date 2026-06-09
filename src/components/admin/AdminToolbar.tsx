import { Search, Plus } from "lucide-react";

interface AdminToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export default function AdminToolbar({ searchTerm, onSearchChange, onAddClick }: AdminToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="جستجوی محصول..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10 pl-4 py-2 border border-gray-200 rounded-full w-64 focus:outline-none focus:border-pink-400"
        />
      </div>
      
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        افزودن محصول جدید
      </button>
    </div>
  );
}