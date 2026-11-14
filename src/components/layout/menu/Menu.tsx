"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  Headphones,
  Home,
  LucideIcon,
  Package,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { categories } from "../../categories/CategoryItems";

export interface MenuItem {
  name: string;
  link?: string;
  icon: LucideIcon;
  type: "link" | "category";
}

export const menuItems: MenuItem[] = [
  { name: "خانه", link: "/", icon: Home, type: "link" },
  {
    name: "محصولات",
    link: "/products?sortBy=newest",
    icon: Sparkles,
    type: "link",
  },
  { name: "دسته‌بندی", icon: Package, type: "category" },
  { name: "درباره ما", link: "/about", icon: UsersRound, type: "link" },
  { name: "تماس با ما", link: "/contact", icon: Headphones, type: "link" },
];

const categoryGroups = [
  { id: "beauty", name: "زیبایی و مراقبت" },
  { id: "shop", name: "فروشگاه" },
] as const;

type GroupId = (typeof categoryGroups)[number]["id"];

const itemClass =
  "flex items-center gap-2 px-3 py-2 text-[14px] font-medium text-pink-900 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors";

export default function Menu() {
  return <DesktopMenu />;
}

function DesktopMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeGroup, setActiveGroup] = useState<GroupId>(categoryGroups[0].id);
  const categoryRef = useRef<HTMLLIElement>(null);

  const showMega = isOpen || isHovered;

  const closeMenu = () => {
    setIsOpen(false);
    setIsHovered(false);
  };

  useEffect(() => {
    if (!showMega) return;

    const handleClick = (e: MouseEvent) => {
      if (!categoryRef.current?.contains(e.target as Node)) closeMenu();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showMega]);

  return (
    <ul dir="rtl" className="hidden lg:flex items-center gap-1 xl:gap-2">
      {menuItems.map((item) =>
        item.type === "link" ? (
          <li key={item.name}>
            <Link href={item.link!} className={itemClass}>
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          </li>
        ) : (
          <li
            key={item.name}
            ref={categoryRef}
            onMouseEnter={() => {
              setIsHovered(true);
              setActiveGroup(categoryGroups[0].id);
            }}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              onClick={() => setIsOpen((v) => !v)}
              className={itemClass}
              aria-expanded={showMega}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showMega ? "rotate-180" : ""}`}
              />
            </button>

            {showMega && (
              <MegaMenu
                activeGroup={activeGroup}
                onGroupChange={setActiveGroup}
                onNavigate={closeMenu}
              />
            )}
          </li>
        ),
      )}
    </ul>
  );
}

function MegaMenu({
  activeGroup,
  onGroupChange,
  onNavigate,
}: {
  activeGroup: GroupId;
  onGroupChange: (id: GroupId) => void;
  onNavigate: () => void;
}) {
  const visibleCategories = categories.filter((c) => c.group === activeGroup);

  return (
    <div className="absolute top-full right-0 w-full pt-3 z-50">
      <div className="bg-(--color-pink-light) rounded-3xl shadow-xl border border-gray-100 p-2 flex justify-between items-start">
        <PromoBanner
          href="/products?scope=imported"
          image="/images/bannermobile7_updated.png"
          title="محصولات وارداتی"
          widthClass="w-60"
          bgPosition="bg-bottom"
          variant="arrow"
          onNavigate={onNavigate}
        />

        <div className="flex-auto relative mx-2">
          <div className="flex border-b border-b-pink-200 px-2">
            {categoryGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => onGroupChange(group.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeGroup === group.id
                    ? "bg-pink-50 text-pink-600"
                    : "text-pink-900 hover:text-pink-600"
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>

          <div className="py-2 grid grid-cols-2 divide-x divide-x-reverse divide-pink-50">
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                onClick={onNavigate}
                className="text-sm text-pink-800 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <div className="p-2 mx-3 border-b-2 border-b-pink-50 flex justify-between items-center gap-2">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={300}
                    className="w-17 h-15 object-cover"
                  />
                  {category.name}
                  <ChevronLeft className="w-4 h-4 text-pink-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <PromoBanner
          href="/products?scope=domestic"
          image="/images/bannermobile6_cleaned.png"
          title="محصولات موجود در ایران"
          widthClass="w-80"
          bgPosition="bg-right"
          variant="plain"
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

function PromoBanner({
  href,
  onNavigate,
  image,
  title,
  widthClass,
  bgPosition,
  variant,
}: {
  href: string;
  onNavigate: () => void;
  image: string;
  title: string;
  widthClass: string;
  bgPosition: string;
  variant: "arrow" | "plain";
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative block ${widthClass} h-80 rounded-2xl overflow-hidden group`}
    >
      <div
        className={`absolute inset-0 bg-cover ${bgPosition} transition-transform duration-500 group-hover:scale-105`}
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />

      <div className="absolute top-6 right-5 bg-white/90 backdrop-blur-sm text-pink-800 font-bold px-4 py-2 rounded-xl shadow-sm">
        {title}
      </div>

      <div className="absolute left-5 bottom-10">
        {variant === "arrow" ? (
          <div className="group/button relative w-25 h-8 px-5 rounded-2xl flex items-center bg-(--color-pink-light) hover:bg-(--color-pink-dark) text-pink-800 hover:text-white font-medium transition-all duration-300">
            خرید
            <ChevronLeft className="absolute top-0 left-0 w-8 h-8 p-2 rounded-full bg-(--color-pink) text-(--color-pink-light) group-hover/button:bg-(--color-pink-light) group-hover/button:text-pink-800 transition-colors" />
          </div>
        ) : (
          <div className="w-25 h-8 rounded-[10px] grid place-content-center text-center bg-(--color-pink) hover:bg-(--color-pink-dark) text-white transition-colors">
            خرید
          </div>
        )}
      </div>
    </Link>
  );
}
