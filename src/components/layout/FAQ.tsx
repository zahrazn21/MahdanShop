"use client";
import { ChevronDown, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "چطور می‌توانم سفارشم را ثبت کنم؟",
      answer:
        "ثبت سفارش بسیار ساده است:\n\n📌 روش اول (آنلاین):\n۱. محصول مورد نظر را به سبد خرید اضافه کنید\n۲. وارد حساب کاربری خود شوید یا ثبت‌نام کنید\n۳. آدرس و اطلاعات تحویل را وارد کنید\n۴. روش پرداخت را انتخاب کنید\n۵. فاکتور نهایی را بررسی و تأیید کنید\n\n📌 روش دوم (تلفنی):\nبا شماره ۱۲۳۴۵۶۷۸ تماس بگیرید و کارشناسان ما سفارش شما را ثبت می‌کنند\n\n📌 روش سوم (واتساپ):\nاز طریق شماره ۰۹۱۲۳۴۵۶۷۸ در واتساپ پیام دهید\n\nپس از ثبت سفارش، کد رهگیری برای شما ارسال خواهد شد.",
    },
    {
      question: "چگونه می‌توانم سفارش خود را پیگیری کنم؟",
      answer:
        "پس از ثبت سفارش، کد رهگیری برای شما پیامک می‌شود و می‌توانید از طریق بخش پیگیری سفارش در سایت، وضعیت آن را مشاهده کنید.",
    },

    {
      question: "زمان تحویل سفارش چقدر است؟",
      answer:
        "زمان تحویل سفارش‌های تهران بین ۲۴ تا ۴۸ ساعت و شهرستان‌ها بین ۳ تا ۵ روز کاری می‌باشد.",
    },
    {
      question: "هزینه ارسال چگونه محاسبه می‌شود؟",
      answer:
        "هزینه ارسال بر اساس وزن بسته و مبدأ مقصد محاسبه می‌شود. سفارش‌های بالای ۵۰۰ هزار تومان ارسال رایگان هستند.",
    },
    {
      question: "اگر محصول مشکلی داشت چطور می‌توانم مرجوع کنم؟",
      answer:
        "در صورت داشتن هرگونه مشکل (خرابی، نقص فنی، یا مغایرت با مشخصات)، می‌توانید ظرف ۷ روز کاری از تاریخ تحویل، محصول را مرجوع کنید. مراحل مرجوع کردن:\n\n۱. تماس با پشتیبانی به شماره ۱۲۳۴۵۶۷۸\n۲. ثبت درخواست مرجوعی در پنل کاربری\n۳. ارسال عکس و فیلم از مشکل محصول\n۴. پس از تأیید، محصول توسط پیک ما دریافت می‌شود\n۵. هزینه بازگشت کالا در صورت تأیید مشکل به عهده فروشگاه است\n\nتوجه: محصول باید در بسته‌بندی اصلی و بدون هیچ آسیبی باشد.",
    },
  ];

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" mx-4  p-4 " dir="rtl">
      <div className="space-y-6 md:flex justify-between w-full">
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2  border-pink-100 rounded-3xl overflow-hidden bg-white transition-all hover:border-pink-200"
            >
              <button
                className={`w-full px-6 py-2 text-right flex justify-between items-center transition-all ${
                  openIndex === index
                    ? "bg-pink-50"
                    : "bg-white hover:bg-pink-50/50"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <span
                  className={`font-semibold text-[11px] md:text-sm text-right ${
                    openIndex === index ? "text-pink-600" : "text-gray-700"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`text-pink-500 text-2xl transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown />
                </span>
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-96 py-4" : "max-h-0"
                }`}
              >
                <p className="px-6 text-gray-600 leading-relaxed whitespace-pre-line text-right">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Image
          className=" w-fit h-full object-cover "
          src="/images/FAQ.png"
          alt="not found"
          width={400}
          height={400}
        />
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm">
          هنوز سوالی داری؟ با ما تماس بگیرید
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <a
            href="tel:12345678"
            className="text-pink-600 font-semibold hover:underline"
          >
            📞 ۱۲۳۴۵۶۷۸
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="mailto:support@site.com"
            className="text-pink-600 font-semibold hover:underline"
          >
            📧 support@site.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
