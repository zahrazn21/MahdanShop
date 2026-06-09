import Link from "next/link";
import { getCategoryName, Product } from "../ProductItems";

export function Breadcrumb({ product }: { product: Product }) {
  return (
    <div dir="rtl" className="text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-pink-600">خانه</Link>
      <span className="mx-2 text-pink-600">/</span>
      <Link href="/products" className="hover:text-pink-600">محصولات</Link>
      <span className="mx-2 text-pink-600">/</span>
      <Link href={`/products/${product.scope}?category=${product.category}`} className="hover:text-pink-600">
        {getCategoryName(product.category)}
      </Link>
      <span className="mx-2 text-pink-600">/</span>
      <span className="text-gray-800">{product.name}</span>
    </div>
  );
}
