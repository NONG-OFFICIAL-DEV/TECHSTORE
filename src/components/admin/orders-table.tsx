"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/prisma";

// Prisma's Decimal fields can't cross the Server -> Client Component
// boundary as-is, so the page maps rows to this shape (plain numbers)
// before handing them to this (client) table.
export type OrderListRow = Omit<
  Order,
  "shippingCost" | "subtotal" | "total" | "discountAmount"
> & {
  shippingCost: number;
  subtotal: number;
  total: number;
  discountAmount: number;
};

const columns: ColumnDef<OrderListRow>[] = [
  {
    id: "order",
    header: "Order",
    cell: ({ row }) => (
      <Link
        href={`/admin/orders/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.orderNumber}
      </Link>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.customerFullName}</p>
        <p className="text-xs text-muted-foreground">{row.original.customerPhone}</p>
      </div>
    ),
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">{formatPrice(row.original.total)}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center justify-end gap-3">
          <OrderStatusSelect orderId={order.id} status={order.status} compact />
          <Link
            href={`/admin/orders/${order.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
        </div>
      );
    },
  },
];

export function OrdersTable({
  orders,
  pageSize,
}: {
  orders: OrderListRow[];
  pageSize?: number;
}) {
  return (
    <DataTable columns={columns} data={orders} emptyMessage="No orders yet." pageSize={pageSize} />
  );
}
