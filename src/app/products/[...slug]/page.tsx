/* eslint-disable react-hooks/error-boundaries */

import {
  categories,
  getCategoryName,
} from "@/src/components/categories/CategoryItems";
import CategorySlider from "@/src/components/categories/CategorySlider";
import AllProducts from "@/src/components/product/AllProducts";
import ProductClient from "@/src/components/product/ProductClient";
import ProductSlider from "@/src/components/product/ProductSlider";
import { prisma } from "@/src/shared/lib/prisma";
import { Product } from "@/src/shared/types/product";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

type ProductScope = "domestic" | "imported" | "all";

const validCategories = categories.map((cat) => cat.slug);

const isValidScope = (value: string): value is ProductScope => {
  return value === "domestic" || value === "imported" || value === "all";
};

export default async function ProductsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ?? [];

  if (slug.length === 0) {
    return (
      <div className="space-y-12">
        <CategorySlider />
        <ProductSlider scope="all" />
      </div>
    );
  }
  if (slug.length === 1) {
    const value = slug[0];

    if (validCategories.includes(value as never)) {
      return (
        <AllProducts
          scope="all"
          category={value}
          categoryName={getCategoryName(value)}
        />
      );
    }

    if (isValidScope(value)) {
      return (
        <div className="space-y-12">
          <CategorySlider />
          <ProductSlider scope={value} />
        </div>
      );
    }

    notFound();
  }

  if (slug.length === 2) {
    const scope = slug[0];
    const category = slug[1];

    if (!isValidScope(scope)) {
      notFound();
    }

    if (!validCategories.includes(category as never)) {
      notFound();
    }

    return (
      <AllProducts
        scope={scope}
        category={category}
        categoryName={getCategoryName(category)}
      />
    );
  }

  if (slug.length === 3) {
    const scope = slug[0];
    const category = slug[1];
    const rawSlug = slug[2];

    let productSlug = rawSlug;
    try {
      productSlug = decodeURIComponent(rawSlug);
    } catch {}

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: productSlug }, { id: productSlug }],
      },
      include: { batch: true },
    });
    if (!isValidScope(scope)) {
      notFound();
    }

    if (!validCategories.includes(category as never)) {
      notFound();
    }

    if (!product) {
      notFound();
    }

    const initialProduct = {
      ...product,

      scope: product.scope as "domestic" | "imported",

      status: product.status as
        | "ACTIVE"
        | "DRAFT"
        | "OUT_OF_STOCK"
        | "ARCHIVED",

      shippingClass: product.shippingClass as "SMALL" | "MEDIUM" | "LARGE",

      availabilityType: product.availabilityType as "IN_STOCK" | "PRE_ORDER",

      expirationDate: product.expirationDate
        ? product.expirationDate.toISOString()
        : null,

      createdAt: product.createdAt?.toISOString(),

      updatedAt: product.updatedAt?.toISOString(),

      variants: Array.isArray(product.variants)
        ? (product.variants as unknown as Product["variants"])
        : [],

      specifications: Array.isArray(product.specifications)
        ? (product.specifications as unknown as Product["specifications"])
        : [],
    };

    return <ProductClient id={product.id} initialProduct={initialProduct} />;
  }

  notFound();
}
