import type { OrderDetail } from "@/src/shared/types/order";

type ErrorBody = { error?: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = (await res.json().catch(() => ({}))) as T & ErrorBody;
  if (!res.ok) throw new Error(data.error ?? "خطایی رخ داد");
  return data;
}

const json = (body: unknown): RequestInit => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const orderApi = {
  get: (id: string) =>
    request<{ order: OrderDetail }>(`/api/orders/${id}`).then((d) => d.order),

  uploadImage: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const d = await request<{ url: string }>("/api/upload", {
      method: "POST",
      body: fd,
    });
    return d.url;
  },

  submitPayment: (id: string, receiptImage: string) =>
    request<{ success: boolean }>(`/api/orders/${id}/payment`, {
      method: "POST",
      ...json({ receiptImage, payerName: "", payerCardLast4: "", trackingNumber: "" }),
    }),

  resetPayment: (id: string) =>
    request<{ order: OrderDetail }>(`/api/orders/${id}/payment/reset`, {
      method: "PATCH",
    }),

  submitFreightPayment: (orderId: string, shipmentId: string, receiptImage: string) =>
    request<{ success: boolean }>(
      `/api/orders/${orderId}/shipments/${shipmentId}/freight-payment`,
      { method: "POST", ...json({ receiptImage }) },
    ),
};