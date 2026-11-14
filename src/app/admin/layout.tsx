import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/src/shared/lib/auth/jwt";
import { prisma } from "@/src/shared/lib/prisma";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminHeader from "@/src/components/admin/AdminHeader";

export default async function AdminLayout({
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
      username: true,
      email: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-100 lg:flex"
    >
      <AdminSidebar />
      <div className="min-h-screen min-w-0 flex-1">
        <AdminHeader user={user} />
        <main className="min-h-[calc(100vh-72px)] p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}