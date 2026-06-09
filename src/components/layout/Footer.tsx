// components/footer/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* بخش پایین فوتر: خدمات */}
      <div className="sm:mx-7   mb-2">

      </div>
      <div
        dir="rtl"
        style={{
          backgroundImage: "url('/images/footer2.png')",
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
        }}
        className=" rounded-4xl border border-white container mx-auto px-5 md:py-8 py-2"
      >
        {/* سه بخش اصلی */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* بخش دوم: لینک‌های سریع */}
          <div className="md:border-l-2 md:border-[#ffdceb] text-center md:text-right">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              لینک‌های سریع
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
                >
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sortBy=newest"
                  className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
                >
                  جدیدترین‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/products/imported/cosmetics"
                  className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
                >
                  لوازم آرایشی وارداتی
                </Link>
              </li>
              <li>
                <Link
                  href="/products/domestic/stationery"
                  className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
                >
                  لوازم تحریر داخلی
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* بخش سوم: اطلاعات تماس و ساعات کاری */}
          <div className="md:border-l-2 md:border-[#ffdceb] text-center md:text-right ">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              اطلاعات تماس
            </h3>
            <ul dir="rtl" className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 text-sm">
                <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span dir="ltr">+98 21 1234 5678</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>info@mahdanshop.com</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-gray-600 text-sm">
                <Clock className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>شنبه تا پنجشنبه: ۹ الی ۲۰</span>
              </li>
            </ul>
          </div>

          {/* بخش اول: لوگو و شبکه‌های اجتماعی */}
          <div className="text-center md:text-right">
            {/* لوگو */}
            <div className="flex justify-center md:justify-start mb-4">
              <Link href="/">
                <Image
                  src="/images/logo2.png"
                  alt="فروشگاه"
                  width={350}
                  height={460}
                  className="h-40 w-55"
                />
              </Link>
            </div>

            {/* توضیحات */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              فروشگاه آنلاین لوازم آرایشی، لوازم تحریر و آیتم‌های فانتزی با
              بهترین کیفیت و قیمت.
            </p>

            {/* شبکه‌های اجتماعی */}
            <div className="flex justify-center md:justify-start gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors hover:scale-110 transform duration-200"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors hover:scale-110 transform duration-200"
                aria-label="توییتر"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors hover:scale-110 transform duration-200"
                aria-label="لینکدین"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@shop.com"
                className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors hover:scale-110 transform duration-200"
                aria-label="ایمیل"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* خط جداکننده */}
        {/* <div className="border-t border-pink-200 my-8"></div> */}
      </div>
      {/* کپی‌رایت */}
      <div className="text-center my-2">
        <p className="text-gray-500 text-xs">
          © {currentYear} تمامی حقوق برای فروشگاه مهدان محفوظ است.
        </p>
      </div>
    </footer>
  );
}
