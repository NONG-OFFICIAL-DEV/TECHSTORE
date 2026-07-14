import Link from "next/link";
import { CategoryForm } from "@/components/admin/category-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function NewCategoryPage() {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/categories">Categories</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-3 text-xl font-semibold">New category</h1>
      <p className="mt-1 text-sm text-muted-foreground">Add a new category to the catalog.</p>

      <div className="mt-6 max-w-2xl">
        <CategoryForm />
      </div>
    </div>
  );
}
