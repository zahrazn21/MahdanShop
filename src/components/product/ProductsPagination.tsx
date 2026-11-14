import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (current > 4) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let p = start; p <= end; p++) pages.push(p);

  if (current < total - 3) pages.push("...");
  pages.push(total);

  return pages;
}

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:border-pink-300 hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function ProductsPagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="صفحه‌بندی محصولات"
      className="flex flex-wrap items-center justify-center gap-2 pt-8"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={arrowClass}
        aria-label="صفحه قبل"
      >
        <ChevronRight size={20} />
      </button>

      {getPageNumbers(currentPage, totalPages).map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="flex h-10 min-w-10 items-center justify-center text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
              page === currentPage
                ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                : "border border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:bg-pink-50"
            }`}
          >
            {page.toLocaleString("fa-IR")}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={arrowClass}
        aria-label="صفحه بعد"
      >
        <ChevronLeft size={20} />
      </button>
    </nav>
  );
}