"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Handbag, Heart, Search, UserRound } from "lucide-react";

import Menu from "./menu/Menu";
import SearchBox from "./SearchBox";
import SearchBoxMobile from "./SearchBoxMobile";
import MobileSearchOverlay from "./MobileSearchOverlay";
import { NotificationDropdown } from "./NotificationDropdown";
import type { Notification } from "@/src/shared/types/notifications";
import { useCartActions } from "@/src/shared/hooks/useCart";

type User = {
  username?: string;
};

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const desktopNotificationRef = useRef<HTMLDivElement>(null);
  const mobileNotificationRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCartActions();

  useEffect(() => {
    if (!notificationOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideDesktop =
        desktopNotificationRef.current?.contains(target);
      const clickedInsideMobile =
        mobileNotificationRef.current?.contains(target);

      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationOpen]);
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
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
      console.error("Notification load error:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timeout = window.setTimeout(() => {
      loadNotifications();
    }, 0);

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, loadNotifications]);

  const username = user?.username
    ? user.username.length > 7
      ? `${user.username.slice(0, 7)}...`
      : user.username
    : "";

  const openMobileSearch = () => setMobileSearchOpen(true);
  const closeMobileSearch = () => setMobileSearchOpen(false);

  const toggleNotifications = () => {
    setNotificationOpen((prev) => !prev);

    if (!notificationOpen) {
      loadNotifications();
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      const response = await fetch(
        `/api/notifications/${encodeURIComponent(notification.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        setNotifications((current) =>
          current.filter((item) => item.id !== notification.id),
        );
      } else {
        await loadNotifications();
      }
    } catch (error) {
      console.error("Mark notification as read error:", error);
      await loadNotifications();
    }
  };

  const handleViewAllNotifications = async () => {
    const unreadNotifications = notifications;

    try {
      const results = await Promise.all(
        unreadNotifications.map((notification) =>
          fetch(`/api/notifications/${encodeURIComponent(notification.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          }),
        ),
      );

      const failed = results.some((response) => !response.ok);

      if (failed) {
        await loadNotifications();
        return;
      }
      setNotifications([]);
      setNotificationOpen(false);
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      await loadNotifications();
    } finally {
      router.push("/profile/shipping-debts");
    }
  };

  return (
    <div className="mb-5 w-full">
      <nav
        dir="rtl"
        className="
          relative my-4 flex items-center rounded-3xl py-
          md:mx-4 md:my-8 md:h-16 md:gap-0
          md:bg-(--color-pink-light)
          md:px-5
          md:shadow-[3px_2px_29px_rgba(207,68,119,72%)]
          justify-between
          
        "
      >
        <div className="hidden md:block md:w-32 " />
        <div className="absolute -right-2 top-1 hidden -translate-y-1/4 drop-shadow-[2px_2px_6px_rgba(190,64,126,59%)] md:block">
          <Image
            src="/images/logo2.png"
            alt="Logo"
            width={400}
            height={400}
            className="md:w-40"
          />
        </div>
        <div className="ml-auto flex justify-evenly items-center">
          <SearchBox />
          <Menu />
        </div>
        <div
          className={`
            relative top-0 z-50 mb-5 w-full
            transition-all duration-300 ease-in-out
            md:hidden
            ${scrolled ? "h-16 shadow-sm" : "h-full max-h-12"}
          `}
        >
          <div
            className={`
              flex w-full items-center
              transition-all duration-300
              ${
                scrolled
                  ? "fixed left-0 top-0 z-50 justify-between bg-white px-4 py-2"
                  : "justify-center"
              }
            `}
          >
            <Image
              src="/images/logoMobile3.png"
              alt="Logo"
              width={300}
              height={400}
              priority
              className={`
                object-contain
                transition-all duration-300 ease-in-out
                ${scrolled ? "h-auto w-18" : "h-auto w-40"}
              `}
            />
            <div
              className={`
                flex items-center
                transition-all duration-300 ease-in-out
                ${scrolled ? "mr-auto gap-2" : "pointer-events-none mt-2 hidden"}
              `}
            >
              <button
                type="button"
                onClick={openMobileSearch}
                aria-label="جستجو"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100 active:scale-95"
              >
                <Search size={19} />
              </button>
              <div className="relative" ref={mobileNotificationRef}>
                <button
                  type="button"
                  onClick={toggleNotifications}
                  aria-label="اعلان‌ها"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-gray-100 active:scale-95"
                >
                  <Bell size={19} />

                  {notifications.length > 0 && (
                    <NotificationBadge count={notifications.length} mobile />
                  )}
                </button>

                {notificationOpen && (
                  <NotificationDropdown
                    notifications={notifications}
                    open={notificationOpen}
                    onClose={() => setNotificationOpen(false)}
                    onNotificationClick={handleNotificationClick}
                    onViewAll={handleViewAllNotifications}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          dir="ltr"
          className="hidden items-center justify-between gap-4 text-pink-800 md:flex"
        >
          <Link
            href="/profile"
            className="flex items-center justify-center transition-all duration-500 hover:text-pink-500"
          >
            <UserRound className="h-6 w-6" />
            <p className="mt-2 font-bold">{username}</p>
          </Link>

          <Divider />

          <Link href="/favorites">
            <Heart className="h-6 w-6 transition-all duration-500 hover:text-pink-500" />
          </Link>

          <Divider />

          <Link
            href="/cart"
            className="relative flex items-center justify-center"
            aria-label={`سبد خرید${itemCount > 0 ? `، ${itemCount} کالا` : ""}`}
          >
            <Handbag className="h-6 w-6 transition-all duration-500 hover:text-pink-500" />

            {itemCount > 0 && <CartBadge count={itemCount} />}
          </Link>
          <Divider />
          <div ref={desktopNotificationRef} className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              aria-label="اعلان‌ها"
              className="relative flex items-center justify-center"
            >
              <Bell className="h-6 w-6 transition-all duration-500 hover:text-pink-500" />

              {notifications.length > 0 && (
                <NotificationBadge count={notifications.length} />
              )}
            </button>

            {notificationOpen && (
              <NotificationDropdown
                notifications={notifications}
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onNotificationClick={handleNotificationClick}
                onViewAll={handleViewAllNotifications}
              />
            )}
          </div>
        </div>
      </nav>

      <div
        className={`
          px-5 transition-all duration-300 md:hidden
          ${
            scrolled
              ? "pointer-events-none max-h-0 overflow-hidden opacity-0"
              : "max-h-20 opacity-100"
          }
        `}
      >
        <SearchBoxMobile onOpen={openMobileSearch} />
      </div>

      <MobileSearchOverlay
        open={mobileSearchOpen}
        onClose={closeMobileSearch}
      />
    </div>
  );
}

function Divider() {
  return <div className="h-9 w-0 border-r-2 border-r-[#f8e3ef]" />;
}

function NotificationBadge({
  count,
  mobile = false,
}: {
  count: number;
  mobile?: boolean;
}) {
  return (
    <span
      className={
        mobile
          ? "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white"
          : "absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
      }
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

function CartBadge({ count }: { count: number }) {
  return (
    <span
      className="
        absolute -right-2 -top-2
        flex h-5 min-w-5
        items-center justify-center
        rounded-full
        bg-red-500
        px-1
        text-[10px]
        font-bold
        text-white
      "
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
