import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyMiddlewareToken } from "./shared/lib/auth/middleware-jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const payload = token
    ? await verifyMiddlewareToken(token)
    : null;

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};