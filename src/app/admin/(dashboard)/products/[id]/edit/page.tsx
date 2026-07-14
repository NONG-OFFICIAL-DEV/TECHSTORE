import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toAdminProductDTO } from "@/lib/serializers";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit product</h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>

      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} product={toAdminProductDTO(product)} />
      </div>
    </div>
  );
}
