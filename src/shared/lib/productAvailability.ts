
interface ComputeStockParams {
  availabilityType: "IN_STOCK" | "PRE_ORDER";
  baseStock: number;
  variants?: { stock?: number | string | null }[] | null;
}

interface ComputeStockResult {
  stock: number;
  isAvailable: boolean;
}

export function computeStockAndAvailability({
  availabilityType,
  baseStock,
  variants,
}: ComputeStockParams): ComputeStockResult {

  if (availabilityType === "PRE_ORDER") {
    return {
      stock: 0,
      isAvailable: true,
    };
  }


  if (Array.isArray(variants) && variants.length > 0) {
    const totalVariantStock = variants.reduce(
      (total, variant) =>
        total + Math.max(0, Number(variant.stock ?? 0)),
      0,
    );

    return {
      stock: totalVariantStock,
      isAvailable: totalVariantStock > 0,
    };
  }


  const safeStock = Math.max(0, Number(baseStock ?? 0));

  return {
    stock: safeStock,
    isAvailable: safeStock > 0,
  };
}

