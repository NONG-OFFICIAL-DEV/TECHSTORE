import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">New category</h1>
      <p className="mt-1 text-sm text-muted-foreground">Add a new category to the catalog.</p>

      <div className="mt-6 max-w-2xl">
        <CategoryForm />
      </div>
    </div>
  );
}
