"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Star,
  Package,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  Truck,
  ShoppingBag,
} from "lucide-react";

type ProfileUser = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  points: number;
  orders?: unknown[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          setUser(null);
          return;
        }

        setUser(data);
      } catch (error) {
        console.error("PROFILE FETCH ERROR:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <main
        className="min-h-screen px-4 py-8"
        dir="rtl"
      >
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pink-500" />

            <p className="text-sm font-medium text-gray-500">
              در حال دریافت اطلاعات پروفایل...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        className="min-h-screen bg-gray-50 px-4 py-8"
        dir="rtl"
      >
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
          <div className="w-full rounded-4xl border border-gray-100 bg-white p-7 text-center shadow-sm sm:p-9">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50">
              <User
                size={30}
                className="text-pink-500"
              />
            </div>

            <h1 className="text-lg font-black text-gray-900">
              ورود به حساب کاربری
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              برای مشاهده پروفایل و سفارش‌های خود ابتدا وارد حساب کاربری شوید.
            </p>

            <Link
              href="/login"
              className="mt-6 flex min-h-12 items-center justify-center rounded-2xl bg-pink-500 px-6 text-sm font-bold text-white transition hover:bg-pink-600 active:scale-[0.98]"
            >
              ورود به حساب
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const orderCount = user.orders?.length ?? 0;

  return (
    <main
      className="min-h-screen px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-5"
      dir="rtl"
    >
      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">

        <section className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm sm:rounded-4xl">
          <div className="bg-linear-to-l from-pink-50 via-white to-white px-4 py-6 sm:px-7 sm:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pink-500 shadow-sm shadow-pink-200 sm:h-20 sm:w-20">
                  <User
                    size={32}
                    className="text-white sm:h-9 sm:w-9"
                  />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <h1 className="truncate text-xl font-black text-gray-900 sm:text-2xl">
                      {user.username}
                    </h1>

                    {user.role === "ADMIN" && (
                      <span className="shrink-0 rounded-full bg-gray-900 px-2.5 py-1 text-[10px] font-bold text-white">
                        مدیر
                      </span>
                    )}
                  </div>
                  <p
                    dir="ltr"
                    className="truncate text-sm text-gray-500 sm:text-base"
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-[0.98] sm:flex-none"
                  >
                    <LayoutDashboard size={19} />
                    پنل مدیریت
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                >
                  <LogOut
                    size={19}
                    className="rotate-180"
                  />

                  {loggingOut ? "در حال خروج..." : "خروج از حساب"}
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-gray-100 sm:grid-cols-4">
            <StatCard
              icon={<ShoppingBag size={19} />}
              label="سفارش‌ها"
              value={orderCount.toLocaleString("fa-IR")}
            />

            <StatCard
              icon={<Star size={19} />}
              label="امتیاز"
              value={user.points.toLocaleString("fa-IR")}
              accent
            />

            <StatCard
              icon={<Package size={19} />}
              label="وضعیت حساب"
              value="فعال"
            />

            <StatCard
              icon={<User size={19} />}
              label="نوع حساب"
              value={user.role === "ADMIN" ? "مدیر" : "کاربر"}
            />
          </div>
        </section>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfileActionCard
            href="/profile/orders"
            icon={<Package size={23} />}
            iconClass="bg-pink-50 text-pink-500"
            title="سفارش‌های من"
            description="مشاهده سفارش‌ها، وضعیت پرداخت و جزئیات خرید"
            buttonText="مشاهده سفارش‌ها"
          />
          <ProfileActionCard
            href="/profile/shipping-debts"
            icon={<Truck size={23} />}
            iconClass="bg-amber-50 text-amber-600"
            title="بدهی‌های ارسال من"
            description="مشاهده و پرداخت هزینه ارسال داخلی و باربری"
            buttonText="مشاهده بدهی‌های ارسال"
            warning
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-l border-gray-100 px-3 py-4 text-center last:border-l-0 sm:px-4 sm:py-5">
      <div
        className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${
          accent
            ? "bg-pink-50 text-pink-500"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <p className="text-[11px] text-gray-500 sm:text-xs">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-black sm:text-base ${
          accent ? "text-pink-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  direction = "rtl",
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  direction?: "rtl" | "ltr";
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 transition hover:border-gray-200 hover:bg-gray-50">
      <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
        <span className="text-gray-400">
          {icon}
        </span>

        <span>{title}</span>
      </div>

      <p
        dir={direction}
        className={`mt-2 wrap-break-word text-sm font-black sm:text-base ${
          highlight ? "text-pink-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ProfileActionCard({
  href,
  icon,
  iconClass,
  title,
  description,
  buttonText,
  warning = false,
}: {
  href: string;
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  buttonText: string;
  warning?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-[1.75rem] border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-[2rem] sm:p-6 ${
        warning
          ? "border-amber-100 hover:border-amber-200"
          : "border-pink-100 hover:border-pink-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition group-hover:bg-gray-100 group-hover:text-gray-700">
          <ChevronLeft size={19} />
        </div>
      </div>

      <h2 className="mt-5 text-base font-black text-gray-900 sm:text-lg">
        {title}
      </h2>

      <p className="mt-2 min-h-12 text-xs leading-6 text-gray-500 sm:text-sm">
        {description}
      </p>

      <div
        className={`mt-5 flex min-h-11 items-center justify-center rounded-xl px-4 text-xs font-bold transition sm:text-sm ${
          warning
            ? "bg-amber-50 text-amber-700 group-hover:bg-amber-100"
            : "bg-pink-50 text-pink-600 group-hover:bg-pink-100"
        }`}
      >
        {buttonText}
      </div>
    </Link>
  );
}
