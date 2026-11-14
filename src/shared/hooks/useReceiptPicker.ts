import { useCallback, useEffect, useState } from "react";

export function useReceiptPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pick = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const clear = useCallback(() => {
    setFile(null);
    setPreview(null);
  }, []);

  return { file, preview, pick, clear };
}