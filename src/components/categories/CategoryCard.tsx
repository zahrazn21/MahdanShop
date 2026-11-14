import Image from "next/image";
import { Category } from "./CategoryItems";
import Link from "next/link";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="group transition-all duration-300  hover:-translate-y-2 hover:scale-105 hover:shadow-[0_0px_10px_rgba(252,94,143,0.5)] cursor-pointer relative text-center gap-2 grid w-20 h-20 sm:w-32 sm:h-32 md:w-35 md:h-35 bg-white rounded-full p-1 sm:p-3 md:p-1.5 ">
      <Link href={`/products/${category.slug}`}>
        <div className="relative   w-full h-full bg-(--color-pink-light) rounded-full overflow-hidden border-2 border-dashed border-(--color-pink-white)   items-center content-center place-content-center ">
          <Image
            className=" absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 w-full h-full object-cover"
            src={category.image}
            alt="not found"
            width={400}
            height={400}
          />
          <Image
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
            src={category.hoverImg}
            alt="not found"
            width={400}
            height={400}
          />
        </div>
        <div className="absolute z-20 -bottom-3 left-1/2 transform  -translate-x-1/2 w-50">
          <span
            className="w-full text-center transition-colors duration-300  group-hover:text-(--color-pink-dark)
        bg-(--color-pink-light) py-0.5 px-1   md:px-3 sm:px-3 sm:w-10/12 md:w-10/12 sm:py-2 md:py-2 rounded-full text-[10px] sm:text-[12px] md:text-sm font-medium text-gray-700 shadow-sm"
          >
            {category.name}
          </span>
        </div>
      </Link>
    </div>
  );
}
