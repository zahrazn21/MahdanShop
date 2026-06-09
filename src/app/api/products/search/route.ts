// // app/api/products/search/route.ts
// import { products } from "@/app/components/product/ProductItems";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("q") || "";

//   if (!query || query.length < 2) {
//     return NextResponse.json({ products: [], total: 0 });
//   }

//   const searchLower = query.toLowerCase();
  
//   const filtered = products.filter(
//     (p) =>
//       p.name.toLowerCase().includes(searchLower) ||
//       p.brand.toLowerCase().includes(searchLower)
//   );

//   // محدود کردن به 10 نتیجه
//   const limited = filtered.slice(0, 10);

//   return NextResponse.json({
//     products: limited,
//     total: filtered.length,
//     query,
//   });
// }