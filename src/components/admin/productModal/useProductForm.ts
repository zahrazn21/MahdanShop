/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import {
  ProductFormData,
  ProductFormSchema,
  ProductSubmitData,
} from "@/src/shared/lib/validators/productValidation";
import { Product } from "@/src/shared/types/product";
import { Tab } from "./types";

interface UseProductFormParams {
  isOpen: boolean;
  editingProduct: Product | null;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSubmit: (data: ProductSubmitData) => Promise<void> | void;

  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;

  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  touched: Record<string, boolean>;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  isUploadingMain: boolean;
  isUploadingGallery: boolean;
  isLoading: boolean;
}

export function useProductForm({
  isOpen,
  editingProduct,
  formData,
  setFormData,
  onSubmit,
  setActiveTab,
  errors,
  setErrors,
  touched,
  setTouched,
  isUploadingMain,
  isUploadingGallery,
  isLoading,
}: UseProductFormParams) {
  useEffect(() => {
    if (!isOpen) return;

    setActiveTab("basic");
    setErrors({});
    setTouched({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingProduct?.id]);

  useEffect(() => {
    if (!isOpen) return;

    if (editingProduct) {
      setFormData({
        name: editingProduct.name ?? "",
        slug: editingProduct.slug ?? "",
        description: editingProduct.description ?? "",
        price:
          editingProduct.price !== null && editingProduct.price !== undefined
            ? String(editingProduct.price)
            : "",

        originalPrice:
          editingProduct.originalPrice !== null &&
          editingProduct.originalPrice !== undefined
            ? String(editingProduct.originalPrice)
            : "",

        stock:
          editingProduct.stock !== null && editingProduct.stock !== undefined
            ? String(editingProduct.stock)
            : "",

        weight:
          editingProduct.weight !== null && editingProduct.weight !== undefined
            ? String(editingProduct.weight)
            : "",
        brand: editingProduct.brand ?? "",
        category: editingProduct.category ?? "",
        status: editingProduct.status ?? "DRAFT",

        image: editingProduct.image ?? "",

        images: Array.isArray(editingProduct.images)
          ? editingProduct.images.filter(
              (image): image is string => typeof image === "string",
            )
          : [],

        features: Array.isArray(editingProduct.features)
          ? editingProduct.features.filter(
              (item): item is string => typeof item === "string",
            )
          : [],

        ingredients: Array.isArray(editingProduct.ingredients)
          ? editingProduct.ingredients.filter(
              (item): item is string => typeof item === "string",
            )
          : [],

        howToUse: editingProduct.howToUse ?? "",

        specifications: Array.isArray(editingProduct.specifications)
          ? editingProduct.specifications.map((spec) => ({
              key: spec.key ?? "",
              label: spec.label ?? "",
              value: spec.value ?? "",
            }))
          : [],

        variants: Array.isArray(editingProduct.variants)
          ? editingProduct.variants.map((variant) => ({
              id: variant.id ?? crypto.randomUUID(),

              name: variant.name ?? "",

              hexCode: variant.hexCode ?? "",

              colorName: variant.colorName ?? "",

              stock:
                variant.stock !== null && variant.stock !== undefined
                  ? String(variant.stock)
                  : "0",

              price:
                variant.price !== null && variant.price !== undefined
                  ? String(variant.price)
                  : "",

              size: variant.size ?? "",

              volume:
                variant.volume !== null && variant.volume !== undefined
                  ? String(variant.volume)
                  : "",

              volumeUnit:
                variant.volumeUnit === "ml" ||
                variant.volumeUnit === "gr" ||
                variant.volumeUnit === "oz"
                  ? variant.volumeUnit
                  : "ml",

              sku: variant.sku ?? "",

              images: Array.from(
                new Set([
                  ...(variant.image ? [variant.image] : []),
                  ...(Array.isArray(variant.images) ? variant.images : []),
                ].filter((image): image is string => typeof image === "string" && !!image),)
              ),
            }))
          : [],

        shippingClass: editingProduct.shippingClass ?? "SMALL",

        availabilityType: editingProduct.availabilityType ?? "IN_STOCK",

        batchId: editingProduct.batchId ?? null,

        estimatedDeliveryDays:
          editingProduct.estimatedDeliveryDays !== null &&
          editingProduct.estimatedDeliveryDays !== undefined
            ? String(editingProduct.estimatedDeliveryDays)
            : "",

        preOrderNote: editingProduct.preOrderNote ?? "",

        scope: editingProduct.scope ?? "domestic",

        sku: editingProduct.sku ?? "",

        expirationDate: editingProduct.expirationDate ?? "",
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        image: prev.image || "",
        images: Array.isArray(prev.images) ? prev.images : [],
        features: Array.isArray(prev.features) ? prev.features : [],
        ingredients: Array.isArray(prev.ingredients) ? prev.ingredients : [],
        specifications: Array.isArray(prev.specifications)
          ? prev.specifications
          : [],
        variants: Array.isArray(prev.variants) ? prev.variants : [],
        availabilityType: prev.availabilityType || "IN_STOCK",
        batchId: prev.batchId ?? null,
        estimatedDeliveryDays: prev.estimatedDeliveryDays ?? "",
        preOrderNote: prev.preOrderNote ?? "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingProduct?.id, setFormData]);

  const validateField = (name: string, value: any) => {
    const testData: ProductFormData = {
      ...formData,
      [name]: value,
    };

    const result = ProductFormSchema.safeParse(testData);

    if (!result.success) {
      const fieldError = result.error.issues.find(
        (err) => err.path[0]?.toString() === name,
      );

      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError.message,
        }));
        return;
      }
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleBlur = (field: keyof ProductFormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    validateField(field, formData[field]);
  };

  const handleFieldChange = (
    field: keyof ProductFormData,
    value: ProductFormData[keyof ProductFormData],
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleAvailabilityTypeChange = (value: "IN_STOCK" | "PRE_ORDER") => {
    setFormData((prev: any) => ({
      ...prev,
      availabilityType: value,
      ...(value === "IN_STOCK"
        ? {
            batchId: null,
            estimatedDeliveryDays: "",
            preOrderNote: "",
          }
        : {}),
    }));

    if (touched.availabilityType) {
      validateField("availabilityType", value);
    }

    if (value === "IN_STOCK") {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.batchId;
        delete next.estimatedDeliveryDays;
        return next;
      });
    }
  };

  const addFeature = () => {
    setFormData((prev: any) => ({
      ...prev,
      features: [...(Array.isArray(prev.features) ? prev.features : []), ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev: any) => {
      const features = Array.isArray(prev.features) ? [...prev.features] : [];

      features[index] = value;

      return {
        ...prev,
        features,
      };
    });
  };

  const removeFeature = (index: number) => {
    setFormData((prev: any) => {
      const features = Array.isArray(prev.features) ? [...prev.features] : [];

      features.splice(index, 1);

      return {
        ...prev,
        features,
      };
    });
  };

  const addIngredient = () => {
    setFormData((prev: any) => ({
      ...prev,
      ingredients: [
        ...(Array.isArray(prev.ingredients) ? prev.ingredients : []),
        "",
      ],
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev: any) => {
      const ingredients = Array.isArray(prev.ingredients)
        ? [...prev.ingredients]
        : [];

      ingredients[index] = value;

      return {
        ...prev,
        ingredients,
      };
    });
  };

  const removeIngredient = (index: number) => {
    setFormData((prev: any) => {
      const ingredients = Array.isArray(prev.ingredients)
        ? [...prev.ingredients]
        : [];

      ingredients.splice(index, 1);

      return {
        ...prev,
        ingredients,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploadingMain || isUploadingGallery || isLoading) {
      return;
    }

    const normalizedFormData = {
      ...formData,
      image: formData.image || "",
      shippingClass: formData.shippingClass || "SMALL",

      scope:
        formData.availabilityType === "PRE_ORDER" ? "imported" : "domestic",

      images: Array.isArray(formData.images)
        ? formData.images.filter(
            (image: unknown): image is string =>
              typeof image === "string" && image.trim() !== "",
          )
        : [],
      features: Array.isArray(formData.features)
        ? formData.features.filter(
            (item: unknown): item is string =>
              typeof item === "string" && item.trim() !== "",
          )
        : [],
      ingredients: Array.isArray(formData.ingredients)
        ? formData.ingredients.filter(
            (item: unknown): item is string =>
              typeof item === "string" && item.trim() !== "",
          )
        : [],
      slug:
        formData.slug?.trim() ||
        formData.name.trim().toLowerCase().replace(/\s+/g, "-"),

      batchId:
        formData.availabilityType === "PRE_ORDER" ? formData.batchId : null,

      estimatedDeliveryDays:
        formData.availabilityType === "PRE_ORDER" &&
        formData.estimatedDeliveryDays.trim() !== ""
          ? Number(formData.estimatedDeliveryDays)
          : undefined,

      preOrderNote:
        formData.availabilityType === "PRE_ORDER" ? formData.preOrderNote : "",
    };

    const result = ProductFormSchema.safeParse(normalizedFormData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString();

        if (field && !newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);

      const allTouched: Record<string, boolean> = {};

      Object.keys(normalizedFormData).forEach((key) => {
        allTouched[key] = true;
      });

      setTouched(allTouched);

      const basicFields = [
        "name",
        "price",
        "brand",
        "stock",
        "category",
        "scope",
        "availabilityType",
        "batchId",
        "estimatedDeliveryDays",
      ];

      const imageFields = ["image", "images"];

      const seoFields = ["slug"];

      if (Object.keys(newErrors).some((field) => basicFields.includes(field))) {
        setActiveTab("basic");
      } else if (
        Object.keys(newErrors).some((field) => imageFields.includes(field))
      ) {
        setActiveTab("images");
      } else if (
        Object.keys(newErrors).some((field) => seoFields.includes(field))
      ) {
        setActiveTab("seo");
      } else {
        setActiveTab("details");
      }

      return;
    }

    setErrors({});
    setTouched({});

    const normalizedVariants = (formData.variants ?? []).map((variant) => ({
      id: variant.id,
      name: variant.name.trim(),

      hexCode: variant.hexCode.trim() || undefined,

      colorName: variant.colorName.trim() || undefined,

      stock: Number(variant.stock) || 0,

      price:
        variant.price.trim() === "" || Number(variant.price) === 0
          ? Number(formData.price)
          : Number(variant.price),

      size: variant.size.trim() || undefined,

      volume: variant.volume.trim() === "" ? undefined : Number(variant.volume),

      volumeUnit: variant.volumeUnit,

      sku: variant.sku.trim() || undefined,

      image: variant.images?.find(Boolean) || undefined,

      images: Array.isArray(variant.images)
        ? variant.images.filter(Boolean)
        : [],
    }));

    onSubmit({
      ...result.data,
      variants: normalizedVariants,
      images: Array.isArray(result.data.images) ? [...result.data.images] : [],
    });
  };

  const hasErrorsInTab = (tab: Tab) => {
    const tabFields: Record<Tab, string[]> = {
      basic: [
        "name",
        "price",
        "brand",
        "stock",
        "category",
        "scope",
        "availabilityType",
        "batchId",
        "estimatedDeliveryDays",
      ],
      images: ["image", "images"],
      details: [],
      seo: ["slug"],
    };

    return tabFields[tab].some((field) => Boolean(errors[field]));
  };

  return {
    handleFieldChange,
    handleBlur,
    handleAvailabilityTypeChange,
    handleSubmit,
    hasErrorsInTab,
    addFeature,
    updateFeature,
    removeFeature,
    addIngredient,
    updateIngredient,
    removeIngredient,
  };
}