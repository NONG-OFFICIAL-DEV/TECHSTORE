"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { formatPrice } from "@/lib/utils";

export interface CustomerSummary {
  phone: string;
  fullName: string;
  email: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
}

const columns: ColumnDef<CustomerSummary>[] = [
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <Link
        href={`/admin/customers/${encodeURIComponent(row.original.phone)}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.fullName}
      </Link>
    ),
  },
  {
    id: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.phone}</span>,
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email ?? "—"}</span>
    ),
  },
  {
    id: "orders",
    header: "Orders",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.orderCount}</span>,
  },
  {
    id: "totalSpent",
    header: "Total spent",
    cell: ({ row }) => (
      <span className="font-medium">{formatPrice(row.original.totalSpent)}</span>
    ),
  },
  {
    id: "lastOrderAt",
    header: "Last order",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.lastOrderAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
];

export function CustomersTable({
  customers,
  pageSize,
}: {
  customers: CustomerSummary[];
  pageSize?: number;
}) {
  return (
    <DataTable
      columns={columns}
      data={customers}
      emptyMessage="No customers yet."
      pageSize={pageSize}
    />
  );
}
