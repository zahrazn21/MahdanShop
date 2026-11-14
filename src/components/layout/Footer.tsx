import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Instagram,
  Linkedin,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const quickLinks = [
  { name: "همه محصولات", href: "/products" },
  { name: "جدیدترین‌ها", href: "/products?sortBy=newest" },
  { name: "لوازم آرایشی وارداتی", href: "/products/imported/cosmetics" },
  { name: "لوازم تحریر داخلی", href: "/products/domestic/stationery" },
  { name: "درباره ما", href: "/about" },
  { name: "تماس با ما", href: "/contact" },
];

const EMAIL = "info@mahdanshop.com";

const contactItems: {
  icon: LucideIcon;
  text: string;
  ltr?: boolean;
}[] = [
  { icon: Phone, text: "+98 21 1234 5678", ltr: true },
  { icon: Mail, text: EMAIL },
  { icon: MapPin, text: "تهران، خیابان ولیعصر، پلاک ۱۲۳" },
  { icon: Clock, text: "شنبه تا پنجشنبه: ۹ الی ۲۰" },
];

const socialLinks: {
  icon: LucideIcon;
  href: string;
  label: string;
  external?: boolean;
}[] = [
  { icon: Instagram, href: "https://instagram.com", label: "اینستاگرام", external: true },
  { icon: Twitter, href: "https://twitter.com", label: "توییتر", external: true },
  { icon: Linkedin, href: "https://linkedin.com", label: "لینکدین", external: true },
  { icon: Mail, href: `mailto:${EMAIL}`, label: "ایمیل" },
];

const columnClass = "text-center md:text-right";
const dividerClass = "md:border-l-2 md:border-[#ffdceb]";

const currentYear = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
  new Date(),
);

export default function Footer() {
  return (
    <footer>
      <div
        dir="rtl"
        style={{
          backgroundImage: "url('/images/footer2.png')",
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
        }}
        className="container mx-auto rounded-4xl border border-white px-5 py-2 md:py-8"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          <nav aria-label="لینک‌های سریع" className={`${columnClass} ${dividerClass}`}>
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              لینک‌های سریع
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ name, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-600 transition-colors hover:text-pink-600"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={`${columnClass} ${dividerClass}`}>
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              اطلاعات تماس
            </h3>
            <ul className="space-y-3">
              {contactItems.map(({ icon: Icon, text, ltr }) => (
                <li
                  key={text}
                  className="flex items-center justify-center gap-3 text-sm text-gray-600 md:justify-start"
                >
                  <Icon className="h-4 w-4 shrink-0 text-pink-500" />
                  <span dir={ltr ? "ltr" : undefined}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={columnClass}>
            <div className="mb-4 flex justify-center md:justify-start">
              <Link href="/" aria-label="صفحه اصلی مهدان شاپ">
                <Image
                  src="/images/logo2.png"
                  alt="لوگوی مهدان شاپ"
                  width={350}
                  height={460}
                  className="h-40 w-55"
                />
              </Link>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              فروشگاه آنلاین لوازم آرایشی، لوازم تحریر و آیتم‌های فانتزی با
              بهترین کیفیت و قیمت.
            </p>

            <div className="flex justify-center gap-3 md:justify-start">
              {socialLinks.map(({ icon: Icon, href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white transition duration-200 hover:scale-110 hover:bg-pink-600"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="my-2 text-center">
        <p className="text-xs text-gray-500">
          © {currentYear} تمامی حقوق برای فروشگاه مهدان محفوظ است.
        </p>
      </div>
    </footer>
  );
}