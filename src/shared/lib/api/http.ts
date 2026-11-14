type ErrorBody = { error?: string };

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = (await res.json().catch(() => ({}))) as T & ErrorBody;
  if (!res.ok) throw new Error(data.error ?? "خطایی رخ داد");
  return data;
}

export const json = (body: unknown): RequestInit => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const d = await request<{ url: string }>("/api/upload", {
    method: "POST",
    body: fd,
  });
  if (!d.url) throw new Error("آدرس رسید دریافت نشد");
  return d.url;
}