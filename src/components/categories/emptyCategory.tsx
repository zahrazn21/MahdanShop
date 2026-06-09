
// export default function EmptyCategory({activeScope}) {
//    return (
//     <div className="w-full py-12 text-center">
//       <div className="max-w-md mx-auto">
//         <div className="text-6xl mb-4">📁</div>
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">
//           دسته‌بندی یافت نشد
//         </h3>
//         <p className="text-gray-400">
//           {activeScope === 'imported' 
//             ? 'هیچ دسته‌بندی برای محصولات وارداتی وجود ندارد' 
//             : activeScope === 'domestic'
//             ? 'هیچ دسته‌بندی برای محصولات داخلی وجود ندارد'
//             : 'دسته‌بندی‌ای وجود ندارد'}
//         </p>
//         {activeScope !== 'all' && (
//           <button 
//             onClick={() => setActiveScope('all')}
//             className="inline-block mt-4 text-pink-600 hover:underline"
//           >
//             مشاهده همه دسته‌بندی‌ها
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
