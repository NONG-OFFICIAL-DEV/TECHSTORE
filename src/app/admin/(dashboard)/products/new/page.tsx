import Link from "next/link";
import { prisma } from "@/lib/prisma";
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

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

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
            <BreadcrumbPage>New product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-3 text-xl font-semibold">New product</h1>
      <p className="mt-1 text-sm text-muted-foreground">Add a new product to the catalog.</p>

      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
