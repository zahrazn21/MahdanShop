export interface Category {
  id: string;
  name: string;
  image: string;
  hoverImg: string;
  slug: string;
  productCount?: number;
  scope?: "domestic" | "imported";
}

export const categories: Category[] = [
  {
    id: "1",
    name: " آرایشی و بهداشتی",
    image: "/images/categories/cosmetic.png",
    hoverImg: "/images/categories/cosmetic2.png",
    slug: "cosmetics",
    productCount: 45,
    scope: "domestic",
  },
  {
    id: "2",
    name: "لوازم التحریر",
    image: "/images/categories/stationery.png",
    hoverImg: "/images/categories/stationery3.png",
    slug: "stationery",
    productCount: 32,
    scope: "domestic",
  },
  {
    id: "3",
    name: "اکسسوری",
    image: "/images/categories/accessory.png",
    hoverImg: "/images/categories/accessory2.png",
    slug: "accessories",
    productCount: 28,
    scope: "domestic",
  },
  {
    id: "4",
    name: "لباس",
    image: "/images/categories/clothing.png",
    hoverImg: "/images/categories/clothing2.png",
    slug: "clothing",
    productCount: 56,
    scope: "domestic",
  },
  {
    id: "5",
    name: "لگو",
    image: "/images/categories/lego4.png",
    hoverImg: "/images/categories/lego2.png",
    slug: "lego",
    productCount: 45,
    scope: "imported",
  },
  {
    id: "6",
    name: "کیوتی جات",
    image: "/images/categories/cute.png",
    hoverImg: "/images/categories/cute2.png",
    slug: "cute-items",
    productCount: 32,
    scope: "imported",
  },
   {
    id: "7",
    name: "لوازم التحریر خارجی",
    image: "/images/categories/stationery.png",
    hoverImg: "/images/categories/stationery3.png",
    slug: "stationery-en",
    productCount: 32,
    scope: "imported",
  },
];
