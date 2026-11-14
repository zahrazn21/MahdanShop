export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-pink-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-rose-300 border-b-transparent animate-spin animation-delay-150"></div>
        </div>
        
        <div className="mt-6 space-y-2">
          <p className="text-pink-600 font-semibold text-lg">در حال بارگذاری...</p>
          <p className="text-gray-400 text-sm">لطفاً چند لحظه صبر کنید</p>
        </div>
        
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}