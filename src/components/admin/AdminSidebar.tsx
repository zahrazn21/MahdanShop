"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Users,
  Settings,
  LogOut,
  X,
  PanelRightClose,
  PanelRightOpen,
  MessageSquare,
  Menu,
  BookOpen,
  Truck,
  ReceiptText,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "داشبورد",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "محصولات",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "دوره‌ها",
    href: "/admin/batches",
    icon: BookOpen,
  },
  {
    title: "سفارش‌ ها",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "مرسوله ها",
    href: "/admin/shipments",
    icon: Truck,
  },
  {
    title:"بدهی‌های ارسال و باربری",
    href: "/admin/shipping-debts",
    icon: ReceiptText,
  },
  {
    title: "پرداخت‌ها",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "کاربران",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "نظرات",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "تنظیمات",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label="باز کردن منو"
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          right-4
          top-10
          z-30
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-gray-200
          bg-white
          text-gray-700
          shadow-sm
          transition
          hover:bg-gray-50
          lg:hidden
        "
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed
          right-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          border-l
          border-gray-200
          bg-white
          shadow-xl
          transition-all
          duration-300
          ease-in-out

          w-72

          ${mobileOpen ? "translate-x-0" : "translate-x-full"}

          lg:sticky
          lg:top-0
          lg:h-screen
          lg:translate-x-0
          lg:shadow-sm

          ${collapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div
          className={`
            flex
            h-18
            shrink-0
            items-center
            border-b
            border-gray-100

            ${collapsed ? "lg:justify-center lg:px-3" : "justify-between px-5"}
          `}
        >
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white">
              <ShoppingBag size={21} />
            </div>

            <div
              className={`
                min-w-0
                ${collapsed ? "hidden lg:hidden" : ""}
              `}
            >
              <p className="truncate font-black text-gray-800">پنل مدیریت</p>

              <p className="mt-0.5 text-[11px] text-gray-400">مدیریت فروشگاه</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="بستن منو"
            className="
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              lg:hidden
            "
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "باز کردن سایدبار" : "جمع کردن سایدبار"}
            className="
              hidden
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
              lg:block
            "
          >
            {collapsed ? (
              <PanelRightOpen size={19} />
            ) : (
              <PanelRightClose size={19} />
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-bold text-gray-400">
              منوی مدیریت
            </p>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.title : undefined}
                  className={`
                    relative
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition

                    ${collapsed ? "lg:justify-center" : ""}

                    ${
                      isActive
                        ? "bg-pink-50 text-pink-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    size={19}
                    className={`
                      shrink-0
                      ${isActive ? "text-pink-500" : "text-gray-400"}
                    `}
                  />

                  {!collapsed && <span className="truncate">{item.title}</span>}

                  {isActive && !collapsed && (
                    <span className="mr-auto h-2 w-2 shrink-0 rounded-full bg-pink-500" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="shrink-0 border-t border-gray-100 p-3 lg:p-4">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? "خروج از حساب" : undefined}
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-medium
              text-red-500
              transition
              hover:bg-red-50

              ${collapsed ? "lg:justify-center" : ""}
            `}
          >
            <LogOut size={19} className="shrink-0" />

            {!collapsed && <span className="truncate">خروج از حساب</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
