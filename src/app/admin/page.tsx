"use client";

import { useEffect, useState } from "react";
import { ProductFormData } from "../../components/admin/type";
import LoadingSpinner from "../../components/admin/LoadingSpinner";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminToolbar from "../../components/admin/AdminToolbar";
import ProductTable from "../../components/admin/ProductTable";
import ProductModal from "../../components/admin/ProductModal";
import { useProducts } from "../../hooks/useProducts";
import { Product } from "../../components/product/ProductItems";
import {
  useAddProduct,
  useDeleteProduct,
  useEditProduct,
} from "../../hooks/useProductMutations";
import ConfirmModal from "../../shared/ui/ConfirmModal";
import Toast from "../../shared/ui/Toast";

export default function AdminPage() {
  const { data, isLoading: isloading, error } = useProducts();
  const editProduct = useEditProduct();
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingProductName, setDeletingProductName] = useState("");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "cosmetics",
    brand: "",
    scope: "imported",
    stock: "",
    description: "",
  });


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      originalPrice: String(product.originalPrice || ""),
      image: product.image,
      category: product.category,
      brand: product.brand,
      scope: product.scope,
      stock: String(product.stock),
      description: product.description || "",
    });

    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      image: "/images/products/new.png",
      images: [],
      category: "cosmetics",
      brand: "",
      scope: "imported",
      stock: "",
      description: "",
      features: [],
      ingredients: [],
      howToUse: "",
    });

    setShowModal(true);
  };

  const handleSubmit = async (data: ProductFormData) => {
    const productData = {
      name: data.name.trim(),
      price: Number(data.price),
      originalPrice: data.originalPrice
        ? Number(data.originalPrice)
        : undefined,
      image: data.image,
      images: data.images?.length ? data.images : undefined,
      category: data.category,
      brand: data.brand,
      scope: data.scope,
      stock: Number(data.stock),
      isAvailable: Number(data.stock) > 0,
      description: data.description,
      features: data.features?.length ? data.features : undefined,
      ingredients: data.ingredients?.length ? data.ingredients : undefined,
      howToUse: data.howToUse || undefined,
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
    } catch (error) {
      console.error(error);
    }
  };

  
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });

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
     
      setToast({
        isOpen: true,
        message: "خطا در حذف محصول. لطفاً مجدد تلاش کنید",
        type: "error",
      });
      
      setShowDeleteModal(false);
    }
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };
  if (isloading) return <LoadingSpinner />;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <AdminToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleAdd}
        />
        <ProductTable
          products={data}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
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
        isLoading={deleteProduct.isPending} // غیرفعال کردن دکمه در حال حذف
      />

      {/* توست نوتیفیکیشن */}
      <Toast
        isOpen={toast.isOpen}
        onClose={handleCloseToast}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
