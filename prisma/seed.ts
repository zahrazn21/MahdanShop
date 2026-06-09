// import { PrismaClient } from '@prisma/client'
// import bcrypt from "bcryptjs"

// const prisma = new PrismaClient()

// async function main() {
//   const hashed = await bcrypt.hash("123456", 10)

//   await prisma.user.create({
//     data: {
//       email: "admin@test.com",
//       password: hashed
//     }
//   })
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//   })
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.createMany({
    data:  [
  {
    sizes: ["5ml", "10ml", "15ml"],
    name: "رژ لب مایع مات شیگلم",
    slug: "sheglam-matte-liquid-lipstick",
    price: 420000,
    originalPrice: 520000,
    image: "/images/products/1-1.png",
    images: [
      "/images/products/1-1.png",
      "/images/products/1-2.png",
    ],
    category: "cosmetics",
    brand: "Sheglam",
    scope: "imported",
    stock: 12,
    colors: ["قرمز", "صورتی", "نود", "بنفش", "مرجانی"],
    numbers: [],
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
  },

  {
    sizes: ["5ml", "10ml", "15ml"],
    name: "دفتر پلنر فانتزی کره‌ای",
    slug: "korean-planner-notebook",
    price: 185000,
    originalPrice: null,
    image: "/images/products/2-1.png",
    images: [
      "/images/products/2-1.png",
      "/images/products/2-2.png",
      "/images/products/2-3.png",
    ],
    category: "stationery",
    brand: "Iconic",
    scope: "imported",
    stock: 25,
    colors: [],
    numbers: ["01", "02", "03", "04", "05", "06", "07", "08"],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 12,
    description: "دفتر برنامه‌ریزی روزانه با طراحی جذاب و کاور مقاوم...",
    features: ["جلد سخت و مقاوم", "120 برگ با کیفیت", "کش لاستیکی"],
    howToUse: null,
    ingredients: [],
  },

  {
    sizes: [],
    name: "مداد رنگی 24 رنگ آریا",
    slug: "aria-colored-pencils-24",
    price: 95000,
    originalPrice: null,
    image: "/images/products/8-1.png",
    images: [
      "/images/products/8-1.png",
      "/images/products/8-2.png",
    ],
    category: "stationery",
    brand: "Aria",
    scope: "domestic",
    stock: 50,
    colors: [],
    numbers: [],
    isAvailable: true,
    rating: 4.3,
    reviewCount: 55,
    description: "مداد رنگی حرفه‌ای با مغزی نرم و مقاوم...",
    features: ["24 رنگ متنوع", "مغزی نرم", "رنگ‌دهی عالی"],
    howToUse: null,
    ingredients: [],
  },

  {
    sizes: [],
    name: "کرم مرطوب کننده دست شون",
    slug: "schon-hand-cream",
    price: 78000,
    originalPrice: null,
    image: "/images/products/4.png",
    images: [
      "/images/products/4.png",
      "/images/products/4-1.png",
    ],
    category: "cosmetics",
    brand: "Schon",
    scope: "domestic",
    stock: 0,
    colors: [],
    numbers: [],
    isAvailable: false,
    rating: 4.1,
    reviewCount: 18,
    description: "کرم مرطوب‌کننده دست با بافت سبک و جذب سریع...",
    features: ["جذب سریع", "حاوی آلوئه ورا", "ویتامین E"],
    howToUse: "روی دست‌های تمیز ماساژ دهید.",
    ingredients: ["آلوئه ورا", "ویتامین E", "گلیسیرین"],
  },

  {
    sizes: [],
    name: "پک استیکر فانتزی ژاپنی",
    slug: "japanese-sticker-pack",
    price: 120000,
    originalPrice: null,
    image: "/images/products/5.png",
    images: [
      "/images/products/5.png",
      "/images/products/5-1.png",
      "/images/products/5-2.png",
      "/images/products/5-3.png",
    ],
    category: "cute-items",
    brand: "MindWave",
    scope: "imported",
    stock: 30,
    colors: [],
    numbers: [],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 72,
    description: "پک 50 عددی استیکرهای کاوایی و فانتزی...",
    features: [
      "50 طرح متنوع",
      "کیفیت چاپ عالی",
      "مقاوم در برابر آب",
    ],
    howToUse: null,
    ingredients: [],
  },

  {
    sizes: [],
    name: "دفتر پلنر فانتزی کره‌ای 2",
    slug: "korean-planner-notebook-2",
    price: 185000,
    originalPrice: null,
    image: "/images/products/7-1.png",
    images: [
      "/images/products/7-1.png",
      "/images/products/7-2.png",
      "/images/products/7-3.png",
    ],
    category: "stationery-en",
    brand: "Iconic",
    scope: "imported",
    stock: 25,
    colors: [],
    numbers: [],
    isAvailable: true,
    rating: 4.8,
    reviewCount: 12,
    description: "دفتر برنامه‌ریزی روزانه با طراحی جذاب و کاور مقاوم...",
    features: ["جلد سخت و مقاوم", "120 برگ با کیفیت", "کش لاستیکی"],
    howToUse: null,
    ingredients: [],
  },
],

    skipDuplicates: true,
  });

  console.log("✅ Products seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });