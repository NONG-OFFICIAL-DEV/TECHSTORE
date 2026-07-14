import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toAdminProductDTO } from "@/lib/serializers";
import { ProductsTable } from "@/components/admin/products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // Prisma's Decimal fields (price, compareAtPrice) can't cross the
  // Server -> Client Component boundary as-is — DTO-ify to plain numbers
  // before handing off to the (client) table.
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  const products = rows.map(toAdminProductDTO);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"} in the catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="mt-6">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}
