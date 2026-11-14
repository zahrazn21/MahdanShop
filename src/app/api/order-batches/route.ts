
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = [
  "OPEN",
  "PROCESSING",
  "ARRIVED",
  "CLOSED",
] as const;

type BatchStatus = (typeof VALID_STATUSES)[number];

export async function GET() {
  try {
    const batches = await prisma.orderBatch.findMany({
      orderBy: {
        batchNumber: "desc",
      },

      select: {
        id: true,
        batchNumber: true,
        title: true,

        status: true,

        estimatedFreightPerKg: true,

        openedAt: true,
        closedAt: true,

        createdAt: true,

        _count: {
          select: {
            products: true,
            shipments: true,
          },
        },
      },
    });

    return NextResponse.json({
      batches,
    });
  } catch (error) {
    console.error("GET /api/order-batches ERROR:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت دوره‌ها",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "احراز هویت انجام نشده است",
        },
        {
          status: 401,
        },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "دسترسی غیرمجاز",
        },
        {
          status: 403,
        },
      );
    }

    const body = await req.json().catch(() => ({}));

    const {
      batchNumber,
      title,
      estimatedFreightPerKg,
      status,
    } = body ?? {};

    if (
      batchNumber === undefined ||
      batchNumber === null ||
      batchNumber === "" ||
      Number.isNaN(Number(batchNumber))
    ) {
      return NextResponse.json(
        {
          error: "شماره دوره را وارد کنید",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !title ||
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          error: "عنوان دوره را وارد کنید",
        },
        {
          status: 400,
        },
      );
    }
    if (status && status !== "OPEN") {
      return NextResponse.json(
        {
          error: "دوره جدید باید با وضعیت OPEN ایجاد شود",
        },
        {
          status: 400,
        },
      );
    }

    const duplicate =
      await prisma.orderBatch.findUnique({
        where: {
          batchNumber: Number(batchNumber),
        },
      });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "دوره‌ای با این شماره قبلاً ثبت شده است",
        },
        {
          status: 409,
        },
      );
    }

    const freight =
      estimatedFreightPerKg === undefined ||
      estimatedFreightPerKg === null ||
      estimatedFreightPerKg === ""
        ? null
        : Number(estimatedFreightPerKg);

    if (
      freight !== null &&
      (!Number.isFinite(freight) || freight < 0)
    ) {
      return NextResponse.json(
        {
          error:
            "هزینه تخمینی باربری نامعتبر است",
        },
        {
          status: 400,
        },
      );
    }

    const batch =
      await prisma.orderBatch.create({
        data: {
          batchNumber: Number(batchNumber),

          title: title.trim(),

          estimatedFreightPerKg: freight,

          status: "OPEN",

          openedAt: new Date(),
        },
      });

    return NextResponse.json(
      {
        batch,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/order-batches ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error: "خطا در ایجاد دوره",
      },
      {
        status: 500,
      },
    );
  }
}