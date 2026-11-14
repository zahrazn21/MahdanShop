import { useState } from "react";
import { ShippingInfo } from "../types/checkout";
import { ShippingInfoSchema } from "../lib/validators/orderValidation";

interface UseCheckoutFormProps {
  initialData?: ShippingInfo | null;
  onSubmit: (data: ShippingInfo) => void;
}

export function useCheckoutForm({
  initialData,
  onSubmit,
}: UseCheckoutFormProps) {
  const [formData, setFormData] = useState<ShippingInfo>(
    initialData ?? {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      deliveryNote: "",
      telegramId: "",
    },
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingInfo, string>>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof ShippingInfo, boolean>>
  >({});

  const validateField = (
    name: keyof ShippingInfo,
    value: string,
  ) => {
    const result = ShippingInfoSchema.shape[name].safeParse(value);

    if (!result.success) {
      return result.error.issues[0]?.message ?? "مقدار وارد شده معتبر نیست";
    }

    return "";
  };

  const handleChange = (
    name: keyof ShippingInfo,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);

      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    }
  };

  const handleBlur = (
    name: keyof ShippingInfo,
  ) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(
      name,
      formData[name] ?? "",
    );

    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  const validate = () => {
    const result = ShippingInfoSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Partial<
      Record<keyof ShippingInfo, string>
    > = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ShippingInfo;

      if (!newErrors[field]) {
        newErrors[field] = issue.message;
      }
    });

    setErrors(newErrors);

    const newTouched: Partial<
      Record<keyof ShippingInfo, boolean>
    > = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ShippingInfo;
      newTouched[field] = true;
    });

    setTouched((prev) => ({
      ...prev,
      ...newTouched,
    }));

    return false;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(formData);
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData,
  };
}