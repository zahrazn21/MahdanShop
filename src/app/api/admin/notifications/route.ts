import { NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

function formatPrice(amount: number) {
  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "احراز هویت لازم است." },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز است." },
        { status: 403 },
      );
    }

    const payments = await prisma.shippingPayment.findMany({
      where: {
        adminDeletedAt: null,
      },
      select: {
        id: true,
        amount: true,
        status: true,
        payerName: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        shipment: {
          select: {
            id: true,
            order: {
              select: {
                id: true,
                user: {
                  select: {
                    username: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 50,
    });

    const notificationIds = payments.map(
      (payment) =>
        `admin-freight-payment-${payment.status.toLowerCase()}:${payment.id}`,
    );

    const readNotifications =
      notificationIds.length > 0
        ? await prisma.notificationRead.findMany({
            where: {
              userId: user.id,
              notificationId: {
                in: notificationIds,
              },
            },
            select: {
              notificationId: true,
            },
          })
        : [];

    const readIds = new Set(
      readNotifications.map(
        (item) => item.notificationId,
      ),
    );

    const notifications = payments.map((payment) => {
      const notificationId =
        `admin-freight-payment-${payment.status.toLowerCase()}:${payment.id}`;

      const orderId = payment.shipment.order.id;

      const username =
        payment.shipment.order.user?.username ||
        payment.shipment.order.user?.email ||
        "کاربر";

      if (payment.status === "PENDING") {
        return {
          id: notificationId,
          type: "FREIGHT_PAYMENT_PENDING",
          title: "رسید باربری جدید",
          message:
            `${username} رسید پرداخت باربری سفارش #${orderId} ` +
            `به مبلغ ${formatPrice(payment.amount)} را ثبت کرده است.`,
          priority: "HIGH",
          orderId,
          amount: payment.amount,
          createdAt: payment.createdAt.toISOString(),
          read: readIds.has(notificationId),
          href: `/admin/orders/${orderId}`,
          actionLabel: "بررسی رسید",
        };
      }

      if (payment.status === "APPROVED") {
        return {
          id: notificationId,
          type: "FREIGHT_PAYMENT_APPROVED",
          title: "پرداخت باربری تأیید شده",
          message:
            `پرداخت باربری سفارش #${orderId} مربوط به ${username} ` +
            `تأیید شده است.`,
          priority: "NORMAL",
          orderId,
          amount: payment.amount,
          createdAt: payment.updatedAt.toISOString(),
          read: readIds.has(notificationId),
          href: `/admin/orders/${orderId}`,
          actionLabel: "مشاهده سفارش",
        };
      }

      return {
        id: notificationId,
        type: "FREIGHT_PAYMENT_REJECTED",
        title: "رسید باربری رد شده",
        message:
          `رسید پرداخت باربری سفارش #${orderId} مربوط به ${username} ` +
          `رد شده است.` +
          (payment.rejectionReason
            ? ` دلیل: ${payment.rejectionReason}`
            : ""),
        priority: "HIGH",
        orderId,
        amount: payment.amount,
        rejectionReason:
          payment.rejectionReason ?? undefined,
        createdAt: payment.updatedAt.toISOString(),
        read: readIds.has(notificationId),
        href: `/admin/orders/${orderId}`,
        actionLabel: "مشاهده سفارش",
      };
    });

    notifications.sort((a, b) => {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return NextResponse.json(
      {
        notifications,
        count: notifications.length,
        unreadCount: notifications.filter(
          (item) => !item.read,
        ).length,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error(
      "GET /api/admin/notifications:",
      error,
    );

    return NextResponse.json(
      { message: "دریافت اعلان‌های ادمین انجام نشد." },
      { status: 500 },
    );
  }
}