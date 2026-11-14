import { NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";
import { getCurrentUser } from "@/src/shared/lib/auth/getCurrentUser";


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "کاربر وارد نشده است",
        },
        {
          status: 401,
        }
      );
    }


    const profile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },

      select: {
        id: true,
        username: true,
        email: true,
        points: true,
        role: true,
        createdAt: true,
        orders: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            totalPrice: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
    });


    return NextResponse.json(profile);

  } catch (error) {

    console.error("PROFILE ERROR:", error);

    return NextResponse.json(
      {
        error: "خطا در دریافت اطلاعات پروفایل",
      },
      {
        status: 500,
      }
    );
  }
}