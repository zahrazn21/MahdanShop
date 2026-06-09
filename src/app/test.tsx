/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useProducts } from "../shared/hooks/useProducts";


export default function AllProductsTest() {
  const { data, isLoading, error } = useProducts({scope:"imported",category:"lego"});

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error instanceof Error) return <p>خطا: {error.message}</p>;

  if (!data || data.length === 0) return <p>محصولی یافت نشد</p>;
 
  console.log("data",data);
  
  return (
    <div>
      {data.map((p:any) => (
        <div key={p.id}>
          {p.title} - {p.price.toLocaleString()} تومان
        </div>
      ))}
    </div>
  );
}
