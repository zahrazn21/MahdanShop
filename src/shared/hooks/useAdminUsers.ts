"use client";

import { useQuery } from "@tanstack/react-query";

export type AdminUser = {
  id: string;
  username: string | null;
  email: string | null;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
};

type AdminUsersResponse = {
  users: AdminUser[];
};

export function useAdminUsers() {
  return useQuery<AdminUsersResponse>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "خطا در دریافت کاربران"
        );
      }

      return data;
    },
  });
}