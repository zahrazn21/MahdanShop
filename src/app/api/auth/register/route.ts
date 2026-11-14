import { signToken } from "@/src/shared/lib/auth/jwt";
import { prisma } from "@/src/shared/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "نام کاربری را وارد کنید")
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .max(20, "نام کاربری نمی‌تواند بیشتر از ۲۰ کاراکتر باشد")
    .regex(
      /^[a-zA-Z0-9_آ-ی]+$/,
      "نام کاربری فقط می‌تواند شامل حروف، اعداد و _ باشد",
    ),

  email: z
    .string()
    .trim()
    .min(1, "ایمیل را وارد کنید")
    .email("فرمت ایمیل صحیح نیست"),

  password: z
    .string()
    .min(1, "رمز عبور را وارد کنید")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .max(50, "رمز عبور نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.username && !body.email && !body.password) {
      return NextResponse.json(
        {
          error: "لطفاً همه فیلدها را وارد کنید",
        },
        {
          status: 400,
        },
      );
    }
    const result = registerSchema.safeParse(body);

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

    const { username, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "این ایمیل قبلاً ثبت شده است",
        },
        {
          status: 409,
        },
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          error: "این نام کاربری قبلاً استفاده شده است",
        },
        {
          status: 409,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = signToken({
      userId: user.id,

      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "ثبت نام با موفقیت انجام شد",
        userId: user.id,
        role: user.role,
      },

      {
        status: 201,
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
    console.error("REGISTER ERROR:", error);

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
