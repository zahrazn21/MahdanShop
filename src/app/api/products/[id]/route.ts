// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { products } from "@/src/components/product/ProductItems";
import { ProductValidationSchema } from "@/src/app/lib/validators/productValidation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // ✅ باید await کنی
  // const product = products.find((p) => p.id === id);
 const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });  
  if (!product) {
    return NextResponse.json(
      { error: "محصول یافت نشد" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        slug: body.slug,
        price: Number(body.price),
        originalPrice: body.originalPrice
          ? Number(body.originalPrice)
          : null,

        image: body.image,

        category: body.category,
        brand: body.brand,
        scope: body.scope,

        stock: Number(body.stock),

        isAvailable: Boolean(body.isAvailable),

        rating: Number(body.rating || 0),
        reviewCount: Number(body.reviewCount || 0),

        description: body.description,
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "خطا در ویرایش محصول" },
      { status: 500 }
    );
  }
}
// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;  // ✅ باید await کنی
//     const body = await req.json();
    
//     const index = products.findIndex((p) => p.id === id);
    
//     console.log("🔵 PUT request for id:", id);
//     console.log("🔵 Product index:", index);
    
//     if (index === -1) {
//       return NextResponse.json(
//         { error: "محصول یافت نشد" },
//         { status: 404 }
//       );
//     }
    
//     // به‌روزرسانی محصول
//     products[index] = {
//       ...products[index],
//       ...body,
//       id: products[index].id,
//     };
    
//     console.log("✅ Product updated:", products[index]);
    
//     return NextResponse.json({
//       success: true,
//       product: products[index],
//     });
//   } catch (error) {
//     console.error("❌ PUT error:", error);
//     return NextResponse.json(
//       { error: "خطا در ویرایش محصول" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;  // ✅ باید await کنی
    
    // const index = products.findIndex((p) => p.id === id);
  const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    // if (index === -1) {
    //   return NextResponse.json(
    //     { error: "محصول یافت نشد" },
    //     { status: 404 }
    //   );
    // }
    
    // const deletedProduct = products[index];
    // products.splice(index, 1);
    
    // console.log("✅ Product deleted:", deletedProduct);
    
    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json(
      { error: "خطا در حذف محصول" },
      { status: 500 }
    );
  }
}



function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();

//     // ✅ 1. پیدا کردن محصول
//     const index = products.findIndex((p) => p.id === id);
    
//     console.log("🔵 PUT request for id:", id);
//     console.log("🔵 Product index:", index);
    
//     if (index === -1) {
//       return NextResponse.json(
//         { error: "محصول یافت نشد" },
//         { status: 404 }
//       );
//     }

//     // ✅ 2. آماده کردن داده برای اعتبارسنجی
//     const dataToValidate = {
//       name: body.name,
//       slug: body.slug || slugify(body.name),
//       price: Number(body.price),
//       originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
//       image: body.image,
//       images: body.images || undefined,
//       category: body.category,
//       brand: body.brand,
//       scope: body.scope,
//       stock: Number(body.stock),
//       isAvailable: Boolean(body.isAvailable),
//       rating: body.rating ? Number(body.rating) : 0,
//       reviewCount: body.reviewCount ? Number(body.reviewCount) : 0,
//       description: body.description || "",
//       features: body.features || undefined,
//       ingredients: body.ingredients || undefined,
//       howToUse: body.howToUse || undefined,
//       createdAt: body.createdAt || products[index].createdAt,
//     };

//     // ✅ 3. اعتبارسنجی با Zod
//     const validationResult = ProductValidationSchema.safeParse(dataToValidate);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         {
//           error: "داده‌های ارسالی معتبر نیستند",
//           details: validationResult.error.issues.map((err) => ({
//             field: err.path.join("."),
//             message: err.message,
//           })),
//         },
//         { status: 400 }
//       );
//     }

//     // ✅ 4. به‌روزرسانی محصول با داده معتبر
//     const validatedData = validationResult.data;
    
//     products[index] = {
//       ...products[index],
//       ...validatedData,
//       id: products[index].id, // حفظ id اصلی
//       slug: validatedData.slug || slugify(validatedData.name),
//     };
    
//     console.log("✅ Product updated:", products[index]);
    
//     return NextResponse.json({
//       success: true,
//       message: "محصول با موفقیت ویرایش شد",
//       product: products[index],
//     });
//   } catch (error) {
//     console.error("❌ PUT error:", error);
//     return NextResponse.json(
//       { error: "خطا در ویرایش محصول" },
//       { status: 500 }
//     );
//   }
// }


// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();

//     const index = products.findIndex((p) => p.id === id);
    
//     if (index === -1) {
//       return NextResponse.json(
//         { error: "محصول یافت نشد" },
//         { status: 404 }
//       );
//     }

//     // آماده کردن داده برای اعتبارسنجی
//     const dataToValidate = {
//       name: body.name,
//       price: Number(body.price),
//       originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
//       image: body.image,
//       images: body.images || [],
//       category: body.category,
//       brand: body.brand,
//       scope: body.scope,
//       stock: Number(body.stock),
//       isAvailable: Number(body.stock) > 0,
//       rating: body.rating || 0,
//       reviewCount: body.reviewCount || 0,
//       description: body.description || "",
//       features: body.features || [],
//       ingredients: body.ingredients || [],
//       howToUse: body.howToUse || "",
//       slug: body.slug || slugify(body.name),
//       createdAt: body.createdAt || products[index].createdAt,
//     };

//     const validationResult = ProductValidationSchema.safeParse(dataToValidate);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         {
//           error: "داده‌های ارسالی معتبر نیستند",
//           details: validationResult.error.issues.map((err) => ({
//             field: err.path.join("."),
//             message: err.message,
//           })),
//         },
//         { status: 400 }
//       );
//     }

//     const validatedData = validationResult.data;
    
//     products[index] = {
//       ...products[index],
//       ...validatedData,
//       id: products[index].id,
//     };

//     console.log("✅ محصول ویرایش شد:", products[index]);

//     return NextResponse.json({
//       success: true,
//       message: "محصول با موفقیت ویرایش شد",
//       product: products[index],
//     });
//   } catch (error) {
//     console.error("❌ PUT error:", error);
//     return NextResponse.json(
//       { error: "خطا در ویرایش محصول" },
//       { status: 500 }
//     );
//   }
// }
