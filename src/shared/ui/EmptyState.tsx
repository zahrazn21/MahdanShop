import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
  onAction?: () => void;
}

const defaultIcons = {
  product: "🛍️",
  category: "📁",
  search: "🔍",
  cart: "🛒",
  wishlist: "❤️",
};

export default function EmptyState({ 
  title = "موردی یافت نشد",
  message = "هیچ آیتمی برای نمایش وجود ندارد",
  icon = defaultIcons.product,
  action,
  onAction
}: EmptyStateProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6 opacity-80">
          {typeof icon === 'string' ? icon : icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p dir="rtl" className="text-gray-500 mb-6">
          {message}
        </p>
        {(action || onAction) && (
          action?.href ? (
            <Link 
              href={action.href}
              className="inline-block px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              {action.label}
            </Link>
          ) : onAction && (
            <button
              onClick={onAction}
              className="inline-block px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              {action?.label || "بازگشت"}
            </button>
          )
        )}
      </div>
    </div>
  );
}