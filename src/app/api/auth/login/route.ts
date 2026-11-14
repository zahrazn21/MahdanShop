import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { mergeCart } from "@/src/shared/lib/cart/mergeCart";
import { signToken } from "@/src/shared/lib/auth/jwt";
import { prisma } from "@/src/shared/lib/prisma";

const loginSchema = z.object({
  email: z
    .string({
      error: "ایمیل را وارد کنید",
    })
    .trim()
    .min(1, "ایمیل را وارد کنید")
    .email("فرمت ایمیل صحیح نیست. مثال: example@gmail.com"),

  password: z
    .string({
      error: "رمز عبور را وارد کنید",
    })
    .min(1, "رمز عبور را وارد کنید")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .max(50, "رمز عبور نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.email && !body.password) {
      return NextResponse.json(
        {
          error: "لطفاً ایمیل و رمز عبور را وارد کنید",
        },
        {
          status: 400,
        },
      );
    }
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0].message,
        },
        {
          status: 400,
        },
      );
    }
    const { email, password } = result.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          error: "ایمیل یا رمز عبور اشتباه است",
        },
        {
          status: 401,
        },
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "رمز عبور اشتباه است",
        },
        {
          status: 401,
        },
      );
    }


    const cookieStore = await cookies();

    const cartId = cookieStore.get("cartId")?.value;

    if (cartId) {
      await mergeCart(user.id, cartId);

      cookieStore.delete("cartId");
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "ورود موفقیت‌آمیز بود",
        userId: user.id,
        role: user.role,
      },
      {
        status: 200,
      },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        error: "خطایی در سرور رخ داده است، لطفاً دوباره تلاش کنید",
      },
      {
        status: 500,
      },
    );
  }
}
