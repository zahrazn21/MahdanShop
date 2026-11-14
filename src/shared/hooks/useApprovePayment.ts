// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";


// export function useApprovePayment() {

//   const queryClient = useQueryClient();


//   return useMutation({

//     mutationFn: async (orderId: string) => {


//       const res = await fetch(
//         `/api/admin/payments/${orderId}/approve`,
//         {
//           method: "POST",
//           credentials: "include",
//         }
//       );


//       const data = await res.json();


//       if (!res.ok) {
//         throw new Error(
//           data?.error || "خطا در تایید پرداخت"
//         );
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