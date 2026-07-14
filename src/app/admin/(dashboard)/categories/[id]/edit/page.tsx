import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/lib/serializers";
import { CategoryForm } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit category</h1>
      <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>

      <div className="mt-6 max-w-2xl">
        <CategoryForm category={toCategoryDTO(category)} />
      </div>
    </div>
  );
}
