import { useEffect, useState } from "react";
import { OrderBatch } from "./types";

export function useOrderBatches(isOpen: boolean, currentBatchId: string | null) {
  const [batches, setBatches] = useState<OrderBatch[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingBatches(true);

    fetch("/api/order-batches")
      .then((res) => res.json())
      .then((data) => setBatches(data.batches ?? []))
      .catch(() => setBatches([]))
      .finally(() => setIsLoadingBatches(false));
  }, [isOpen]);

  const openBatches = batches.filter(
    (b) =>
      b.status === "OPEN" ||
      b.id === currentBatchId,
  );

  return { batches, isLoadingBatches, openBatches };
}
