"use client";

import { Bell, Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

import type { Notification } from "@/src/shared/types/notifications";

export function NotificationDropdown({
  notifications,
  onClose,
  open,
  onNotificationClick,
  onViewAll,
}: {
  notifications: Notification[];
  onClose: () => void;
  open: boolean;
  onNotificationClick: (notification: Notification) => void;
  onViewAll: () => void;
}) {
  const unreadCount = notifications.length;
  return (
    <>
      <button
        type="button"
        aria-label="بستن اعلان‌ها"
        onClick={onClose}
        onMouseDown={(e) => e.stopPropagation()}
        className={`
          fixed inset-0 z-40 bg-black/20
          backdrop-blur-[1px]
          transition-opacity duration-300
          md:hidden
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
          fixed right-0 top-0 z-50
          flex h-dvh w-[88%] max-w-sm
          flex-col
          bg-white
          shadow-2xl
          transition-transform duration-300 ease-out

          md:absolute
          md:left-0
          md:right-auto
          md:top-10
          md:h-auto
          md:w-80
          md:max-w-[calc(100vw-24px)]
          md:rounded-2xl
          md:border
          md:border-gray-100
          md:shadow-xl

          ${
            open
              ? "translate-x-0"
              : "translate-x-full md:pointer-events-none md:opacity-0"
          }
        `}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <Bell className="text-pink-600" size={20} />
            <p className="text-base font-bold text-gray-800">اعلان‌ها</p>

            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-100 px-1.5 text-[10px] font-bold text-pink-600">
                {unreadCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن اعلان‌ها"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 active:scale-95 md:hidden"
          >
            ×
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-4 py-8 md:flex-none">
            <div className="text-center">
              <Bell className="mx-auto mb-3 text-gray-300" size={36} />
              <p className="text-sm font-medium text-gray-500">
                اعلان جدیدی ندارید
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overscroll-contain md:max-h-96 md:flex-none">
            {notifications.map((notification) => {
              const isRead = Boolean(notification.read);

              const content = (
                <div
                  className={`relative px-4 py-4 transition-colors duration-200 ${
                    isRead ? "bg-white" : "bg-pink-50/70"
                  }`}
                >
                  {!isRead && (
                    <span className="absolute left-1 top-5 h-2 w-2 rounded-full bg-pink-500" />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isRead
                          ? "bg-gray-100 text-gray-400"
                          : "bg-pink-100 text-pink-600"
                      }`}
                    >
                      {isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <p
                            className={`text-sm ${
                              isRead
                                ? "font-medium text-gray-700"
                                : "font-bold text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </p>

                          {notification.priority === "HIGH" && (
                            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600">
                              مهم
                            </span>
                          )}
                        </div>

                        {isRead && (
                          <Check size={15} className="mt-0.5 shrink-0 text-green-500" />
                        )}
                      </div>

                      <p
                        className={`mt-2 text-xs leading-6 ${
                          isRead ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {notification.href && notification.actionLabel && (
                        <div className="mt-3 text-xs font-medium text-blue-600">
                          {notification.actionLabel} →
                        </div>
                      )}

                      {!isRead && (
                        <div className="mt-2 text-[10px] font-medium text-pink-600">
                          خوانده نشده
                        </div>
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
                    onClick={() => onNotificationClick(notification)}
                    className="block border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => onNotificationClick(notification)}
                  className="block w-full border-b border-gray-100 text-right transition hover:bg-gray-50"
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="border-t border-gray-100 p-2">
            <Link
              href="/profile/shipping-debts"
              onClick={onViewAll}
              className="flex w-full items-center justify-center rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
            >
              مشاهده همه
            </Link>
          </div>
        )}
      </div>
    </>
  );
}