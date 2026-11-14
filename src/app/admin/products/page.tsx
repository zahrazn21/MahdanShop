"use client";

import { useState } from "react";

import {
  useAddProduct,
  useDeleteProduct,
  useEditProduct,
} from "@/src/shared/hooks/useProductMutations";
import { useProducts } from "@/src/shared/hooks/useProducts";
import {
  ProductFormData,
  ProductSubmitData,
} from "@/src/shared/lib/validators/productValidation";
import { Product } from "@/src/shared/types/product";
import LoadingSpinner from "@/src/components/admin/LoadingSpinner";
import AdminToolbar from "@/src/components/admin/AdminToolbar";
import ProductTable from "@/src/components/admin/ProductTable";
import ProductModal from "@/src/components/admin/ProductModal";
import ConfirmModal from "@/src/shared/ui/ConfirmModal";
import Toast from "@/src/shared/ui/Toast";


const emptyFormData: ProductFormData = {
  name: "",
  price: "",
  originalPrice: "",
  image: "",
  images: [],
  category: "cosmetics",
  brand: "",
  scope: "imported",
  availabilityType: "IN_STOCK",
  estimatedDeliveryDays: "",
  preOrderNote: "",
  batchId: null,
  stock: "",
  description: "",
  features: [],
  ingredients: [],
  howToUse: "",
  slug: "",
  status: "ACTIVE",
  sku: "",
  weight: "",
  shippingClass: "SMALL",
  expirationDate: "",
  specifications: [],
  variants: [],
};

export default function AdminPage() {
  const { data, isLoading, error } = useProducts();

  const editProduct = useEditProduct();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [deletingProductName, setDeletingProductName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<ProductFormData>(emptyFormData);

  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      ...emptyFormData,
      images: [],
      features: [],
      ingredients: [],
    });
    setShowModal(true);
  };

  const handleEdit = async (listProduct: Product) => {
    try {
         const res = await fetch(`/api/products/${listProduct.id}`);
    if (!res.ok) throw new Error();
    const product: Product = await res.json();

    setEditingProduct(product); 
    setFormData({
      name: product.name ?? "",
      price:
        product.price !== undefined && product.price !== null
          ? String(product.price)
          : "",
      originalPrice:
        product.originalPrice !== undefined && product.originalPrice !== null
          ? String(product.originalPrice)
          : "",
      image: product.image ?? "",
      images: Array.isArray(product.images) ? [...product.images] : [],
      category: product.category ?? "cosmetics",
      brand: product.brand ?? "",
      scope: product.scope ?? "imported",
      availabilityType: product.availabilityType ?? "IN_STOCK",
      estimatedDeliveryDays:
        product.estimatedDeliveryDays !== undefined &&
        product.estimatedDeliveryDays !== null
          ? String(product.estimatedDeliveryDays)
          : "",
      preOrderNote: product.preOrderNote ?? "",
      batchId: product.batchId ?? null,
      stock:
        product.stock !== undefined && product.stock !== null
          ? String(product.stock)
          : "",
      description: product.description ?? "",
      features: Array.isArray(product.features) ? [...product.features] : [],
      ingredients: Array.isArray(product.ingredients)
        ? [...product.ingredients]
        : [],
      howToUse: product.howToUse ?? "",
      slug: product.slug ?? "",
      shippingClass: product.shippingClass ?? "SMALL",
      sku: product.sku ?? "",
      weight:
        product.weight !== undefined && product.weight !== null
          ? String(product.weight)
          : "",
      status: product.status ?? "ACTIVE",

      expirationDate: product.expirationDate
        ? new Date(product.expirationDate).toISOString().split("T")[0]
        : "",
      specifications: Array.isArray(product.specifications)
        ? product.specifications.map((spec) => ({ ...spec }))
        : [],

      variants: Array.isArray(product.variants)
        ? product.variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            hexCode: variant.hexCode ?? "",
            colorName: variant.colorName ?? "",
            stock:
              variant.stock !== undefined && variant.stock !== null
                ? String(variant.stock)
                : "",
            price:
              variant.price !== undefined && variant.price !== null
                ? String(variant.price)
                : "",
            size: variant.size ?? "",
            volume:
              variant.volume !== undefined && variant.volume !== null
                ? String(variant.volume)
                : "",
            volumeUnit: variant.volumeUnit ?? "ml",
            sku: variant.sku ?? "",
            images: Array.isArray(variant.images) ? [...variant.images] : [],
          }))
        : [],
    });

    setShowModal(true);
    } catch {
      setToast({
      isOpen: true,
      message: "خطا در دریافت اطلاعات محصول",
      type: "error",
    });
    }
 
  };

  const handleSubmit = async (data: ProductSubmitData) => {
    const productData = {
      ...data,

      image: data.image.trim(),

      images: Array.isArray(data.images) ? data.images : [],

      features: Array.isArray(data.features)
        ? data.features.filter((item) => item.trim() !== "")
        : [],

      ingredients: Array.isArray(data.ingredients)
        ? data.ingredients.filter((item) => item.trim() !== "")
        : [],

      specifications: Array.isArray(data.specifications)
        ? data.specifications.filter(
            (spec) =>
              spec.key.trim() !== "" ||
              spec.label.trim() !== "" ||
              spec.value.trim() !== "",
          )
        : [],

      variants: Array.isArray(data.variants) ? data.variants : [],

      description: data.description?.trim() || "",

      brand: data.brand?.trim() || undefined,

      howToUse: data.howToUse?.trim() || undefined,

      slug: data.slug?.trim() || undefined,

      sku: data.sku?.trim() || undefined,

      isAvailable: data.stock > 0,

      expirationDate: data.expirationDate?.trim()
        ? data.expirationDate
        : undefined,
    };

    try {
      if (editingProduct) {
        await editProduct.mutateAsync({
          id: editingProduct.id,
          data: productData,
        });

        setToast({
          isOpen: true,
          message: `محصول "${editingProduct.name}" با موفقیت ویرایش شد`,
          type: "success",
        });
      } else {
        await addProduct.mutateAsync(productData);

        setToast({
          isOpen: true,
          message: `محصول "${productData.name}" با موفقیت افزوده شد`,
          type: "success",
        });
      }

      setShowModal(false);
      setEditingProduct(null);

      setFormData({
        ...emptyFormData,
        images: [],
        features: [],
        ingredients: [],
        specifications: [],
        variants: [],
      });
    } catch (error) {
      console.error("Product submit error:", error);

      setToast({
        isOpen: true,
        message:
          error instanceof Error
            ? error.message
            : "خطا در ذخیره محصول. لطفاً مجدداً تلاش کنید.",
        type: "error",
      });
    }
  };
  const handleDeleteClick = (id: string, name: string) => {
    setDeletingProductId(id);
    setDeletingProductName(name);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;

    try {
      await deleteProduct.mutateAsync(deletingProductId);

      setToast({
        isOpen: true,
        message: `محصول "${deletingProductName}" با موفقیت حذف شد`,
        type: "success",
      });

      setShowDeleteModal(false);
      setDeletingProductId(null);
      setDeletingProductName("");
    } catch (error) {
      console.error("Delete product error:", error);

      setToast({
        isOpen: true,
        message: "خطا در حذف محصول. لطفاً مجدد تلاش کنید",
        type: "error",
      });

      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    if (addProduct.isPending || editProduct.isPending) return;

    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      ...emptyFormData,
      images: [],
      features: [],
      ingredients: [],
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          خطا در دریافت محصولات
        </div>
      </div>
    );
  }

  const isProductSaving = addProduct.isPending || editProduct.isPending;

  return (
    <div dir="rtl">
      <div className="mx-auto max-w-7xl">
        {" "}
        <AdminToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleAdd}
        />
        <ProductTable
          products={data?.products  ?? []}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        isLoading={isProductSaving}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="حذف محصول"
        message={`آیا از حذف محصول "${deletingProductName}" مطمئن هستید؟`}
        confirmText="بله، حذف کن"
        cancelText="انصراف"
        type="danger"
        isLoading={deleteProduct.isPending}
      />

      <Toast
        isOpen={toast.isOpen}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}