"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { AdminThumbnail } from "@/components/admin/admin-thumbnail";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import type { Category } from "@/types/product";

const columns: ColumnDef<Category>[] = [
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-3">
          <AdminThumbnail src={category.image} alt={category.name} />
          <p className="font-medium text-foreground">{category.name}</p>
        </div>
      );
    },
  },
  {
    id: "slug",
    header: "Slug",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.slug}</span>,
  },
  {
    id: "products",
    header: "Products",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.productCount}</span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </Link>
          <DeleteConfirmButton
            itemName={category.name}
            itemLabel="category"
            onDelete={async () => {
              const response = await fetch(`/api/admin/categories/${category.id}`, {
                method: "DELETE",
              });
              if (response.ok) return { ok: true };
              const data = await response.json().catch(() => null);
              return { ok: false, error: data?.error };
            }}
          />
        </div>
      );
    },
  },
];

export function CategoriesTable({
  categories,
  pageSize,
}: {
  categories: Category[];
  pageSize?: number;
}) {
  return (
    <DataTable
      columns={columns}
      data={categories}
      emptyMessage="No categories yet."
      pageSize={pageSize}
    />
  );
}
