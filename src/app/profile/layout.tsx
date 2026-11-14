import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/src/shared/lib/auth/jwt";
import { prisma } from "@/src/shared/lib/prisma";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="">
      {children}
    </div>
  );
}