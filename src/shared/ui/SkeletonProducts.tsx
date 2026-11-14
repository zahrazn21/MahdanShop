export function SkeletonProducts() {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse h-54 md:h-auto md:mx-2 w-full">
      <div className="absolute top-2 right-2 z-10 w-12 h-6 bg-gray-200 rounded-full" />
     
      <div className="relative w-full flex items-center justify-center p-1 md:p-4">
        <div className="flex p-4 w-full border-2 border-dashed border-pink-100 rounded-3xl place-content-center">
          <div className="w-45 h-35 sm:w-26 bg-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="py-1 px-2 md:p-3 text-right">
        <div className="flex justify-between items-center mb-1">
          <div className="h-3 w-8 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-4 md:h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="flex items-center justify-between gap-1">
          <div className="h-4 md:h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-4 md:h-5 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

