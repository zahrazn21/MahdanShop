// app/contact/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  SendIcon,
  Camera,
  Heart,
} from "lucide-react";

// components/contact/ContactFormFields.ts
export interface ContactField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea";
  placeholder: string;
  required: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

export const contactFormFields: ContactField[] = [
  {
    name: "name",
    label: "نام و نام خانوادگی",
    type: "text",
    placeholder: "علی محمدی",
    required: true,
  },
  {
    name: "email",
    label: "ایمیل",
    type: "email",
    placeholder: "example@email.com",
    required: true,
  },
  {
    name: "subject",
    label: "موضوع",
    type: "select",
    placeholder: "انتخاب کنید",
    required: true,
    options: [
      { value: "", label: "انتخاب کنید" },
      { value: "پشتیبانی", label: "پشتیبانی محصولات" },
      { value: "سفارش", label: "پیگیری سفارش" },
      { value: "انتقاد", label: "انتقاد و پیشنهاد" },
      { value: "همکاری", label: "همکاری با ما" },
      { value: "سایر", label: "سایر موارد" },
    ],
  },
  {
    name: "message",
    label: "پیام شما",
    type: "textarea",
    placeholder: "متن پیام خود را بنویسید...",
    required: true,
    rows: 5,
  },
];

// دیتای راه‌های ارتباطی
const contactInfo = [
  {
    id: 1,
    icon: Phone,
    title: "تلفن پشتیبانی",
    value: "021-1234-5678",
    subtitle: "شنبه تا پنجشنبه ۹ الی ۱۸",
    valueDir: "ltr" as const,
  },
  {
    id: 2,
    icon: Mail,
    title: "ایمیل",
    value: "info@mahdanshop.com",
    subtitle: "۲۴ ساعته",
    valueDir: "ltr" as const,
  },
  {
    id: 3,
    icon: MapPin,
    title: "آدرس",
    value: "تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه ۲",
    subtitle: null,
    valueDir: "rtl" as const,
  },
  {
    id: 4,
    icon: Clock,
    title: "ساعات کاری",
    value: "شنبه تا پنجشنبه: ۹ صبح تا ۶ عصر",
    subtitle: "جمعه‌ها: تعطیل",
    valueDir: "rtl" as const,
  },
  {
    id: 5,
    icon: Camera,
    title: "اینستاگرام",
    value: "@mahdanshop",
    subtitle: "ما را دنبال کنید",
    valueDir: "ltr" as const,
    link: "https://instagram.com/mahdanshop",
  },
  {
    id: 6,
    icon: SendIcon,
    title: "تلگرام",
    value: "@mahdanshop",
    subtitle: "کانال تلگرام ما",
    valueDir: "ltr" as const,
    link: "https://t.me/mahdanshop",
  },
];

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // تابع handleChange با تایپ صحیح
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof ContactFormData]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // منطق ارسال فرم به سرور
    console.log("Form data:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const renderField = (field: (typeof contactFormFields)[0]) => {
    const commonClassName =
      "w-full px-4 py-3 bg-[#fdf5f9] outline-2 outline-[#f9d7e5] border border-white rounded-3xl focus:outline-pink-400  focus:ring-2 focus:ring-pink-100 transition-all";
    const fieldName = field.name as keyof ContactFormData;
    const fieldValue = formData[fieldName] || "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            key={field.name}
            name={field.name}
            value={fieldValue || ""}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className={commonClassName + " resize-none"}
          />
        );

      case "select":
        return (
          <select
            key={field.name}
            name={field.name}
            value={fieldValue || ""}
            onChange={handleChange}
            required={field.required}
            className={commonClassName}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            value={fieldValue || ""}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            className={commonClassName}
          />
        );
    }
  };
  return (
    <div className="min-h-screen  pt-12">
      <div className="container mx-auto px-4">
        {/* هدر صفحه */}
        <div className="text-center mb-12 justify-items-center grid gap-6">
          <div className=" flex items-center justify-between gap-5">
            <Image
              src="/images/love2.png"
              alt="فروشگاه مهدان"
              width={500}
              height={400}
              className="object-cover w-8 h-auto -rotate-8"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              تماس با ما
            </h2>
            <Image
              src="/images/love2.png"
              alt="فروشگاه مهدان"
              width={500}
              height={400}
              className="object-cover w-8 h-auto rotate-8"
            />
          </div>
          {/* <div className="w-20 h-1 bg-pink-500 mx-auto mb-4" /> */}
          <p className="text-pink-600 max-w-2xl mx-auto">
            خوشحال می‌شیم نظرات، پیشنهادات و سوالات شما رو بشنویم
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* بخش سمت راست: فرم تماس */}
          <div
            dir="rtl"
            className="bg-[#ffc6e2] rounded-4xl border border-white shadow-md p-6 md:p-8 order-1 lg:order-2"
          >
            <div className="flex items-center gap-2 mb-6">
              <Send className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl font-bold text-gray-800">ارسال پیام</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {contactFormFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && "*"}
                  </label>
                  {renderField(field)}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Send className="w-5 h-5" />
                ارسال پیام
              </button>

              {/* پیام موفقیت */}
              {isSubmitted && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>پیام شما با موفقیت ارسال شد</span>
                </div>
              )}
            </form>
          </div>

          {/* بخش سمت چپ: راه‌های ارتباطی */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* کارت اطلاعات تماس */}
            <div
              dir="rtl"
              className="relative bg-[#fdf5f9] rounded-4xl border border-white shadow-md p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                راه‌های ارتباطی
              </h2>
              <div className="absolute -top-12 md:-top-10 left-[40%] md:left-[43%] w-15 h-15 md:w-20 md:h-20 bg-pink-100 border-2 border-[#ffeaf2] shadow-md shadow-pink-200 rounded-full flex items-center justify-center flex-shrink-0">
                {/* <Heart className="w-10 h-10 text-pink-500 fill-pink-50" /> */}
                <Image
                  src="/images/love2.png"
                  alt="فروشگاه مهدان"
                  width={500}
                  height={400}
                  className="object-cover w-10 h-auto "
                />
              </div>

              <div className="space-y-5">
                {contactInfo.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 pb-4 ${index !== contactInfo.length - 1 ? "border-b-2 border-pink-100" : ""}`}
                  >
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-pink-500 drop-shadow-[0_2px_1px_#ff9ecef0]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.title}</p>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg font-semibold text-pink-800 hover:text-pink-600 transition-colors ${item.valueDir === "ltr" ? "dir-ltr" : ""}`}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p
                          className={`text-lg font-semibold text-pink-800 ${item.valueDir === "ltr" ? "dir-ltr" : ""}`}
                        >
                          {item.value}
                        </p>
                      )}
                      {item.subtitle && (
                        <p className="text-xs text-[#cb1f97]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* کارت شبکه‌های اجتماعی */}
            {/* <div dir='rtl' className="bg-[#fdf5f9] rounded-3xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ما را دنبال کنید</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl text-white hover:scale-105 transition-transform duration-300"
                >
                  <Instagram className="w-8 h-8" />
                  <span className="text-sm font-medium">اینستاگرام</span>
                </a>
                
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white hover:scale-105 transition-transform duration-300"
                >
                  <SendIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">تلگرام</span>
                </a>
                
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white hover:scale-105 transition-transform duration-300"
                >
                  <PhoneCall className="w-8 h-8" />
                  <span className="text-sm font-medium">واتساپ</span>
                </a>
                
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl text-white hover:scale-105 transition-transform duration-300"
                >
                  <Twitter className="w-8 h-8" />
                  <span className="text-sm font-medium">توییتر</span>
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className=" grid justify-items-center mt-5">
        <Image
          src="/images/post.png"
          alt="فروشگاه مهدان"
          width={500}
          height={400}
          className="object-cover w-2/3 h-auto content-center"
        />
      </div>
    </div>
  );
}
