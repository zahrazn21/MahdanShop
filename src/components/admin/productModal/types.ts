import { ProductFormData, ProductSubmitData } from "@/src/shared/lib/validators/productValidation";
import { Product } from "@/src/shared/types/product";

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (data: ProductSubmitData) => Promise<void> | void;

  editingProduct: Product | null;

  formData: ProductFormData;

  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;

  isLoading?: boolean;
}

export type Tab = "basic" | "images" | "details" | "seo";
export type ShippingClass = "SMALL" | "MEDIUM" | "LARGE";

export type OrderBatch = {
  id: string;
  batchNumber: number;
  title: string;
  status: "OPEN" | "PROCESSING" | "ARRIVED" | "CLOSED";
};
