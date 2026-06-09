import { Edit, Trash2 } from "lucide-react";
import { Product } from "../product/ProductItems";
import Image from "next/image";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string, name: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="text-center p-8 text-gray-500">محصولی یافت نشد</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">
                تصویر
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">
                نام محصول
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">
                برند
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">
                قیمت
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">
                موجودی
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">
                دسته
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-600">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt=""
                      width={180}
                      height={180}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-800">{product.name}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-semibold text-pink-600">
                    {product.price.toLocaleString()} تومان
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      product.stock > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} عدد` : "ناموجود"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-500">
                    {product.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id, product.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
