"use client";

import { useQuery } from "@tanstack/react-query";


export type OrderStatus =
  | "PENDING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "PARTIALLY_SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "REVIEW"
  | "PAID"
  | "REJECTED";

export type ShipmentStatus =
  | "PENDING"
  | "WAITING_IMPORT"
  | "WAITING_FOR_FREIGHT"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED";

export type ShipmentType =
  | "DOMESTIC"
  | "IMPORTED";


export interface AdminDashboardStats {
  totalProducts: number;

  totalUsers: number;

  totalOrders: number;

  totalSales: number;

  todaySales: number;

  weekSales: number;

  monthSales: number;

  todayOrders: number;

  weekOrders: number;

  monthOrders: number;

  pendingPayments: number;

  processingOrders: number;

  pendingFreightPayments?: number;

  waitingImportShipments?: number;

  readyToShipShipments?: number;
}


export interface AdminDashboardSalesChartItem {
  date: string;

  label: string;

  sales: number;

  orders: number;
}


export interface AdminDashboardOrderStatusStat {
  status: OrderStatus;

  count: number;
}


export interface AdminDashboardTopSellingProduct {
  productId: string;

  name: string;

  image: string | null;

  price: number;

  quantity: number;
}


export interface AdminDashboardRecentOrder {
  id: string;

  totalPrice: number;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  createdAt: string;

  user: {
    username: string | null;

    email: string | null;
  } | null;
}


export interface AdminDashboardLowStockProduct {
  id: string;

  name: string;

  stock: number;

  image: string | null;
}


export interface AdminDashboardData {
  stats: AdminDashboardStats;

  salesChart: AdminDashboardSalesChartItem[];

  orderStatusStats: AdminDashboardOrderStatusStat[];

  topSellingProducts: AdminDashboardTopSellingProduct[];

  recentOrders: AdminDashboardRecentOrder[];

  lowStockProducts: AdminDashboardLowStockProduct[];
}


export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ["admin-dashboard"],

    queryFn: async () => {
      const response = await fetch(
        "/api/admin/dashboard",
        {
          method: "GET",

          credentials: "include",

          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "خطا در دریافت اطلاعات داشبورد",
        );
      }

      return data;
    },

    staleTime: 60 * 1000,

    refetchOnWindowFocus: true,
  });
}