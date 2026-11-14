"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  ShoppingBag,
  Wallet,
  CalendarDays,
  Eye,
  Mail,
} from "lucide-react";

import LoadingSpinner from "@/src/components/admin/LoadingSpinner";
import { useAdminUsers } from "@/src/shared/hooks/useAdminUsers";
import Link from "next/link";
import { formatDateSafe, formatPrice } from "@/src/shared/lib/format";
export default function AdminUsersPage() {
  const { data, isLoading, error } = useAdminUsers();

  const [searchTerm, setSearchTerm] = useState("");

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.username?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  const totalUsers = users.length;

  const totalOrders = users.reduce(
    (sum, user) => sum + user.ordersCount,
    0
  );

  const totalSales = users.reduce(
    (sum, user) => sum + user.totalSpent,
    0
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="flex min-h-100 items-center justify-center"
      >
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-600">
          خطا در دریافت کاربران
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">
          کاربران
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          مدیریت و مشاهده کاربران فروشگاه
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="کل کاربران"
          value={totalUsers.toLocaleString("fa-IR")}
          icon={Users}
        />

        <StatCard
          title="کل سفارش‌ها"
          value={totalOrders.toLocaleString("fa-IR")}
          icon={ShoppingBag}
        />

        <StatCard
          title="مجموع خرید کاربران"
          value={formatPrice(totalSales)}
          icon={Wallet}
        />
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="جستجو با نام کاربری یا ایمیل..."
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              py-3
              pr-10
              pl-4
              text-sm
              outline-none
              transition
              focus:border-pink-400
              focus:bg-white
            "
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-4 text-xs font-bold text-gray-500">
                  کاربر
                </th>

                <th className="px-5 py-4 text-xs font-bold text-gray-500">
                  ایمیل
                </th>

                <th className="px-5 py-4 text-xs font-bold text-gray-500">
                  سفارش‌ها
                </th>

                <th className="px-5 py-4 text-xs font-bold text-gray-500">
                  مجموع خرید
                </th>

                <th className="px-5 py-4 text-xs font-bold text-gray-500">
                  عضویت
                </th>

                <th className="px-5 py-4 text-xs font-bold text-gray-500">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-gray-100 md:hidden">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <UserAvatar username={user.username} />

                  <div>
                    <p className="font-bold text-gray-800">
                      {user.username || "بدون نام"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {user.email || "-"}
                    </p>
                  </div>
                </div>

                <button
                  className="
                    rounded-lg
                    bg-pink-50
                    p-2
                    text-pink-600
                    hover:bg-pink-100
                  "
                >
                  <Eye size={17} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">
                    سفارش‌ها
                  </p>

                  <p className="mt-1 font-bold">
                    {user.ordersCount.toLocaleString("fa-IR")}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">
                    مجموع خرید
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {formatPrice(user.totalSpent)}
                  </p>
                </div>
              </div>

              <p className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <CalendarDays size={14} />
                {formatDateSafe(user.createdAt)}
              </p>
            </div>
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />

            <h3 className="font-bold text-gray-700">
              کاربری پیدا نشد
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              موردی با عبارت جستجوی شما وجود ندارد.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({
  user,
}: {
  user: {
    id: string;
    username: string | null;
    email: string | null;
    createdAt: string;
    ordersCount: number;
    totalSpent: number;
  };
}) {
  return (
    <tr className="border-b border-gray-50 transition hover:bg-gray-50/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar username={user.username} />

          <div>
            <p className="font-bold text-gray-800">
              {user.username || "بدون نام"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              شناسه: {user.id.slice(-8)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail
            size={15}
            className="text-gray-400"
          />

          {user.email || "-"}
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-600">
          {user.ordersCount.toLocaleString("fa-IR")}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="font-bold text-gray-800">
          {formatPrice(user.totalSpent)}
        </span>
      </td>

      <td className="px-5 py-4 text-sm text-gray-500">
        {formatDateSafe(user.createdAt)}
      </td>

      <td className="px-5 py-4">
        <Link
            href={`/admin/users/${user.id}`}        
          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-pink-50
            px-3
            py-2
            text-xs
            font-bold
            text-pink-600
            transition
            hover:bg-pink-100
          "
        >
          <Eye size={15} />
          مشاهده
        </Link>
      </td>
    </tr>
  );
}

function UserAvatar({
  username,
}: {
  username: string | null;
}) {
  const letter = username?.charAt(0)?.toUpperCase() || "؟";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 font-bold text-pink-500">
      {letter}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-xl font-black text-gray-800">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}