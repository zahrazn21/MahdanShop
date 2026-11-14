import { NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";

function formatPrice(amount: number | null | undefined) {
  if (amount == null) {
    return "";
  }

  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "احراز هویت لازم است." },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        },
      );
    }

    const shipments = await prisma.orderShipment.findMany({
      where: {
        shipmentType: "DOMESTIC",
        shippingPaymentStatus: {
          in: ["NOT_REQUIRED", "AWAITING_USER_PAYMENT"],
        },
        shippingDueAt: { not: null },
        order: {
          userId: user.id,
          paymentStatus: "PAID",
        },
      },
      select: {
        id: true,
        shippingCost: true,
        shippingDueAt: true,
        shippingPaymentStatus: true,
        order: { select: { id: true } },
      },
      orderBy: { shippingDueAt: "asc" },
    });

    const shippingPayments = await prisma.shippingPayment.findMany({
      where: {
        userDeletedAt: null,
        shipment: { order: { userId: user.id } },
      },
      select: {
        id: true,
        amount: true,
        status: true,
        rejectionReason: true,
        createdAt: true,
        updatedAt: true,
        shipment: {
          select: {
            id: true,
            order: { select: { id: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const shippingNotificationIds = shipments.map((shipment) => {
      if (!shipment.shippingDueAt) {
        return `shipping-debt:${shipment.id}`;
      }

      const isOverdue =
        new Date(shipment.shippingDueAt).getTime() < Date.now();

      return isOverdue
        ? `shipping-debt-overdue:${shipment.id}`
        : `shipping-debt:${shipment.id}`;
    });

    const freightNotificationIds = shippingPayments.map(
      (payment) => `freight-payment-${payment.status.toLowerCase()}:${payment.id}`,
    );

    const notificationIds = [
      ...shippingNotificationIds,
      ...freightNotificationIds,
    ];

    const readNotifications =
      notificationIds.length > 0
        ? await prisma.notificationRead.findMany({
            where: {
              userId: user.id,
              notificationId: { in: notificationIds },
            },
            select: { notificationId: true },
          })
        : [];

    const readIds = new Set(
      readNotifications.map((notification) => notification.notificationId),
    );

    type Notification = {
      id: string;
      type:
        | "SHIPPING_DEBT"
        | "SHIPPING_DEBT_OVERDUE"
        | "FREIGHT_PAYMENT_PENDING"
        | "FREIGHT_PAYMENT_APPROVED"
        | "FREIGHT_PAYMENT_REJECTED";
      title: string;
      message: string;
      href?: string;
      priority: "HIGH" | "NORMAL";
      orderId?: string;
      amount?: number;
      dueAt?: string;
      createdAt?: string;
      rejectionReason?: string;
      actionLabel?: string;
      read: boolean;
    };

    const notifications: Notification[] = [];

    for (const shipment of shipments) {
      if (!shipment.shippingDueAt) continue;

      const isOverdue =
        new Date(shipment.shippingDueAt).getTime() < Date.now();

      const notificationId = isOverdue
        ? `shipping-debt-overdue:${shipment.id}`
        : `shipping-debt:${shipment.id}`;

      const orderId = shipment.order.id;
      const amount = shipment.shippingCost ?? 0;
      const isRead = readIds.has(notificationId);

      notifications.push({
        id: notificationId,
        type: isOverdue ? "SHIPPING_DEBT_OVERDUE" : "SHIPPING_DEBT",
        title: isOverdue
          ? "هزینه ارسال سررسید شده"
          : "یادآوری پرداخت هزینه ارسال",
        message: isOverdue
          ? `هزینه ارسال سفارش #${orderId} به مبلغ ${formatPrice(amount)} هنوز پرداخت نشده است و مهلت پرداخت آن گذشته است.`
          : `هزینه ارسال سفارش #${orderId} به مبلغ ${formatPrice(amount)} هنوز پرداخت نشده است.`,
        href: "/profile/shipping-debts",
        priority: isOverdue ? "HIGH" : "NORMAL",
        orderId,
        amount,
        dueAt: shipment.shippingDueAt.toISOString(),
        createdAt: shipment.shippingDueAt.toISOString(),
        actionLabel: "پرداخت هزینه ارسال",
        read: isRead,
      });
    }
    for (const payment of shippingPayments) {
      const orderId = payment.shipment.order.id;
      const notificationId = `freight-payment-${payment.status.toLowerCase()}:${payment.id}`;
      const isRead = readIds.has(notificationId);

      if (payment.status === "PENDING") {
        notifications.push({
          id: notificationId,
          type: "FREIGHT_PAYMENT_PENDING",
          title: "رسید باربری ثبت شد",
          message: `رسید پرداخت باربری سفارش #${orderId} به مبلغ ${formatPrice(payment.amount)} ثبت شده و در انتظار بررسی است.`,
          href: "/profile/shipping-debts",
          priority: "NORMAL",
          orderId,
          amount: payment.amount,
          createdAt: payment.createdAt.toISOString(),
          actionLabel: "مشاهده وضعیت پرداخت",
          read: isRead,
        });
      }

      if (payment.status === "APPROVED") {
        notifications.push({
          id: notificationId,
          type: "FREIGHT_PAYMENT_APPROVED",
          title: "پرداخت باربری تأیید شد",
          message: `رسید پرداخت باربری سفارش #${orderId} به مبلغ ${formatPrice(payment.amount)} تأیید شد.`,
          href: "/profile/shipping-debts",
          priority: "NORMAL",
          orderId,
          amount: payment.amount,
          createdAt: payment.updatedAt.toISOString(),
          actionLabel: "مشاهده جزئیات",
          read: isRead,
        });
      }

      if (payment.status === "REJECTED") {
        const reason = payment.rejectionReason?.trim();

        notifications.push({
          id: notificationId,
          type: "FREIGHT_PAYMENT_REJECTED",
          title: "رسید باربری رد شد",
          message: reason
            ? `رسید پرداخت باربری سفارش #${orderId} رد شد. دلیل: ${reason}`
            : `رسید پرداخت باربری سفارش #${orderId} رد شد و نیاز به ارسال مجدد دارد.`,
          href: "/profile/shipping-debts",
          priority: "HIGH",
          orderId,
          amount: payment.amount,
          rejectionReason: reason || undefined,
          createdAt: payment.updatedAt.toISOString(),
          actionLabel: "بررسی و ارسال مجدد",
          read: isRead,
        });
      }
    }

    notifications.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    const visibleNotifications = notifications.filter(
      (notification) => !notification.read,
    );

    return NextResponse.json(
      {
        notifications: visibleNotifications,
        count: visibleNotifications.length,
        unreadCount: visibleNotifications.length,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/notifications:", error);

    return NextResponse.json(
      { message: "دریافت اعلان‌ها انجام نشد." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}