// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";

// export function useRejectPayment() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       orderId,
//       reason,
//     }: {
//       orderId: string;
//       reason: string;
//     }) => {
//       const res = await fetch(`/api/admin/payments/${orderId}/reject`, {
//         method: "POST",

//         credentials: "include",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           reason,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || "خطا در رد پرداخت");
//       }

//       return data;
//     },

//     onSuccess() {
//       queryClient.invalidateQueries({
//         queryKey: ["admin-payments"],
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["admin-orders"],
//       });
//     },
//   });
// }
