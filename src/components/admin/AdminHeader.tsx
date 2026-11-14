"use client";

import { Bell, Search, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  AdminNotification,
  AdminNotificationDropdown,
} from "./AdminNotificationDropdown";
import { useCallback, useEffect, useState } from "react";

interface AdminHeaderProps {
  user: {
    id: string;
    role: string;
    username?: string | null;
    email?: string | null;
  };
}

const pageTitles: Record<string, string> = {
  "/admin": "داشبورد",
  "/admin/products": "مدیریت محصولات",
  "/admin/orders": "مدیریت سفارش‌ها",
  "/admin/payments": "مدیریت پرداخت‌ها",
  "/admin/users": "مدیریت کاربران",
  "/admin/reviews": "مدیریت نظرات",
  "/admin/settings": "تنظیمات",
};

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/admin/orders/") ? "جزئیات سفارش" : "پنل مدیریت");

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setNotifications(data.notifications ?? []);
    } catch (error) {
      console.error("Admin notification load error:", error);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadNotifications();
    }, 0);
    const interval = window.setInterval(() => {
      loadNotifications();
    }, 15000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [loadNotifications]);

  const handleNotificationClick = async (notification: AdminNotification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      ),
    );

    try {
      const response = await fetch(
        `/api/admin/notifications/${encodeURIComponent(notification.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        await loadNotifications();
      }
    } catch (error) {
      console.error("Admin mark notification as read error:", error);

      await loadNotifications();
    }
  };

  return (
    <header
      className="
        top-0
        z-20
        h-18
        border-b
        border-gray-200
        bg-white/95
        backdrop-blur
      "
    >
      <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <div className="mr-14 min-w-0 lg:mr-0">
            <h1 className="truncate text-base font-black text-gray-800 sm:text-lg">
              {title}
            </h1>

            <p className="mt-0.5 hidden text-xs text-gray-400 sm:block">
              مدیریت و کنترل فروشگاه
            </p>
          </div>

          <div className="hidden w-56 xl:block">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
              <Search size={17} className="shrink-0 text-gray-400" />

              <input
                type="text"
                placeholder="جستجو..."
                className="
                  w-full
                  bg-transparent
                  text-sm
                  text-gray-700
                  outline-none
                  placeholder:text-gray-400
                "
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationOpen((current) => !current)}
              aria-label="اعلان‌های ادمین"
              className={`
                relative flex h-10 w-10
                items-center justify-center
                rounded-xl
                transition
                ${
                  notificationOpen
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-500 hover:bg-gray-50"
                }
              `}
            >
              <Bell size={19} />

              {notifications.some((notification) => !notification.read) && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white" />
              )}
            </button>

            <AdminNotificationDropdown
              notifications={notifications}
              open={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              onNotificationClick={handleNotificationClick}
            />
          </div>

          <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-left sm:block">
              <p className="max-w-35 truncate text-sm font-bold text-gray-700">
                {user.username || "مدیر"}
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">مدیر سیستم</p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
              <UserCircle size={24} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
