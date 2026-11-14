"use client";

import { useState, useTransition } from "react";

type Props = {
  productId: string;
  initialFavorited?: boolean;
  onToggled?: (favorited: boolean) => void;
  className?: string;
};

export default function FavoriteHeartButton({
  productId,
  initialFavorited = true,
  onToggled,
  className = "",
}: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !favorited;

    setFavorited(next);

    startTransition(async () => {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (!res.ok) {
          throw new Error("failed");
        }

        const data = await res.json();

        setFavorited(data.favorited);
        onToggled?.(data.favorited);
      } catch {
        setFavorited(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={favorited}
      aria-label={
        favorited
          ? "حذف از علاقه‌مندی‌ها"
          : "افزودن به علاقه‌مندی‌ها"
      }
      className={`
        group relative
        flex
        h-6 w-6
        items-center justify-center
        rounded-full
        bg-white/90
        shadow-[0_1px_6px_rgba(233,64,127,0.20)]
        backdrop-blur
        transition-transform
        active:scale-90
        disabled:opacity-60

        md:h-9 md:w-9
        md:shadow-[0_2px_10px_rgba(233,64,127,0.25)]

        ${className}
      `}
    >
      <svg
        viewBox="0 0 24 24"
        className={`
          h-3.5 w-3.5
          transition-all duration-200

          md:h-5 md:w-5

          ${
            favorited
              ? "scale-110 fill-pink-500 stroke-pink-500"
              : "fill-none stroke-pink-400 group-hover:stroke-pink-500"
          }
        `}
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.5s-7.5-4.6-9.9-9.2C.6 8 2 4.6 5.4 3.8c2-.5 4 .3 5.1 2.1a.6.6 0 0 0 1 0c1.1-1.8 3.1-2.6 5.1-2.1 3.4.8 4.8 4.2 3.3 7.5-2.4 4.6-9.9 9.2-9.9 9.2Z"
        />
      </svg>
    </button>
  );
}