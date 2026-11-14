"use client";

import { useCheckoutForm } from "@/src/shared/hooks/useCheckoutForm";
import { ShippingInfo } from "@/src/shared/types/checkout";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Home,
  Send,
  AlertCircle,
} from "lucide-react";


interface CheckoutFormProps {
  onSubmit: (data: ShippingInfo) => void;
  initialData?: ShippingInfo | null;
  isLoading?: boolean;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {message}
    </p>
  );
}

export default function CheckoutForm({
  onSubmit,
  initialData,
  isLoading = false,
}: CheckoutFormProps) {
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useCheckoutForm({
    initialData,
    onSubmit,
  });

  const inputClass = (field: keyof ShippingInfo) =>
    `w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all bg-white ${
      errors[field] && touched[field]
        ? "border-red-400"
        : "border-gray-200"
    }`;

  return (
    <form
      id="checkout-shipping-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="bg-white rounded-4xl shadow-sm shadow-pink-100 border border-white p-6"
      dir="rtl"
    >

      <div className="flex items-center gap-2 justify-center mb-8">
        <MapPin className="w-6 h-6 drop-shadow-pink-300 drop-shadow-[2px_4px_6px_rgba(236,72,153,0.15)]" />

        <h2 className="text-lg font-bold text-gray-800">
          اطلاعات ارسال
        </h2>
      </div>

      <div className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام و نام خانوادگی{" "}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                handleChange("fullName", e.target.value)
              }
              onBlur={() => handleBlur("fullName")}
              disabled={isLoading}
              placeholder="نام و نام خانوادگی را وارد کنید"
              className={`${inputClass("fullName")} pr-10 pl-4`}
            />
          </div>

          {touched.fullName && (
            <FieldError message={errors.fullName} />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره تماس{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                onBlur={() => handleBlur("phone")}
                disabled={isLoading}
                placeholder="09123456789"
                className={`${inputClass("phone")} pr-10 pl-4`}
              />
            </div>

            {touched.phone && (
              <FieldError message={errors.phone} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ایمیل (اختیاری)
            </label>

            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                onBlur={() => handleBlur("email")}
                disabled={isLoading}
                placeholder="example@email.com"
                className={`${inputClass("email")} pr-10 pl-4`}
              />
            </div>

            {touched.email && (
              <FieldError message={errors.email} />
            )}
          </div>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
          <p className="text-xs leading-5 text-amber-700">
            لطفاً{" "}
            <strong>شماره تماس شخصی و متعلق به خودتان</strong>{" "}
            را وارد کنید. این شماره برای پیگیری و هماهنگی سفارش
            استفاده خواهد شد.
          </p>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            آدرس <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Building className="absolute right-3 top-3 w-5 h-5 text-gray-400" />

            <textarea
              name="address"
              value={formData.address}
              onChange={(e) =>
                handleChange("address", e.target.value)
              }
              onBlur={() => handleBlur("address")}
              rows={3}
              disabled={isLoading}
              placeholder="خیابان، پلاک، واحد، طبقه"
              className={`${inputClass("address")} pr-10 pl-4`}
            />
          </div>

          {touched.address && (
            <FieldError message={errors.address} />
          )}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              استان <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={(e) =>
                handleChange("province", e.target.value)
              }
              onBlur={() => handleBlur("province")}
              disabled={isLoading}
              placeholder="تهران"
              className={inputClass("province")}
            />

            {touched.province && (
              <FieldError message={errors.province} />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شهر <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={(e) =>
                handleChange("city", e.target.value)
              }
              onBlur={() => handleBlur("city")}
              disabled={isLoading}
              placeholder="تهران"
              className={inputClass("city")}
            />

            {touched.city && (
              <FieldError message={errors.city} />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کد پستی یا واحد 
            </label>

            <input
              type="text"
              inputMode="numeric"
              name="postalCode"
              value={formData.postalCode}
              onChange={(e) =>
                handleChange("postalCode", e.target.value)
              }
              onBlur={() => handleBlur("postalCode")}
              disabled={isLoading}
              placeholder="1234567890"
              className={inputClass("postalCode")}
            />

            {touched.postalCode && (
              <FieldError message={errors.postalCode} />
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            آیدی تلگرام <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              name="telegramId"
              value={formData.telegramId}
              onChange={(e) =>
                handleChange("telegramId", e.target.value)
              }
              onBlur={() => handleBlur("telegramId")}
              dir="ltr"
              disabled={isLoading}
              placeholder="@username"
              className={`${inputClass("telegramId")} pr-10 pl-4 text-left`}
            />
          </div>

          {touched.telegramId && (
            <FieldError message={errors.telegramId} />
          )}

          <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
            <p className="text-xs leading-5 text-amber-700">
              لطفاً آیدی تلگرام{" "}
              <strong>حقیقی و متعلق به خودتان</strong>{" "}
              را وارد کنید. این آیدی برای پیگیری و ارتباط درباره
              سفارش استفاده می‌شود؛ لطفاً پس از ثبت سفارش آن را
              تغییر ندهید.
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            توضیحات (اختیاری)
          </label>

          <div className="relative">
            <Home className="absolute right-3 top-3 w-5 h-5 text-gray-400" />

            <textarea
              name="deliveryNote"
              value={formData.deliveryNote ?? ""}
              onChange={(e) =>
                handleChange("deliveryNote", e.target.value)
              }
              onBlur={() => handleBlur("deliveryNote")}
              rows={2}
              disabled={isLoading}
              placeholder="توضیحات اضافی برای ارسال (مثلاً کد دسترسی، زنگ بزنید و...)"
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all bg-white"
            />
          </div>
        </div>
      </div>
    </form>
  );
}