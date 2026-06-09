// lib/validations/productValidation.ts
import { categories } from "@/src/components/categories/CategoryItems";
import { z } from "zod";


export const categorySlugs = categories.map(cat => cat.slug);
const CategoryEnum = z.enum(categorySlugs as [string, ...string[]]);

// اسکیما برای محصول (برای اعتبارسنجی)
export const ProductValidationSchema = z.object({
  name: z.string().min(3, "نام محصول حداقل ۳ کاراکتر باید باشد"),
  slug: z.string().min(1, "slug الزامی است"),
  price: z.number().positive("قیمت باید مثبت باشد"),
  originalPrice: z.number().positive().optional(),
  image: z.string().min(1, "تصویر محصول الزامی است"),
  images: z.array(z.string()).optional(),
  category: CategoryEnum, // استفاده از enum داینامیک
  brand: z.string().min(2, "برند حداقل ۲ کاراکتر باید باشد"),
  scope: z.enum(["domestic", "imported","all"], {
    message: "نوع محصول نامعتبر است",
  }),
  stock: z.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
  isAvailable: z.boolean(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  howToUse: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

export const ProductFormSchema = z.object({
  name: z.string().min(3, "نام محصول حداقل ۳ کاراکتر"),
  price: z.string().min(1, "قیمت الزامی است").transform(Number),
  originalPrice: z.string().optional().transform(val => val ? Number(val) : undefined),
  image: z.string().min(1, "تصویر الزامی است"),
  images: z.array(z.string()).optional(),
  category: CategoryEnum,
  brand: z.string().min(2, "برند حداقل ۲ کاراکتر"),
  scope: z.enum(["domestic", "imported"]),
  stock: z.string().min(1, "موجودی الزامی است").transform(Number),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  howToUse: z.string().optional(),
});

// نوع استخراج شده از اسکیما
export type ProductValidation = z.infer<typeof ProductValidationSchema>;
export type ProductFormValidation = z.infer<typeof ProductFormSchema>;