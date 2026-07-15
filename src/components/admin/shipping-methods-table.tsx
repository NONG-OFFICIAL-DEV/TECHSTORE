"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { formatPrice } from "@/lib/utils";
import type { ShippingMethodDTO } from "@/lib/serializers";

const columns: ColumnDef<ShippingMethodDTO>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const method = row.original;
      return (
        <div>
          <p className="font-medium text-foreground">{method.name}</p>
          <p className="text-xs text-muted-foreground">{method.description}</p>
        </div>
      );
    },
  },
  {
    id: "region",
    header: "Region",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.region === "PHNOM_PENH" ? "Phnom Penh" : "Province"}
      </span>
    ),
  },
  {
    id: "cost",
    header: "Cost",
    cell: ({ row }) => (
      <span className="font-medium">{formatPrice(row.original.cost)}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Active
        </span>
      ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Inactive
        </span>
      ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const method = row.original;
      return (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/shipping-methods/${method.id}/edit`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </Link>
          <DeleteConfirmButton
            itemName={method.name}
            itemLabel="shipping method"
            onDelete={async () => {
              const response = await fetch(`/api/admin/shipping-methods/${method.id}`, {
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

export function ShippingMethodsTable({
  methods,
  pageSize,
}: {
  methods: ShippingMethodDTO[];
  pageSize?: number;
}) {
  return (
    <DataTable
      columns={columns}
      data={methods}
      emptyMessage="No shipping methods yet."
      pageSize={pageSize}
    />
  );
}
