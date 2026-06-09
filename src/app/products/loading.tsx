import { SkeletonProducts } from "../../shared/ui/SkeletonProducts";

export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 md:mx-20  md:py-10  ">
      {[...Array(4)].map((_, i) => (
        <SkeletonProducts key={i} />
      ))}
    </div>
  );
}