"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { AdminThumbnail } from "@/components/admin/admin-thumbnail";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { formatPrice } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import type { AdminProduct } from "@/lib/serializers";

const columns: ColumnDef<AdminProduct>[] = [
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          <AdminThumbnail src={product.thumbnail} alt={product.name} />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{product.name}</p>
            <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.category.name}</span>
    ),
  },
  {
    id: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium">{formatPrice(row.original.price)}</span>
    ),
  },
  {
    id: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const product = row.original;
      if (!product.inStock) {
        return (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            Out of stock
          </span>
        );
      }
      const isLowStock =
        product.stockCount != null && product.stockCount <= LOW_STOCK_THRESHOLD;
      return (
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">{product.stockCount ?? "—"}</span>
          {isLowStock && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Low stock
            </span>
          )}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </Link>
          <DeleteConfirmButton
            itemName={product.name}
            itemLabel="product"
            onDelete={async () => {
              const response = await fetch(`/api/admin/products/${product.id}`, {
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

export function ProductsTable({
  products,
  pageSize,
}: {
  products: AdminProduct[];
  pageSize?: number;
}) {
  return (
    <DataTable
      columns={columns}
      data={products}
      emptyMessage="No products yet."
      pageSize={pageSize}
    />
  );
}
