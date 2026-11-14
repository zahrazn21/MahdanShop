import { Check } from "lucide-react";

interface ProductFeaturesProps {
  features?: string[] | null;
}

export function ProductFeatures({
  features,
}: ProductFeaturesProps) {
  if (!features?.length) {
    return null;
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {features.map((feature, index) => (
        <li
          key={`${feature}-${index}`}
          className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 text-sm text-gray-600"
        >
          <Check className="h-4 w-4 shrink-0 text-pink-500" />

          {feature}
        </li>
      ))}
    </ul>
  );
}