"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  Package,
  Truck,
  Lock,
  Unlock,
  AlertCircle,
} from "lucide-react";

type BatchStatus = "OPEN" | "CLOSED";

type Batch = {
  id: string;
  batchNumber: number;
  title: string;
  status: BatchStatus;
  estimatedFreightPerKg: number | null;
  _count?: {
    products: number;
    shipments: number;
  };
};

type BatchForm = {
  batchNumber: string;
  title: string;
  estimatedFreightPerKg: string;
  status: BatchStatus;
};

const emptyForm: BatchForm = {
  batchNumber: "",
  title: "",
  estimatedFreightPerKg: "",
  status: "OPEN",
};

const statusLabels: Record<
  BatchStatus,
  {
    label: string;
    description: string;
    className: string;
    iconClassName: string;
  }
> = {
  OPEN: {
    label: "باز",
    description: "سفارش‌گیری فعال",
    className: "bg-green-50 text-green-600 border-green-100",
    iconClassName: "text-green-500",
  },

  CLOSED: {
    label: "بسته شده",
    description: "سفارش‌گیری تمام شده",
    className: "bg-gray-100 text-gray-500 border-gray-200",
    iconClassName: "text-gray-400",
  },
};

const isOrderTakingOpen = (status: BatchStatus) => status === "OPEN";

export default function OrderBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [form, setForm] = useState<BatchForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/order-batches", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "خطا در دریافت دوره‌ها");
      }

      setBatches(result.batches || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت دوره‌ها",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const openCreateModal = () => {
    setEditingBatch(null);

    const nextNumber =
      batches.length > 0
        ? Math.max(...batches.map((b) => b.batchNumber)) + 1
        : 1;

    setForm({
      ...emptyForm,
      batchNumber: String(nextNumber),
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (batch: Batch) => {
    setEditingBatch(batch);

    setForm({
      batchNumber: String(batch.batchNumber),
      title: batch.title,
      estimatedFreightPerKg:
        batch.estimatedFreightPerKg !== null
          ? String(batch.estimatedFreightPerKg)
          : "",
      status: batch.status,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingBatch(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.batchNumber.trim() ||
      Number.isNaN(Number(form.batchNumber))
    ) {
      setError("شماره دوره را به‌صورت عدد وارد کنید.");
      return;
    }

    if (!form.title.trim()) {
      setError("عنوان دوره را وارد کنید.");
      return;
    }

    if (
      form.estimatedFreightPerKg.trim() !== "" &&
      Number.isNaN(Number(form.estimatedFreightPerKg))
    ) {
      setError("نرخ باربری واردشده معتبر نیست.");
      return;
    }

    if (
      editingBatch &&
      editingBatch.status === "OPEN" &&
      form.status !== "OPEN"
    ) {
      const confirmed = window.confirm(
        "با این تغییر، سفارش‌گیری این دوره متوقف می‌شود.\n\n" +
          "کاربرانی که هنوز این دوره را در سبد دارند، در مرحله افزودن/ثبت نهایی سفارش دوباره بررسی خواهند شد.\n\n" +
          "آیا مطمئن هستید؟",
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const isEditing = Boolean(editingBatch);

      const response = await fetch(
        isEditing
          ? `/api/order-batches/${editingBatch!.id}`
          : "/api/order-batches",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batchNumber: Number(form.batchNumber),
            title: form.title.trim(),
            estimatedFreightPerKg:
              form.estimatedFreightPerKg.trim() === ""
                ? null
                : Number(form.estimatedFreightPerKg),
            status: form.status,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "خطا در ذخیره دوره");
      }

      setModalOpen(false);
      setEditingBatch(null);
      setForm(emptyForm);

      setSuccess(
        isEditing
          ? "دوره با موفقیت ویرایش شد."
          : "دوره با موفقیت ایجاد شد.",
      );

      await loadBatches();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در ذخیره دوره",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (batch: Batch) => {
    const confirmed = window.confirm(
      `آیا از حذف دوره «${batch.title}» (دوره ${batch.batchNumber}) مطمئن هستید؟`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(batch.id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/order-batches/${batch.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "خطا در حذف دوره");
      }

      setSuccess("دوره با موفقیت حذف شد.");

      await loadBatches();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در حذف دوره",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBatches = batches.filter((batch) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      batch.title.toLowerCase().includes(query) ||
      String(batch.batchNumber).includes(query)
    );
  });

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
                  <Layers size={24} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                    دوره‌های سفارش‌گیری
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    مدیریت دوره‌های سفارش‌گیری محصولات وارداتی و نرخ باربری هر دوره
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-600"
              >
                <Plus size={19} />
                <span>افزودن دوره</span>
              </button>
            </div>
          </section>

          {error && !modalOpen && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
              <Check size={18} />
              {success}
            </div>
          )}

          <section className="rounded-3xl border border-green-100 bg-green-50/60 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-500 shadow-sm">
                <Unlock size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-green-700">
                  وضعیت سفارش‌گیری
                </p>

                <p className="mt-1 text-xs leading-6 text-green-600">
                  فقط دوره‌هایی که وضعیت آن‌ها «باز» است، امکان سفارش‌گیری دارند.
                  با تغییر وضعیت دوره به «در حال تأمین»، «رسیده به انبار» یا
                  «بسته شده»، سفارش‌گیری آن دوره متوقف می‌شود.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
            <div className="relative">
              <Search
                size={19}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی دوره (عنوان یا شماره)..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pr-11 pl-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-50"
              />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  لیست دوره‌ها
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {filteredBatches.length.toLocaleString("fa-IR")} دوره
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-75 items-center justify-center">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-5 py-4 text-sm text-gray-500">
                  <Loader2
                    size={20}
                    className="animate-spin text-pink-500"
                  />
                  <span>در حال دریافت دوره‌ها...</span>
                </div>
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl bg-gray-50 px-5 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-gray-300 shadow-sm">
                  <Layers size={30} />
                </div>

                <p className="font-bold text-gray-700">
                  {search
                    ? "دوره‌ای با این جستجو پیدا نشد"
                    : "هنوز دوره‌ای ایجاد نشده است"}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-pink-600"
                  >
                    <Plus size={17} />
                    ایجاد اولین دوره
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="hidden overflow-hidden rounded-2xl border border-gray-100 md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-4 text-right text-xs font-bold text-gray-500">
                          دوره
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold text-gray-500">
                          وضعیت سفارش‌گیری
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold text-gray-500">
                          نرخ باربری
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-bold text-gray-500">
                          محصولات / مرسوله‌ها
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold text-gray-500">
                          عملیات
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredBatches.map((batch) => {
                        const status = statusLabels[batch.status];
                        const orderTakingOpen =
                          isOrderTakingOpen(batch.status);

                        return (
                          <tr
                            key={batch.id}
                            className={`transition hover:bg-gray-50/70 ${
                              batch.status === "CLOSED"
                                ? "bg-gray-50/40"
                                : ""
                            }`}
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                                  <Layers size={18} />
                                </div>

                                <div className="min-w-0">
                                  <p className="font-bold text-gray-800">
                                    {batch.title}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-400">
                                    دوره شماره{" "}
                                    {batch.batchNumber.toLocaleString("fa-IR")}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex flex-col items-start gap-1.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                                >
                                  {orderTakingOpen ? (
                                    <Unlock size={13} />
                                  ) : (
                                    <Lock size={13} />
                                  )}

                                  {status.label}
                                </span>

                                <span
                                  className={`text-[11px] font-medium ${
                                    orderTakingOpen
                                      ? "text-green-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {status.description}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                              {batch.estimatedFreightPerKg !== null
                                ? `${batch.estimatedFreightPerKg.toLocaleString(
                                    "fa-IR",
                                  )} ¥/kg`
                                : "—"}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <Package
                                    size={16}
                                    className="text-gray-400"
                                  />

                                  <span>
                                    {(
                                      batch._count?.products ?? 0
                                    ).toLocaleString("fa-IR")}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <Truck
                                    size={16}
                                    className="text-gray-400"
                                  />

                                  <span>
                                    {(
                                      batch._count?.shipments ?? 0
                                    ).toLocaleString("fa-IR")}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(batch)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition hover:bg-blue-100"
                                  title="ویرایش"
                                >
                                  <Pencil size={17} />
                                </button>

                                <button
                                  type="button"
                                  disabled={deletingId === batch.id}
                                  onClick={() => handleDelete(batch)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="حذف"
                                >
                                  {deletingId === batch.id ? (
                                    <Loader2
                                      size={17}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash2 size={17} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 md:hidden">
                  {filteredBatches.map((batch) => {
                    const status = statusLabels[batch.status];
                    const orderTakingOpen =
                      isOrderTakingOpen(batch.status);

                    return (
                      <div
                        key={batch.id}
                        className={`rounded-2xl border p-4 ${
                          batch.status === "CLOSED"
                            ? "border-gray-200 bg-gray-50/50"
                            : "border-gray-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                              <Layers size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold text-gray-800">
                                {batch.title}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                دوره{" "}
                                {batch.batchNumber.toLocaleString("fa-IR")}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col items-end gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                            >
                              {orderTakingOpen ? (
                                <Unlock size={12} />
                              ) : (
                                <Lock size={12} />
                              )}

                              {status.label}
                            </span>

                            <span
                              className={`text-[10px] font-medium ${
                                orderTakingOpen
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {status.description}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Package
                                size={15}
                                className="text-gray-400"
                              />

                              <span>
                                {(
                                  batch._count?.products ?? 0
                                ).toLocaleString("fa-IR")}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Truck
                                size={15}
                                className="text-gray-400"
                              />

                              <span>
                                {(
                                  batch._count?.shipments ?? 0
                                ).toLocaleString("fa-IR")}
                              </span>
                            </div>

                            {batch.estimatedFreightPerKg !== null && (
                              <span>
                                {batch.estimatedFreightPerKg.toLocaleString(
                                  "fa-IR",
                                )}{" "}
                                ¥/kg
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(batch)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-500"
                              title="ویرایش"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === batch.id}
                              onClick={() => handleDelete(batch)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 disabled:opacity-50"
                              title="حذف"
                            >
                              {deletingId === batch.id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-[2px]">
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-bold text-gray-800">
                  {editingBatch ? "ویرایش دوره" : "افزودن دوره"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  اطلاعات دوره سفارش‌گیری را وارد کنید
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="batch-number"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  شماره دوره
                </label>

                <input
                  id="batch-number"
                  type="number"
                  min="1"
                  value={form.batchNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      batchNumber: e.target.value,
                    }))
                  }
                  placeholder="مثلاً 16"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              <div>
                <label
                  htmlFor="batch-title"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  عنوان دوره
                </label>

                <input
                  id="batch-title"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="مثلاً سفارش‌گیری دوره ۱۶ شهریور"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
                />
              </div>

              <div>
                <label
                  htmlFor="batch-freight"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  نرخ تخمینی باربری
                  <span className="mr-1 text-xs font-normal text-gray-400">
                    (یوان به ازای هر کیلوگرم)
                  </span>
                </label>

                <input
                  id="batch-freight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.estimatedFreightPerKg}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estimatedFreightPerKg: e.target.value,
                    }))
                  }
                  placeholder="مثلاً 85"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
                />

                <p className="mt-1.5 text-xs leading-5 text-gray-400">
                  این فقط تخمین اولیه است؛ مبلغ نهایی باربری هر مرسوله بعد از
                  وزن‌کشی و بر اساس نرخ روز محاسبه می‌شود.
                </p>
              </div>

              <div>
                <label
                  htmlFor="batch-status"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  وضعیت دوره
                </label>

                <select
                  id="batch-status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as BatchStatus,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
                >
                  {(Object.keys(statusLabels) as BatchStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {statusLabels[key].label} —{" "}
                      {statusLabels[key].description}
                    </option>
                  ))}
                </select>

                <div
                  className={`mt-3 flex items-start gap-2 rounded-xl border px-3 py-3 ${
                    isOrderTakingOpen(form.status)
                      ? "border-green-100 bg-green-50 text-green-600"
                      : "border-gray-100 bg-gray-50 text-gray-500"
                  }`}
                >
                  {isOrderTakingOpen(form.status) ? (
                    <Unlock
                      size={17}
                      className="mt-0.5 shrink-0"
                    />
                  ) : (
                    <Lock
                      size={17}
                      className="mt-0.5 shrink-0"
                    />
                  )}

                  <div>
                    <p className="text-xs font-bold">
                      {isOrderTakingOpen(form.status)
                        ? "سفارش‌گیری فعال است"
                        : "سفارش‌گیری غیرفعال است"}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 opacity-80">
                      {isOrderTakingOpen(form.status)
                        ? "کاربران می‌توانند محصولات این دوره را سفارش دهند."
                        : "کاربران دیگر نمی‌توانند محصولات این دوره را برای سفارش جدید اضافه کنند."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />

                      <span>
                        {editingBatch
                          ? "ذخیره تغییرات"
                          : "ایجاد دوره"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}