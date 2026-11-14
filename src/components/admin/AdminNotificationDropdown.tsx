"use client";

import {
  Bell,
  Check,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import Link from "next/link";

export type AdminNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: "HIGH" | "NORMAL";
  orderId?: string;
  amount?: number;
  createdAt: string;
  read: boolean;
  href?: string;
  actionLabel?: string;
  rejectionReason?: string;
};

interface AdminNotificationDropdownProps {
  notifications: AdminNotification[];
  open: boolean;
  onClose: () => void;
  onNotificationClick: (
    notification: AdminNotification,
  ) => void;
}

export function AdminNotificationDropdown({
  notifications,
  open,
  onClose,
  onNotificationClick,
}: AdminNotificationDropdownProps) {
  const unreadCount = notifications.filter(
    (item) => !item.read,
  ).length;

  return (
    <>
      <button
        type="button"
        aria-label="بستن اعلان‌ها"
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/20
          backdrop-blur-[1px]
          transition-opacity duration-200
          lg:hidden
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      <div
        dir="rtl"
        className={`
          fixed left-0 right- top-18 z-50
          flex max-h-[calc(100dvh-88px)]
          flex-col overflow-hidden
          rounded-2xl
          border border-gray-100
          bg-white
          shadow-2xl

          sm:left-auto
          sm:right-4
          sm:w-97.5

          transition-all duration-200

          ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }
        `}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <Bell
              size={19}
              className="text-pink-600"
            />

            <span className="text-sm font-black text-gray-800">
              اعلان‌های سیستم
            </span>

            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-100 px-1.5 text-[10px] font-bold text-pink-600">
                {unreadCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={17} />
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="flex items-center justify-center px-6 py-12">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                <Bell
                  size={27}
                  className="text-gray-300"
                />
              </div>

              <p className="text-sm font-bold text-gray-600">
                اعلان جدیدی ندارید
              </p>

              <p className="mt-1 text-xs text-gray-400">
                همه چیز تحت کنترل است
              </p>
            </div>
          </div>
        ) : (
          <div className="min-h-0 overflow-y-auto">
            {notifications.map((notification) => {
              const isRead = notification.read;

              const content = (
                <div
                  className={`
                    relative border-b border-gray-100
                    px-4 py-4
                    transition-colors
                    ${
                      isRead
                        ? "bg-white"
                        : "bg-pink-50/60"
                    }
                  `}
                >
                  {!isRead && (
                    <span className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-pink-500" />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        mt-0.5 flex h-10 w-10
                        shrink-0 items-center justify-center
                        rounded-xl
                        ${
                          isRead
                            ? "bg-gray-100 text-gray-400"
                            : "bg-pink-100 text-pink-600"
                        }
                      `}
                    >
                      {isRead ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`
                            text-sm
                            ${
                              isRead
                                ? "font-medium text-gray-700"
                                : "font-bold text-gray-900"
                            }
                          `}
                        >
                          {notification.title}
                        </p>

                        {isRead && (
                          <Check
                            size={15}
                            className="shrink-0 text-green-500"
                          />
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        {notification.priority ===
                          "HIGH" && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-600">
                            نیاز به اقدام
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-xs leading-6 text-gray-600">
                        {notification.message}
                      </p>

                      {notification.actionLabel && (
                        <div className="mt-3 text-xs font-bold text-pink-600">
                          {notification.actionLabel} →
                        </div>
                      )}

                      {!isRead && (
                        <p className="mt-2 text-[10px] font-medium text-pink-600">
                          خوانده نشده
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );

              if (notification.href) {
                return (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    onClick={() =>
                      onNotificationClick(notification)
                    }
                    className="block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    onNotificationClick(notification)
                  }
                  className="block w-full text-right"
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="shrink-0 border-t border-gray-100 p-2">
            <Link
              href="/admin/orders"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-gray-50 px-4 py-3 text-xs font-bold text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
            >
              مشاهده همه سفارش‌ها
            </Link>
          </div>
        )}
      </div>
    </>
  );
}