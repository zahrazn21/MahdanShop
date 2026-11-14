export default function ProductsGridSkeleton({
  count = 8,
  className = "",
  itemClassName = "",
}: {
  count?: number;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={className} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} className={itemClassName} />
      ))}
    </div>
  );
}

function ProductCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white shadow shadow-[#d69db2] sm:mx-1 md:mx-0 md:rounded-3xl ${className}`}
    >
      <div className="relative flex w-full items-center justify-center p-1 md:p-2">
        <div className="relative aspect-4/3 w-full animate-pulse overflow-hidden rounded-lg border border-dashed border-(--color-pink-white) bg-gray-100 md:rounded-3xl md:border-2">
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        </div>

        <div className="absolute right-1.5 top-1.5 h-4 w-8 animate-pulse rounded-full bg-gray-200 md:right-2 md:top-2 md:h-6 md:w-12" />
        <div className="absolute left-1.5 top-1.5 h-6 w-6 animate-pulse rounded-full bg-gray-200 md:left-2 md:top-2 md:h-9 md:w-9" />
        <div className="absolute left-1.5 top-9 h-6 w-6 animate-pulse rounded-full bg-gray-200 md:left-2 md:top-13 md:h-9 md:w-9" />
      </div>

      <div className="px-1.5 py-1 text-right md:p-3">
        <div className="mb-0.5 flex items-center justify-between md:mb-1">
          <div className="h-2.5 w-8 animate-pulse rounded-full bg-gray-200 md:h-3 md:w-10" />
          <div className="hidden h-3 w-14 animate-pulse rounded bg-gray-100 md:block" />
        </div>

        <div className="min-h-7 space-y-1 md:min-h-12">
          <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 md:h-5" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-200 md:h-5" />
        </div>

        <div className="mt-0.5 md:mt-1">
          <div className="h-4 w-14 animate-pulse rounded-full bg-gray-100 md:h-5 md:w-20" />
        </div>

        <div className="mt-1 flex items-center justify-between gap-1 md:mt-2">
          <div className="h-2.5 w-12 animate-pulse rounded bg-gray-100 md:h-3 md:w-16" />
          <div className="ms-auto flex items-center gap-1">
            <div className="h-3.5 w-16 animate-pulse rounded bg-gray-200 md:h-5 md:w-24" />
            <div className="h-2.5 w-6 animate-pulse rounded bg-gray-100 md:h-4 md:w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}