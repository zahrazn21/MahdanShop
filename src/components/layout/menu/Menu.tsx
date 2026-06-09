/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BotOffIcon,
  Brush,
  ChevronDown,
  ChevronRight,
  EggOff,
  Headphones,
  ListPlus,
  Menu as MenuIcon,
  Tag,
  User,
  UserPlus,
  UsersRound,
  WandSparkles,
  X,
} from "lucide-react";
import Image from "next/image";
// components/menu/menuData.ts
import {
  Home,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Package,
  Globe,
  Flag,
  NotebookPen,
  Cat,
  ToyBrick,
  Shirt,
  Watch,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

export interface SubCategory {
  name: string;
  link: string;
  icon?: any;
  image?: string;
}

export interface Category {
  name: string;
  scope: "imported" | "domestic";
  subCategories: SubCategory[];
}

export interface MenuItem {
  name: string;
  link?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  type?: "link" | "category";
  categories?: Category[];
}

const importedCategories: Category[] = [
  {
    name: "وارداتی",
    scope: "imported",
    subCategories: [
      {
        name: "لوازم التحریر خارجی",
        link: "/products/imported/stationery-en",
        icon: NotebookPen,
        image: "/images/categories/stationery.png",
      },
      {
        name: "لوازم آرایشی خارجی",
        link: "/products/imported/cosmetics",
        icon: WandSparkles,
        image: "/images/categories/cosmetic.png",
      },
      {
        name: "کیوتی جات",
        link: "/products/imported/cute-items",
        icon: Cat,
        image: "/images/categories/cute.png",
      },
      {
        name: "لگو",
        link: "/products/imported/lego",
        icon: ToyBrick,
        image: "/images/categories/lego4.png",
      },
      {
        name: "اکسسوری",
        link: "/products/imported/accessories",
        icon: Watch,
        image: "/images/categories/accessory.png",
      },
    ],
  },
];

const domesticCategories: Category[] = [
  {
    name: "داخلی",
    scope: "domestic",
    subCategories: [
      {
        name: "لوازم التحریر ایرانی",
        link: "/products/domestic/stationery",
        icon: NotebookPen,
        image: "/images/categories/stationery.png",
      },
      {
        name: "لوازم آرایشی ایرانی",
        link: "/products/domestic/cosmetics",
        icon: WandSparkles,
        image: "/images/categories/cosmetic.png",
      },
      {
        name: "لباس",
        link: "/products/domestic/clothing",
        icon: Shirt,
        image: "/images/categories/clothing.png",
      },
      {
        name: "اکسسوری",
        link: "/products/domestic/accessories",
        icon: Watch,
        image: "/images/categories/accessory.png",
      },
    ],
  },
];

export const menuItems: MenuItem[] = [
  {
    name: "خانه",
    link: "/",
    icon: Home,
    type: "link",
  },
  {
    name: "محصولات",
    icon: Package,
    type: "category",
    categories: [...importedCategories, ...domesticCategories],
  },
  {
    name: "جدیدترین‌ها",
    link: "/products?sortBy=newest",
    icon: Sparkles,
    type: "link",
  },
   {
    name: "درباره ما",
    link: "/about",
    icon: UsersRound,
    type: "link",
  },
  {
    name: "تماس با ما ",
    link: "/contact",
    icon: Headphones ,
    type: "link",
  },
];

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
  };

  const handleBack = () => {
    setActiveCategory(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveCategory(null);
  };



  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-pink-100 transition-colors z-50 relative"
        aria-label="منو"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-pink-600" />
        ) : (
          <MenuIcon className="w-7 h-7 text-pink-600" />
        )}
      </button>

      <DesktopMenu onCategoryClick={handleCategoryClick} />

      <MobileMenu
        isOpen={isOpen}
        onClose={handleClose}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
        onBack={handleBack}
      />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function DesktopMenu({
  onCategoryClick,
}: {
  onCategoryClick: (category: Category) => void;
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <ul dir="rtl" className="hidden lg:flex items-center gap-1 xl:gap-2">
      {menuItems.map((item) => (
        <li dir="rtl" key={item.name} className="">
          <div
            onMouseEnter={() => {
              if (item.type === "category") {
                setHoveredItem(item.name);
                setHoveredCategory(item.categories?.[0] || null);
              }
            }}
            onMouseLeave={() => {
              if (openMenu !== item.name) {
                setHoveredItem(null);
                setHoveredCategory(null);
              }
            }}
            className="relative"
          >
            {item.type === "link" ? (
              <Link
                href={item.link!}
                className="text-pink-900 flex items-center gap-2 px-3 py-2 text-sm xl:text-base font-medium hover:text-pink-600 transition-colors rounded-lg hover:bg-pink-50"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (openMenu === item.name) {
                    setOpenMenu(null);
                    setHoveredItem(null);
                    setHoveredCategory(null);
                  } else {
                    setOpenMenu(item.name);
                    setHoveredItem(item.name);
                    setHoveredCategory(item.categories?.[0] || null);
                  }
                }}
                className=" flex items-center gap-2 px-3 py-2 text-sm xl:text-base font-medium text-pink-900 hover:text-pink-600 transition-colors rounded-lg hover:bg-pink-50"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${openMenu === item.name ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          {item.type === "category" &&
            (hoveredItem === item.name || openMenu === item.name) &&
            hoveredCategory && (
              <div
                className="absolute top-full right-0 mt-3 w-full bg-(--color-pink-light) rounded-3xl shadow-xl border border-gray-100 z-50 p-2 flex justify-between items-top"
                onMouseEnter={() => {
                  if (hoveredItem !== item.name && openMenu !== item.name) {
                    setHoveredItem(item.name);
                    setHoveredCategory(item.categories?.[0] || null);
                  }
                }}
                onMouseLeave={() => {
                  if (openMenu !== item.name) {
                    setHoveredItem(null);
                    setHoveredCategory(null);
                  }
                }}
              >
                <div
                  className="relative w-60 rounded-2xl h-80 "
                  style={{
                    backgroundImage: "url('/images/bannermobile7_updated.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "bottom",
                  }}
                >
                  <div className=" absolute left-5 bottom-10 ">
                    <button className="group relative rounded-2xl w-25 h-8 py-4 px-5 bg-(--color-pink-light) hover:bg-(--color-pink-dark) text-pink-800 font-medium hover:text-white flex items-center justify-start transition-all duration-300 ">
                      خرید
                      <ChevronLeft className="group-hover:bg-(--color-pink-light) group-hover:text-pink-800 absolute top-0 left-0 rounded-full w-8 h-8 p-2 bg-(--color-pink) text-(--color-pink-light)" />
                    </button>
                  </div>
                </div>
                <div className="flex-auto relative h-full mx-2 ">
                  <div className="absolute -top-10 left-79 w-0 h-0 border-l-20 border-r-20 border-b-20 border-l-transparent border-r-transparent border-b-[#ebaec1] "></div>

                  <div className="absolute -top-7 left-79 w-0 h-0 border-l-20 border-r-20 border-b-20 border-l-transparent border-r-transparent border-b-(--color-pink-light) "></div>

                  <div className="flex border-b border-b-pink-200 px-2">
                    {item.categories?.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setHoveredCategory(cat)}
                        className={`flex-1  px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          hoveredCategory?.name === cat.name
                            ? "bg-pink-50 text-pink-600"
                            : "text-pink-900 hover:text-pink-600"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* زیرمجموعه‌ها */}
                  <div className=" py-2 grid  grid-cols-2 [&>a:last-child]:border-b-0 [&>a:nth-last-child(2)]:border-b-0 ">
                    <div className="absolute w-px h-[80%]  top-15 left-1/2 border-r-2 border-r-pink-50" />
                    {hoveredCategory.subCategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.link}
                        className={`   items-center  text-sm text-pink-800 hover:bg-pink-50 hover:text-pink-600  transition-colors  `}
                        onClick={() => {
                          if (openMenu !== item.name) {
                            setHoveredItem(null);
                            setHoveredCategory(null);
                          }
                        }}
                      >
                        <div className="text-sm border-b-2 border-b-pink-50 mx-3 flex justify-between items-center gap-2 ">
                          {sub.image && (
                            <Image
                              src={sub.image}
                              alt="description"
                              width={400}
                              height={300}
                              className="w-18 h-22 object-cover  self-center"
                            />
                          )}
                          {sub.name}
                          <ChevronLeft
                            className={`w-4 h-4 transition-transform text-pink-300`}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div
                  className="relative w-80  rounded-2xl h-80 "
                  style={{
                    backgroundImage: "url('/images/bannermobile6_cleaned.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "right",
                  }}
                >
                  <button className="absolute left-5 bottom-10 rounded-[10px] w-25 h-8 py-2 px-2 bg-(--color-pink) hover:bg-(--color-pink-dark) text-white grid text-center place-content-center place-items-center">
                    خرید
                  </button>
                </div>
              </div>
            )}
        </li>
      ))}
    </ul>
  );
}
// ============ منوی موبایل ============
function MobileMenu({
  isOpen,
  onClose,
  activeCategory,
  onCategoryClick,
  onBack,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: Category | null;
  onCategoryClick: (category: Category) => void;
  onBack: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 bottom-0 w-70 bg-white shadow-2xl z-50 flex flex-col lg:hidden">
        <div className="flex justify-end items-center p-4 ">
          {/* <span className="font-bold text-pink-600">منو</span> */}
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-pink-50">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="gap-5 place-content-center justify-center justify-items-center items-center grid">
          <Image
            src="/images/logomobile2.png"
            alt="description"
            width={300}
            height={400}
            className="w-40  self-center"
          />
          <p className="text-[14px]">❤️ به مهدان شاپ خوش آمدید</p>
        </div>
        <div className=" my-5 gap-3 place-content-center justify-center justify-items-center items-center grid">
          <button className="flex items-center text-[14px] justify-end gap-5 bg-linear-to-t to-60% to-pink-300 via-10%  via-pink-400 bg-pink-500 w-60 h-10 p-2 rounded-xl text-white">
            <p>ورود به حساب کاربری</p>
            <User></User>
          </button>
          <button className="flex items-center text-[14px] justify-end gap-12.5 bg-white border border-(--color-pink-dark) text-(--color-pink-dark) w-60 h-10 p-2 rounded-xl ">
            <p>عضویت</p>
            <UserPlus></UserPlus>
          </button>{" "}
        </div>

        <div dir="rtl" className="flex-1 overflow-y-auto p-2">
          {activeCategory === null ? (
            <div className="space-y-1">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.type === "link" ? (
                    <Link
                      href={item.link!}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-3 text-gray-700 rounded-lg hover:bg-pink-50 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-pink-500" />
                      <span>{item.name}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() =>
                        item.categories && onCategoryClick(item.categories[0])
                      }
                      className="w-full flex items-center justify-between px-3 py-3 text-gray-700 rounded-lg hover:bg-pink-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-pink-500" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-pink-600 mb-2"
              >
                <ChevronRight className="w-4 h-4" />
                بازگشت
              </button>

              <div className="flex gap-2 p-2 bg-gray-100 rounded-xl mb-3">
                {menuItems
                  .find((item) => item.type === "category")
                  ?.categories?.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => onCategoryClick(cat)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeCategory.name === cat.name
                          ? "bg-pink-500 text-white"
                          : "text-gray-600 hover:bg-pink-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>

              <div className="space-y-1">
                {activeCategory.subCategories.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.link}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 text-gray-600 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    {sub.icon && <sub.icon className="w-4 h-4 text-pink-500" />}
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
