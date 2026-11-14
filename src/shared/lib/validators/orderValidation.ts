
import { z } from "zod";

export const ShippingInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد"),

  phone: z
    .string()
    .trim()
    .regex(/^09[0-9]{9}$/, "شماره تماس معتبر نیست"),

  email: z
    .string()
    .trim()
    .email("ایمیل معتبر نیست")
    .or(z.literal("")),

  telegramId: z
    .string()
    .trim()
    .regex(
      /^@[a-zA-Z0-9_]{5,32}$/,
      "آیدی تلگرام معتبر نیست؛ مثال: @username",
    ),

  address: z
    .string()
    .trim()
    .min(5, "آدرس باید حداقل ۵ کاراکتر باشد"),

  city: z
    .string()
    .trim()
    .min(2, "شهر را وارد کنید"),

  province: z
    .string()
    .trim()
    .min(2, "استان را وارد کنید"),

  postalCode: z
    .string()
    .optional(),

  deliveryNote: z
    .string()
    .optional(),
});

export const CreateOrderSchema = z.object({
  shippingInfo: ShippingInfoSchema,

  paymentMethod: z.literal("CARD_TO_CARD"),

  shippingPaymentMode: z
    .enum(["IMMEDIATE", "DEFERRED"])
    .default("IMMEDIATE"),

  importedFreightAccepted: z
    .boolean()
    .default(false),

  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        variantId: z.string().nullish(),
        selectedColor: z.string().nullish(),
        selectedSize: z.string().nullish(),
        selectedNumber: z.string().nullish(),
      }),
    )
    .min(1, "سبد خرید نمی‌تواند خالی باشد"),
});

export type ShippingInfo = z.infer<typeof ShippingInfoSchema>;

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;