"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Check,
  Clock,
  MessageSquare,
  Search,
  Star,
  User,
  X,
} from "lucide-react";

import {
  useAdminReviews,
  useUpdateReviewStatus,
} from "@/src/shared/hooks/useAdminReviews";

type FilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const statusMap = {
  PENDING: {
    label: "در انتظار بررسی",
    className: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },

  APPROVED: {
    label: "تأیید شده",
    className: "bg-green-100 text-green-700",
    icon: Check,
  },

  REJECTED: {
    label: "رد شده",
    className: "bg-red-100 text-red-700",
    icon: X,
  },
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

export default function AdminReviewsPage() {
  const { data, isLoading, error } = useAdminReviews();

  const updateStatus = useUpdateReviewStatus();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const reviews = data?.reviews ?? [];

  const filteredReviews = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesStatus =
        filter === "ALL" || review.status === filter;

      if (!matchesStatus) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      return (
        review.comment.toLowerCase().includes(searchValue) ||
        review.user.username.toLowerCase().includes(searchValue) ||
        review.user.email.toLowerCase().includes(searchValue) ||
        review.product.name.toLowerCase().includes(searchValue)
      );
    });
  }, [reviews, search, filter]);

  const pendingCount = reviews.filter(
    (review) => review.status === "PENDING",
  ).length;

  const approvedCount = reviews.filter(
    (review) => review.status === "APPROVED",
  ).length;

  const rejectedCount = reviews.filter(
    (review) => review.status === "REJECTED",
  ).length;

  const handleStatusChange = async (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      await updateStatus.mutateAsync({
        id,
        status,
      });
    } catch (error) {
      console.error("Review status error:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />

          <span className="text-sm text-gray-500">
            در حال دریافت نظرات...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-red-600">
          {error instanceof Error
            ? error.message
            : "خطا در دریافت نظرات"}
        </div>
      </div>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                  <MessageSquare size={22} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                    مدیریت نظرات
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    بررسی، تأیید و رد نظرات کاربران
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <SummaryBadge
                label="در انتظار"
                value={pendingCount}
                className="bg-yellow-50 text-yellow-700"
              />

              <SummaryBadge
                label="تأیید شده"
                value={approvedCount}
                className="bg-green-50 text-green-700"
              />

              <SummaryBadge
                label="رد شده"
                value={rejectedCount}
                className="bg-red-50 text-red-700"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="جستجو در نظرات، کاربر یا محصول..."
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pr-11 pl-4 text-sm outline-none transition focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "ALL"}
                onClick={() => setFilter("ALL")}
              >
                همه ({reviews.length})
              </FilterButton>

              <FilterButton
                active={filter === "PENDING"}
                onClick={() => setFilter("PENDING")}
              >
                در انتظار ({pendingCount})
              </FilterButton>

              <FilterButton
                active={filter === "APPROVED"}
                onClick={() => setFilter("APPROVED")}
              >
                تأیید شده ({approvedCount})
              </FilterButton>

              <FilterButton
                active={filter === "REJECTED"}
                onClick={() => setFilter("REJECTED")}
              >
                رد شده ({rejectedCount})
              </FilterButton>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
              <MessageSquare
                size={42}
                className="mx-auto mb-4 text-gray-300"
              />

              <p className="font-bold text-gray-600">
                نظری برای نمایش وجود ندارد
              </p>

              <p className="mt-2 text-sm text-gray-400">
                با تغییر فیلتر یا عبارت جستجو دوباره امتحان کنید.
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isUpdating={
                  updateStatus.isPending &&
                  updateStatus.variables?.id === review.id
                }
                onApprove={() =>
                  handleStatusChange(
                    review.id,
                    "APPROVED",
                  )
                }
                onReject={() =>
                  handleStatusChange(
                    review.id,
                    "REJECTED",
                  )
                }
              />
            ))
          )}
        </section>

        <div className="text-center text-xs text-gray-400">
          نمایش {filteredReviews.length.toLocaleString("fa-IR")} نظر
          از{" "}
          {reviews.length.toLocaleString("fa-IR")} نظر
        </div>
      </div>
    </main>
  );
}

function ReviewCard({
  review,
  onApprove,
  onReject,
  isUpdating,
}: {
  review: NonNullable<
    ReturnType<typeof useAdminReviews>["data"]
  >["reviews"][number];

  onApprove: () => void;
  onReject: () => void;
  isUpdating: boolean;
}) {
  const status = statusMap[review.status];

  const StatusIcon = status.icon;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
            <User size={21} />
          </div>

          <div className="min-w-0">
            <p className="font-bold text-gray-800">
              {review.user.username}
            </p>

            <p className="mt-1 truncate text-xs text-gray-400">
              {review.user.email}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        <div
          className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
        >
          <StatusIcon size={14} />
          {status.label}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
          {review.product.image ? (
            <Image
              width={500}
              height={500}
              src={review.product.image}
              alt={review.product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <PackageIcon />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400">
            محصول
          </p>

          <p className="mt-1 truncate font-bold text-gray-700">
            {review.product.name}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className={
              index < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }
          />
        ))}

        <span className="mr-2 text-sm font-bold text-gray-600">
          {review.rating.toLocaleString("fa-IR")} از ۵
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-gray-50 p-4">
        <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
          {review.comment}
        </p>
      </div>

      {review.status === "PENDING" && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isUpdating}
            onClick={onReject}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
            رد نظر
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={onApprove}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-green-500 px-5 text-sm font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={18} />
            تأیید نظر
          </button>
        </div>
      )}

      {review.status === "APPROVED" && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <Check size={17} />
          این نظر در سایت نمایش داده می‌شود.
        </div>
      )}

      {review.status === "REJECTED" && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <X size={17} />
          این نظر در سایت نمایش داده نمی‌شود.
        </div>
      )}
    </article>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-xl px-4 text-sm font-bold transition ${
        active
          ? "bg-pink-500 text-white shadow-sm"
          : "bg-gray-50 text-gray-500 hover:bg-pink-50 hover:text-pink-500"
      }`}
    >
      {children}
    </button>
  );
}

function SummaryBadge({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-2 text-sm font-bold ${className}`}
    >
      {label}: {value.toLocaleString("fa-IR")}
    </div>
  );
}

function PackageIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}