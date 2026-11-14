interface SkeletonCardProps {
  variant?: "default" | "horizontal" | "compact";
  count?: number;
}

export function SkeletonCard({ variant = "default", count = 1 }: SkeletonCardProps) {
  const cards = Array(count).fill(null);
  
  const renderCard = () => {
    switch (variant) {
      case "horizontal":
        return (
          <div className="flex gap-4 bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="w-32 h-32 bg-gray-200 shrink-0" />
            <div className="flex-1 p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        );
      
      case "compact":
        return (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-2 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded-full w-full mt-2" />
            </div>
          </div>
        );
    }
  };
  
  if (count > 1) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {cards.map((_, i) => (
          <div key={i}>{renderCard()}</div>
        ))}
      </div>
    );
  }
  
  return renderCard();
}