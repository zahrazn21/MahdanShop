export type CategoryGroup = "beauty" | "shop";
export interface Category {
  id: string;
  name: string;
  image: string;
  hoverImg: string;
  slug:
    | "cosmetics"
    | "personal-care"
    | "fragrance"
    | "stationery"
    | "accessories"
    | "bags"
    | "lego"
    | "cute-items";
  group: CategoryGroup;
}

export function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    cosmetics: "لوازم آرایشی",
    "personal-care": "مراقبت از پوست، مو و بدن",
    fragrance: "عطر و ادکلن",
    stationery: "لوازم تحریر",
    accessories: "اکسسوری",
    // clothing: "پوشاک",
    bags: "کیف و کوله پشتی",
    lego: "لگو",
    "cute-items": "آیتم‌های فانتزی",
  };
  return categoryNames[category] ?? category;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "لوازم آرایشی",
    image: "/images/categories/new/cosmetic.png",
    hoverImg: "/images/categories/cosmetic2.png",
    slug: "cosmetics",
    group: "beauty",
  },

  {
    id: "2",
    name: "مراقبت از پوست، مو و بدن",
    image: "/images/categories/new/skin-care.png",
    hoverImg: "/images/categories/skin-care2.png",
    slug: "personal-care",
    group: "beauty",
  },

  {
    id: "3",
    name: "عطر و ادکلن",
    image: "/images/categories/fragrance.png",
    hoverImg: "/images/categories/fragrance2.png",
    slug: "fragrance",
    group: "beauty",
  },
  {
    id: "6",
    name: "لوازم تحریر",
    image: "/images/categories/stationery.png",
    hoverImg: "/images/categories/stationery2.png",
    slug: "stationery",
    group: "shop",
  },

  {
    id: "7",
    name: "اکسسوری",
    image: "/images/categories/acc.png",
    hoverImg: "/images/categories/acc2.png",
    slug: "accessories",
    group: "shop",
  },

  // {
  //   id: "8",
  //   name: "پوشاک",
  //   image: "/images/categories/clothing.png",
  //   hoverImg: "/images/categories/clothing2.png",
  //   slug: "clothing",
  //   group: "shop",
  // },

  {
    id: "9",
    name: "کیف",
    image: "/images/categories/bag.png",
    hoverImg: "/images/categories/bag2.png",
    slug: "bags",
    group: "shop",
  },

  {
    id: "10",
    name: "لگو",
    image: "/images/categories/lego.png",
    hoverImg: "/images/categories/lego2.png",
    slug: "lego",
    group: "shop",
  },

  {
    id: "11",
    name: "آیتم‌های فانتزی",
    image: "/images/categories/cute.png",
    hoverImg: "/images/categories/cute2.png",
    slug: "cute-items",
    group: "shop",
  },
];
