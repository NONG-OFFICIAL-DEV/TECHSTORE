import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import { CategoriesTable } from "@/components/admin/categories-table";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New category
        </Link>
      </div>

      <div className="mt-6">
        <CategoriesTable categories={categories} />
      </div>
    </div>
  );
}
