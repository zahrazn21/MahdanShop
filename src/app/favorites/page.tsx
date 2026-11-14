import { redirect } from "next/navigation";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUserId } from "@/src/shared/lib/session";
import FavoritesGrid, {
  FavoriteItem,
} from "@/src/components/favorites/FavoritesGrid";

export const metadata = {
  title: "علاقه‌مندی‌های من",
};

export default async function FavoritesPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login?callbackUrl=/favorites");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const items: FavoriteItem[] = favorites.map((f) => ({
    id: f.product.id,
    name: f.product.name,
    slug: f.product.slug,
    price: f.product.price,
    originalPrice: f.product.originalPrice,
    image: f.product.image,
    isAvailable: f.product.isAvailable,
    status: f.product.status,
    scope: f.product.scope as "domestic" | "imported" | "all",
    category: f.product.category as
        | "cosmetics"
    | "personal-care"
    | "fragrance"
    | "stationery"
    | "accessories"
    | "bags"
    | "lego"
    | "cute-items",
  }));

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-linear-to-b from-blossom-50 via-white to-blossom-50/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-blossom-500">
            <SparkleIcon className="h-5 w-5" />
            <span className="text-xs font-medium tracking-wide">
              مجموعه‌ی دوست‌داشتنی تو
            </span>
            <SparkleIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-plum-800 sm:text-3xl">
            علاقه‌مندی‌های من
          </h1>
          <p className="text-sm text-pink-700 font-bold">
            {items.length > 0
              ? `${new Intl.NumberFormat("fa-IR").format(items.length)} محصول توی لیستته`
              : "هر چی دوست داشتی رو اینجا جمع کن"}
          </p>
        </header>

        <FavoritesGrid initialItems={items} />
      </div>
    </main>
  );
}

function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
    </svg>
  );
}
