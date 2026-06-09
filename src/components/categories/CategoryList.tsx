// import React from 'react'
// import CategoryCard from './CategoryCard'
// import Image from "next/image";
// interface Category {
//   id: string;
//   name: string;
//   image: string;
//   slug: string;
//   productCount?: number;
//   type?: 'iranian' | 'imported';
// }

// export default function CategoryList({ category }: { category: Category }) {
//   return (
//     <div className='text-center gap-2 grid w-full h-52 bg-white rounded-4xl py-4 px-3 '>
//        <div className='w-full border-2 border-dashed border-(--color-pink-white) rounded-4xl  h-32  items-center content-center place-content-center '>
//            <Image
//                 src={category.image}
//                 alt="not found"
//                 width={100}
//                 height={300}
//               />
//        </div>
//        <div>
//         {category.name}
//        </div>
//        </div>
//   )
// }
