import { useState } from "react";

interface UseProductShareParams {
  title: string;
}

export function useProductShare({ title }: UseProductShareParams) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      return;
    }
  };

  return {
    copied,
    handleShare,
  };
}