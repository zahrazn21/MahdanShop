"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  CreditCard,
  Headphones,
  Package,
  RotateCcw,
  Truck,
} from "lucide-react";

type CategoryId =
  | "order"
  | "shipping"
  | "preorder"
  | "support";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  id: CategoryId;
  title: string;
  description: string;
  icon: React.ElementType;
  faqs: FAQItem[];
};

const categories: FAQCategory[] = [
  {
    id: "order",
    title: "سفارش و پرداخت",
    description: "ثبت سفارش، پرداخت و پیگیری وضعیت سفارش",
    icon: CreditCard,
    faqs: [
      {
        question: "چطور می‌توانم سفارش ثبت کنم؟",
        answer:
          "ثبت سفارش بسیار ساده است:\n\n۱. محصول موردنظر را به سبد خرید اضافه کنید\n۲. وارد حساب کاربری خود شوید یا ثبت‌نام کنید\n۳. آدرس و اطلاعات تحویل را وارد کنید\n۴. روش پرداخت را انتخاب کنید\n۵. فاکتور نهایی را بررسی و تأیید کنید\n\nپس از ثبت موفق سفارش و تأیید پرداخت، اطلاعات سفارش در حساب کاربری شما قابل مشاهده خواهد بود.",
      },
      {
        question: "چگونه می‌توانم وضعیت سفارش خود را ببینم؟",
        answer:
          "از طریق حساب کاربری و بخش «سفارش‌های من» می‌توانید جزئیات سفارش، وضعیت پرداخت، وضعیت آماده‌سازی و اطلاعات مربوط به مرسوله را مشاهده کنید.\n\nاگر سفارش شما شامل هزینه ارسال یا باربری باشد، وضعیت آن‌ها نیز در بخش‌های مربوطه نمایش داده می‌شود.",
      },
      {
        question: "آیا می‌توانم سفارش خود را لغو یا ویرایش کنم؟",
        answer:
          "اگر سفارش هنوز وارد مراحل نهایی پردازش یا تهیه نشده باشد، ممکن است امکان لغو یا تغییر آن وجود داشته باشد.\n\nبرای سفارش‌های پیش‌سفارش، به دلیل فرآیند تهیه کالا، امکان لغو یا تغییر ممکن است محدودتر باشد.\n\nبرای بررسی وضعیت سفارش، قبل از هر اقدامی با پشتیبانی تماس بگیرید.",
      },
      {
        question: "اگر پرداخت سفارش من تأیید نشود چه می‌شود؟",
        answer:
          "اگر پرداخت یا رسید پرداخت شما تأیید نشود، وضعیت پرداخت سفارش در حساب کاربری شما نمایش داده می‌شود.\n\nدر صورت رد شدن رسید، معمولاً دلیل رد شدن نیز مشخص خواهد شد و در صورت نیاز می‌توانید رسید جدید ارسال کنید.",
      },
    ],
  },

  {
    id: "shipping",
    title: "ارسال داخلی",
    description: "هزینه ارسال، بسته‌بندی و بدهی ارسال",
    icon: Truck,
    faqs: [
      {
        question: "هزینه ارسال داخلی چگونه محاسبه می‌شود؟",
        answer:
          "هزینه ارسال داخلی بر اساس حجم و نوع بسته‌بندی محصولات محاسبه می‌شود.\n\nمحصولات دارای کلاس ارسال مختلف هستند و با توجه به مجموع حجم سفارش، مناسب‌ترین بسته‌بندی برای آن انتخاب می‌شود.\n\nبنابراین ممکن است چند محصول در یک بسته قرار بگیرند و هزینه ارسال آن‌ها به‌صورت یک بسته محاسبه شود.",
      },
      {
        question: "آیا می‌توانم هزینه ارسال داخلی را بعداً پرداخت کنم؟",
        answer:
          "بله. در صورت فعال بودن گزینه پرداخت مؤخر، می‌توانید هنگام ثبت سفارش فقط مبلغ کالا را پرداخت کرده و هزینه ارسال داخلی را به زمان آماده‌شدن بسته موکول کنید.\n\nدر این حالت، هزینه ارسال به‌عنوان «بدهی ارسال» در حساب کاربری شما ثبت می‌شود.",
      },
      {
        question: "چرا مبلغ بدهی ارسال ممکن است بعداً تغییر کند؟",
        answer:
          "در حالت پرداخت مؤخر، هزینه ارسال بر اساس بسته‌بندی نهایی محاسبه می‌شود.\n\nاگر قبل از ارسال، سفارش‌های دیگری ثبت کنید و امکان قرارگرفتن محصولات آن‌ها در همان بسته وجود داشته باشد، محصولات می‌توانند در یک بسته تجمیع شوند.\n\nدر نتیجه ممکن است هزینه نهایی ارسال نسبت به حالتی که هر سفارش جداگانه ارسال شود متفاوت باشد.\n\nمبلغ قابل پرداخت همیشه از بخش «بدهی‌های ارسال» در حساب کاربری قابل مشاهده است.",
      },
      {
        question: "مهلت پرداخت بدهی ارسال چقدر است؟",
        answer:
          "برای بدهی ارسال داخلی، مهلت پرداخت از زمان ایجاد بسته ارسال محاسبه می‌شود و حداکثر یک ماه در نظر گرفته می‌شود.\n\nتوصیه می‌کنیم بدهی ارسال را در مهلت تعیین‌شده پرداخت کنید تا سفارش شما بدون تأخیر اضافی وارد مرحله ارسال شود.",
      },
      {
        question: "چگونه بدهی ارسال خود را پرداخت کنم؟",
        answer:
          "به بخش «بدهی‌های ارسال» در حساب کاربری بروید. در این بخش مبلغ بدهی و اطلاعات مربوط به پرداخت نمایش داده می‌شود.\n\nپس از پرداخت، رسید پرداخت را ثبت و ارسال کنید. وضعیت رسید پس از بررسی توسط کارشناسان مشخص خواهد شد.",
      },
      {
        question: "اگر رسید پرداخت هزینه ارسال رد شود چه اتفاقی می‌افتد؟",
        answer:
          "در صورت رد شدن رسید، بدهی ارسال شما از بین نمی‌رود و همچنان در بخش «بدهی‌های ارسال» قابل مشاهده خواهد بود.\n\nدلیل رد شدن رسید نیز نمایش داده می‌شود تا بتوانید مشکل را برطرف کرده و رسید جدیدی ارسال کنید.",
      },
    ],
  },

  {
    id: "preorder",
    title: "پیش‌سفارش و باربری",
    description: "محصولات پیش‌سفارش و هزینه باربری وارداتی",
    icon: Package,
    faqs: [
      {
        question: "تفاوت محصول موجود و پیش‌سفارش چیست؟",
        answer:
          "محصولات موجود، در حال حاضر آماده ارسال هستند و پس از تکمیل مراحل سفارش برای ارسال آماده می‌شوند.\n\nمحصولات پیش‌سفارش ابتدا برای شما ثبت و تهیه می‌شوند و زمان آماده‌شدن و تحویل آن‌ها ممکن است بیشتر از محصولات موجود باشد.\n\nزمان تقریبی تحویل، در صورت وجود، در صفحه همان محصول نمایش داده می‌شود.",
      },
      {
        question: "باربری محصولات پیش‌سفارش چیست؟",
        answer:
          "برخی محصولات پیش‌سفارش از خارج از کشور تهیه می‌شوند و علاوه بر هزینه خرید محصول، ممکن است هزینه باربری وارداتی داشته باشند.\n\nهزینه باربری وارداتی با هزینه ارسال داخلی متفاوت است و مبلغ آن ممکن است تا زمان مشخص‌شدن وزن واقعی یا هزینه حمل، نهایی نشده باشد.\n\nپس از مشخص‌شدن هزینه باربری، مبلغ قابل پرداخت در حساب کاربری شما اعلام می‌شود.",
      },
      {
        question: "آیا هزینه باربری وارداتی با هزینه ارسال داخلی یکی است؟",
        answer:
          "خیر.\n\nهزینه ارسال داخلی مربوط به ارسال بسته از محل فروشگاه تا آدرس شما در داخل کشور است.\n\nهزینه باربری وارداتی مربوط به انتقال محصول پیش‌سفارش از مبدأ خارجی تا رسیدن آن به کشور و آماده‌شدن برای ارسال داخلی است.\n\nممکن است یک سفارش هم‌زمان شامل بدهی باربری وارداتی و بدهی ارسال داخلی باشد.",
      },
      {
        question: "چه زمانی هزینه باربری وارداتی مشخص می‌شود؟",
        answer:
          "هزینه باربری وارداتی ممکن است در زمان ثبت پیش‌سفارش هنوز مشخص نباشد.\n\nپس از مشخص‌شدن اطلاعات لازم مانند وزن واقعی یا هزینه حمل، مبلغ نهایی محاسبه و در حساب کاربری شما نمایش داده می‌شود.",
      },
      {
        question: "آیا هزینه باربری مهلت یک‌ماهه دارد؟",
        answer:
          "خیر. مهلت یک‌ماهه مربوط به بدهی ارسال داخلی است و شامل هزینه باربری وارداتی نمی‌شود.\n\nهزینه باربری وارداتی پس از مشخص‌شدن مبلغ، طبق وضعیت پرداخت اعلام‌شده در حساب کاربری قابل پرداخت خواهد بود.",
      },
    ],
  },

  {
    id: "support",
    title: "مرجوعی و پشتیبانی",
    description: "مشکل محصول، مرجوعی و ارتباط با پشتیبانی",
    icon: Headphones,
    faqs: [
      {
        question: "اگر محصولی که دریافت کردم مشکل داشت چه کار کنم؟",
        answer:
          "اگر محصول دچار مشکل، نقص یا مغایرت با اطلاعات ثبت‌شده باشد، در اسرع وقت با پشتیبانی تماس بگیرید و موضوع را اعلام کنید.\n\nدر صورت نیاز، ممکن است از شما درخواست شود عکس یا ویدئوی محصول و مشکل آن را ارسال کنید تا درخواست شما بررسی شود.\n\nشرایط و امکان مرجوعی بسته به نوع مشکل و وضعیت محصول بررسی خواهد شد.",
      },
      {
        question: "شرایط مرجوعی کالا چیست؟",
        answer:
          "امکان مرجوعی بسته به نوع محصول، دلیل درخواست و وضعیت کالا بررسی می‌شود.\n\nبرای شروع فرآیند، ابتدا درخواست خود را از طریق راه‌های ارتباطی پشتیبانی اعلام کنید تا شرایط و مراحل لازم به شما اطلاع داده شود.",
      },
      {
        question: "اگر رسید پرداخت من رد شود باید چه کار کنم؟",
        answer:
          "در صورت رد شدن رسید پرداخت، ابتدا دلیل رد شدن را در حساب کاربری بررسی کنید.\n\nاگر امکان پرداخت مجدد وجود داشته باشد، می‌توانید پس از اصلاح مشکل، رسید جدید ارسال کنید.\n\nبدهی مربوط به پرداخت ردشده همچنان در حساب شما باقی خواهد ماند تا پرداخت و رسید جدید تأیید شود.",
      },
      {
        question: "چگونه با پشتیبانی تماس بگیرم؟",
        answer:
          "اگر پاسخ سوال خود را در این بخش پیدا نکردید، می‌توانید از طریق راه‌های ارتباطی اعلام‌شده در سایت با پشتیبانی تماس بگیرید.\n\nهنگام پیگیری سفارش، بهتر است شماره سفارش خود را نیز در اختیار داشته باشید تا بررسی سریع‌تر انجام شود.",
      },
    ],
  },
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] =
    useState<CategoryId>("order");

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentCategory = useMemo(
    () =>
      categories.find(
        (category) => category.id === activeCategory,
      ) ?? categories[0],
    [activeCategory],
  );

  const handleCategoryChange = (id: CategoryId) => {
    setActiveCategory(id);
    setOpenIndex(0);
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) =>
      current === index ? null : index,
    );
  };

  return (
    <section
      dir="rtl"
      className="mx-4 px-4 py-8 md:mx-8 lg:mx-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center md:mb-10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
            <Headphones size={24} />
          </div>

          <h2 className="text-2xl font-black text-gray-900 md:text-3xl">
            چطور می‌تونیم کمکت کنیم؟
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            سوالات متداولت درباره سفارش، پرداخت، ارسال و
            پیش‌سفارش را اینجا پیدا کن.
          </p>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive =
              activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  handleCategoryChange(category.id)
                }
                className={`
                  group rounded-2xl border p-4 text-right
                  transition-all duration-300
                  ${
                    isActive
                      ? "border-pink-200 bg-pink-50 shadow-sm"
                      : "border-gray-100 bg-white hover:border-pink-100 hover:bg-pink-50/40"
                  }
                `}
              >
                <div
                  className={`
                    mb-3 flex h-10 w-10 items-center justify-center
                    rounded-xl transition-all
                    ${
                      isActive
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-pink-100 group-hover:text-pink-600"
                    }
                  `}
                >
                  <Icon size={19} />
                </div>

                <p
                  className={`
                    text-sm font-black
                    ${
                      isActive
                        ? "text-pink-700"
                        : "text-gray-800"
                    }
                  `}
                >
                  {category.title}
                </p>

                <p className="mt-1 hidden text-[11px] leading-5 text-gray-400 sm:block">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {currentCategory.title}
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {currentCategory.description}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-500">
                {currentCategory.faqs.length} سوال
              </span>
            </div>
            <div className="space-y-3">
              {currentCategory.faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`
                      overflow-hidden rounded-2xl border
                      transition-all duration-300
                      ${
                        isOpen
                          ? "border-pink-200 bg-pink-50/50 shadow-sm"
                          : "border-gray-100 bg-white hover:border-pink-100"
                      }
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 px-4 py-4 text-right md:px-5"
                    >
                      <span
                        className={`
                          flex h-8 w-8 shrink-0 items-center justify-center
                          rounded-xl text-[11px] font-black
                          transition-all
                          ${
                            isOpen
                              ? "bg-pink-600 text-white"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {String(index + 1).padStart(2, "۰")}
                      </span>

                      <span
                        className={`
                          flex-1 text-sm font-bold leading-6
                          ${
                            isOpen
                              ? "text-pink-700"
                              : "text-gray-800"
                          }
                        `}
                      >
                        {faq.question}
                      </span>

                      <span
                        className={`
                          flex h-8 w-8 shrink-0 items-center justify-center
                          rounded-full transition-all
                          ${
                            isOpen
                              ? "bg-white text-pink-600"
                              : "bg-gray-50 text-gray-400"
                          }
                        `}
                      >
                        <ChevronDown
                          size={17}
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>

                    <div
                      className={`
                        grid transition-all duration-300 ease-in-out
                        ${
                          isOpen
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-pink-100/70 px-5 pb-5 pt-4">
                          <p className="whitespace-pre-line text-sm leading-8 text-gray-600">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="order-first lg:order-last lg:sticky lg:top-6">
            <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-pink-50 via-white to-rose-100 p-5 md:p-7">
              <div className="relative z-10">
                <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-pink-600 shadow-sm">
                  {currentCategory.title}
                </span>

                <h3 className="mt-4 text-xl font-black leading-8 text-gray-900 md:text-2xl">
                  پاسخ سوالاتت
                  <br />
                  همین‌جاست
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-gray-500">
                  موضوع موردنظرت را انتخاب کن تا سوالات و
                  راهنمای مربوط به همان بخش را ببینی.
                </p>
              </div>
              <div className="relative mt-4 flex justify-center">
                <Image
                  src="/images/FAQ.png"
                  alt="سوالات متداول"
                  width={420}
                  height={420}
                  priority
                  className="h-auto w-full max-w-82.5 object-contain"
                />
              </div>

              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-pink-200/40 blur-3xl" />
              <div className="absolute -right-10 top-20 h-28 w-28 rounded-full bg-rose-200/30 blur-3xl" />
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-4xl bg-[#ffcccc] p-6 text-pink-700 md:mt-10 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                  <Headphones size={18} />
                </div>

                <span className="text-sm font-bold text-pink-500">
                  پاسخ سوالت را پیدا نکردی؟
                </span>
              </div>

              <h3 className="mt-3 text-lg font-black md:text-xl">
                با پشتیبانی در ارتباط باش
              </h3>

              <p className="mt-1 text-xs leading-6 text-gray-900">
                شماره سفارش را هنگام پیگیری در اختیار داشته باش.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:12345678"
                className="rounded-xl bg-pink-600 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-pink-700"
              >
                تماس با پشتیبانی
              </a>

              <a
                href="mailto:support@site.com"
                className="rounded-xl border border-white/10 bg-white px-6 py-3 text-center text-sm font-bold text-gray-800 transition hover:bg-white/70"
              >
                ایمیل پشتیبانی
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQ;
