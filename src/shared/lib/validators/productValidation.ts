import { categories } from "@/src/components/categories/CategoryItems";
import { z } from "zod";

export const categorySlugs = categories.map((cat) => cat.slug);
const CategoryEnum = z.enum(categorySlugs as [string, ...string[]]);

export type ProductSpecification = {
  key: string;
  label: string;
  value: string;
};

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "نام تنوع الزامی است"),
  hexCode: z.string().optional(),
  colorName: z.string().optional(),
  stock: z.coerce.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
  price: z.coerce.number().min(0, "قیمت نمی‌تواند منفی باشد"),
  size: z.string().optional(),
  volume: z.coerce.number().min(0, "حجم نمی‌تواند منفی باشد").optional(),
  volumeUnit: z.enum(["ml", "gr", "oz"]).optional(),
  sku: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductValidationSchema = z.object({
  name: z.string().min(3, "نام محصول حداقل ۳ کاراکتر باید باشد"),
  slug: z.string().min(1, "slug الزامی است"),
  price: z.number().positive("قیمت باید مثبت باشد"),
  originalPrice: z.number().positive().optional(),
  image: z.string().min(1, "تصویر محصول الزامی است"),
  images: z.array(z.string()).optional(),
  category: CategoryEnum,
  brand: z.string().min(2, "برند حداقل ۲ کاراکتر باید باشد").optional(),
  scope: z.enum(["domestic", "imported", "all"], {
    message: "نوع محصول نامعتبر است",
  }),
  availabilityType: z.enum(["IN_STOCK", "PRE_ORDER"]).default("IN_STOCK"),
  estimatedDeliveryDays: z.number().int().min(0).optional(),
  preOrderNote: z.string().optional(),
  batchId: z.string().nullable().optional(),
  stock: z.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
  isAvailable: z.boolean(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  howToUse: z.string().optional(),
  shippingClass: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  sku: z.string().optional(),
  weight: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "OUT_OF_STOCK", "ARCHIVED"]),
  expirationDate: z.string().optional(),
  variants: z.array(ProductVariantSchema).optional(),
  specifications: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

export const ProductFormSchema = z.object({
  name: z.string().min(3, "نام محصول حداقل ۳ کاراکتر"),
  price: z.coerce.number().min(0, "قیمت الزامی است"),
  originalPrice: z
    .string()
    .optional()
    .transform((value) =>
      value && value.trim() !== "" ? Number(value) : undefined,
    ),
  image: z.string().min(1, "تصویر الزامی است"),
  images: z.array(z.string()).optional(),
  category: CategoryEnum,
  brand: z.string().min(2, "برند حداقل ۲ کاراکتر").optional(),
  scope: z.enum(["domestic", "imported", "all"]),
  availabilityType: z.enum(["IN_STOCK", "PRE_ORDER"]).default("IN_STOCK"),
  estimatedDeliveryDays: z.coerce.number().int().min(0).optional(),
  preOrderNote: z.string().optional(),
  batchId: z.string().nullable().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  howToUse: z.string().optional(),
  shippingClass: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  sku: z.string().optional(),
  weight: z.coerce.number().min(0, "وزن نمی‌تواند منفی باشد").optional(),
  status: z.enum(["ACTIVE", "DRAFT", "OUT_OF_STOCK", "ARCHIVED"]),
  expirationDate: z.string().optional(),
  variants: z.array(ProductVariantSchema).optional(),
  stock: z.coerce.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
  slug: z.string().optional(),
  specifications: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

export type ProductValidation = z.infer<typeof ProductValidationSchema>;
export type ProductSubmitData = z.infer<typeof ProductFormSchema>;

export type ProductVariantFormData = {
  id: string;
  name: string;
  hexCode: string;
  colorName: string;
  stock: string;
  price: string;
  size: string;
  volume: string;
  volumeUnit: "ml" | "gr" | "oz";
  sku: string;
  images: string[];
};

export type ProductFormData = {
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  images: string[];
  category: string;
  brand: string;
  scope: "domestic" | "imported" | "all";
  availabilityType: "IN_STOCK" | "PRE_ORDER";
  estimatedDeliveryDays: string;
  preOrderNote: string;
  batchId: string | null;
  stock: string;
  description: string;
  features: string[];
  ingredients: string[];
  howToUse: string;
  slug: string;
  shippingClass: "SMALL" | "MEDIUM" | "LARGE";
  sku: string;
  weight: string;
  status: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";
  expirationDate?: string | null;
  specifications: ProductSpecification[];
  variants: ProductVariantFormData[];
};