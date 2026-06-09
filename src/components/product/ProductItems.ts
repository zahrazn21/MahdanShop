export type Scope = "domestic" | "imported";

export function getCategoryName(slug: string): string {
  const categories: Record<string, string> = {
    cosmetics: "لوازم آرایشی",
    skincare: "مراقبت پوست",
    makeup: "گریم حرفه‌ای",
    fragrance: "عطر و ادکلن",
    hair: "مراقبت مو",
    tool: "ابزار آرایشی",
  };
  return categories[slug] || slug;
}

export interface Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sizes?: any;
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // آپشنال برای گالری
  category: string;
  brand: string;
  scope: "domestic" | "imported" | "all";
  stock: number;
  isAvailable: boolean;
  rating: number;
  reviewCount?: number;
  description?: string;
  features?: string[]; // ویژگی‌های محصول
  ingredients?: string[]; // مواد تشکیل‌دهنده (برای لوازم آرایشی)
  howToUse?: string; // نحوه استفاده
  createdAt?: string;
  colors?: string[];
  numbers?: string[];
}

const globalForProducts = globalThis as unknown as {
  products?: Product[];
};

export const products =
  globalForProducts.products ??
  (globalForProducts.products = 
    [
    {
      id: "1",
      sizes: ["5ml", "10ml", "15ml"],
      name: "رژ لب مایع مات شیگلم",
      slug: "sheglam-matte-liquid-lipstick",
      price: 420000,
      originalPrice: 520000,
      image: "/images/products/1-1.png",
      images: [
        // 👈 آرایه تصاویر اضافی
        "/images/products/1-1.png",
        "/images/products/1-2.png",
      ],
      category: "cosmetics",
      brand: "Sheglam",
      scope: "imported",
      stock: 12,
      colors: ["قرمز", "صورتی", "نود", "بنفش", "مرجانی"],
      isAvailable: true,
      rating: 4.5,
      reviewCount: 34,
      description:
        "رژ لب مایع مات با فرمولاسیون فوق‌العاده سبک و ماندگاری بالا تا 12 ساعت...",
      features: [
        "ماندگاری 12 ساعته",
        "بافت مخملی و مات",
        "بدون خشکی و ترک خوردگی",
      ],
      howToUse: "قبل از استفاده، لب‌ها را با بالم لب مرطوب کنید...",
      ingredients: ["ویتامین E", "روغن جوجوبا", "کره شی باتر"],
      createdAt: "2025-01-10",
    },
    {
      id: "2",
      sizes: ["5ml", "10ml", "15ml"],

      name: "دفتر پلنر فانتزی کره‌ای",
      slug: "korean-planner-notebook",
      price: 185000,
      image: "/images/products/2-1.png",
      images: [
        // 👈 گالری برای دفتر
        "/images/products/2-1.png",
        "/images/products/2-2.png",
        "/images/products/2-3.png",
      ],
      category: "stationery",
      brand: "Iconic",
      scope: "imported",
      stock: 25,
      isAvailable: true,
      rating: 4.8,
      reviewCount: 12,
      description: "دفتر برنامه‌ریزی روزانه با طراحی جذاب و کاور مقاوم...",
      features: ["جلد سخت و مقاوم", "120 برگ با کیفیت", "کش لاستیکی"],
      createdAt: "2025-01-12",
      numbers: ["01", "02", "03", "04", "05", "06", "07", "08"],
    },
    {
      id: "3",

      name: "مداد رنگی 24 رنگ آریا",
      slug: "aria-colored-pencils-24",
      price: 95000,
      image: "/images/products/8-1.png",
      images: [
        // 👈 گالری برای مداد رنگی
        "/images/products/8-1.png",
        "/images/products/8-2.png",
      ],
      category: "stationery",
      brand: "Aria",
      scope: "domestic",
      stock: 50,
      isAvailable: true,
      rating: 4.3,
      reviewCount: 55,
      description: "مداد رنگی حرفه‌ای با مغزی نرم و مقاوم...",
      features: ["24 رنگ متنوع", "مغزی نرم", "رنگ‌دهی عالی"],
      createdAt: "2025-01-15",
    },
    {
      id: "4",

      name: "کرم مرطوب کننده دست شون",
      slug: "schon-hand-cream",
      price: 78000,
      image: "/images/products/4.png",
      images: [
        // 👈 گالری برای کرم دست
        "/images/products/4.png",
        "/images/products/4-1.png",
      ],
      category: "cosmetics",
      brand: "Schon",
      scope: "domestic",
      stock: 0,
      isAvailable: false,
      rating: 4.1,
      reviewCount: 18,
      description: "کرم مرطوب‌کننده دست با بافت سبک و جذب سریع...",
      features: ["جذب سریع", "حاوی آلوئه ورا", "ویتامین E"],
      ingredients: ["آلوئه ورا", "ویتامین E", "گلیسیرین"],
      howToUse: "روی دست‌های تمیز ماساژ دهید.",
      createdAt: "2025-01-18",
    },
    {
      id: "5",

      name: "پک استیکر فانتزی ژاپنی",
      slug: "japanese-sticker-pack",
      price: 120000,
      image: "/images/products/5.png",
      images: [
        // 👈 گالری برای استیکرها
        "/images/products/5.png",
        "/images/products/5-1.png",
        "/images/products/5-2.png",
        "/images/products/5-3.png",
      ],
      category: "cute-items",
      brand: "MindWave",
      scope: "imported",
      stock: 30,
      isAvailable: true,
      rating: 4.9,
      reviewCount: 72,
      description: "پک 50 عددی استیکرهای کاوایی و فانتزی...",
      features: ["50 طرح متنوع", "کیفیت چاپ عالی", "مقاوم در برابر آب"],
      createdAt: "2025-01-20",
    },
    {
      id: "7",

      name: "دفتر پلنر فانتزی کره‌ای2",
      slug: "korean-planner-notebook",
      price: 185000,
      image: "/images/products/7-1.png",
      images: [
        // 👈 گالری برای دفتر
        "/images/products/7-1.png",
        "/images/products/7-2.png",
        "/images/products/7-3.png",
      ],
      category: "stationery-en",
      brand: "Iconic",
      scope: "imported",
      stock: 25,
      isAvailable: true,
      rating: 4.8,
      reviewCount: 12,
      description: "دفتر برنامه‌ریزی روزانه با طراحی جذاب و کاور مقاوم...",
      features: ["جلد سخت و مقاوم", "120 برگ با کیفیت", "کش لاستیکی"],
      createdAt: "2025-01-12",
    },
  ]);
