import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toAdminProductDTO } from "@/lib/serializers";
import { ProductForm } from "@/components/admin/product-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-3 text-xl font-semibold">Edit product</h1>

      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} product={toAdminProductDTO(product)} />
      </div>
    </div>
  );
}
