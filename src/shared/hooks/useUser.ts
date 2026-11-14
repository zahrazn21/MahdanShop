// // hooks/useUser.ts
// import { useSession } from "next-auth/react";
// import { useQuery } from "@tanstack/react-query";

// export const useUser = () => {
//   const { data: session, status } = useSession();

//   const { data: userData } = useQuery({
//     queryKey: ["user", session?.user?.id],
//     queryFn: async () => {
//       if (!session?.user?.id) return null;
//       const res = await fetch(`/api/users/${session.user.id}`);
//       if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");
//       return res.json();
//     },
//     enabled: !!session?.user?.id,
//   });

//   return {
//     user: session?.user || null,
//     userData,
//     isLoading: status === "loading",
//     isAuthenticated: status === "authenticated",
//   };
// };