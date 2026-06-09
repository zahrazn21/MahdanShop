/* eslint-disable react-hooks/error-boundaries */
import { categories } from "@/src/components/categories/CategoryItems";
import CategorySlider from "@/src/components/categories/CategorySlider";
import ProductClient from "@/src/components/product/ProductClient";
import ProductSlider from "@/src/components/product/ProductSlider";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

type ProductScope = "domestic" | "imported" | "all";

const validCategories  = categories.map(cat => cat.slug);

export default async function ProductsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ?? [];

  if (slug.length === 0) {
    return (
      <div className="space-y-12">
        <CategorySlider scope="all" />
        <ProductSlider scope="all" />
      </div>
    );
  }

  if (slug.length === 1) {
    const type = slug[0] as ProductScope;
    
    if (type !== "domestic" && type !== "imported" && type !== "all") {
      notFound();
    }
    
    return (
      <div>
        <CategorySlider scope={type} />
      </div>
    );
  }

  if (slug.length === 2) {
    const type = slug[0] as ProductScope;
    const category = slug[1];
    
    // بررسی معتبر بودن scope
    if (type !== "domestic" && type !== "imported" && type !== "all") {
      notFound();
    }
    
    if (!validCategories.includes(category)) {
      notFound();
    }
    
    return (
      <div>
        <ProductSlider scope={type} category={category} />
      </div>
    );
  }

  if (slug.length === 3) {
    const productId = slug[2];
    
    try {
      const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
        next: { revalidate: 60 },
        cache: "no-store" // برای دیتای به‌روز
      });
      
      if (!res.ok) {
        notFound();
      }
      
      const product = await res.json();
      
      if (!product) {
        notFound();
      }
      
      return (
        <div>
          <ProductClient id={productId} initialProduct={product} />
        </div>
      );
    } catch (error) {
      console.error("Error fetching product:", error);
      notFound();
    }
  }

  notFound();
}