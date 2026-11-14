import { useState } from "react";

interface UseProductFavoriteParams {
  productId: string;
  initialFavorited: boolean;
}

export function useProductFavorite({
  productId,
  initialFavorited,
}: UseProductFavoriteParams) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    const previous = favorited;
    const next = !previous;

    setFavorited(next);
    setIsTogglingFavorite(true);

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update favorite");
      }

      const data = await response.json();

      setFavorited(Boolean(data.favorited));
    } catch {
      setFavorited(previous);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return {
    favorited,
    isTogglingFavorite,
    handleToggleFavorite,
  };
}