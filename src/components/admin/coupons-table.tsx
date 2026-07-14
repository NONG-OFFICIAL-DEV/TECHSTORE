"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { formatPrice } from "@/lib/utils";
import type { CouponDTO } from "@/lib/serializers";

function isExpired(coupon: CouponDTO) {
  return !!coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now();
}

const columns: ColumnDef<CouponDTO>[] = [
  {
    id: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono font-medium text-foreground">{row.original.code}</span>
    ),
  },
  {
    id: "discount",
    header: "Discount",
    cell: ({ row }) => {
      const coupon = row.original;
      return (
        <span className="text-muted-foreground">
          {coupon.type === "PERCENT" ? `${coupon.value}%` : formatPrice(coupon.value)} off
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const coupon = row.original;
      if (!coupon.active) {
        return (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Inactive
          </span>
        );
      }
      if (isExpired(coupon)) {
        return (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            Expired
          </span>
        );
      }
      return (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Active
        </span>
      );
    },
  },
  {
    id: "redemptions",
    header: "Redemptions",
    cell: ({ row }) => {
      const coupon = row.original;
      return (
        <span className="text-muted-foreground">
          {coupon.timesRedeemed}
          {coupon.maxRedemptions != null ? ` / ${coupon.maxRedemptions}` : ""}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const coupon = row.original;
      return (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/coupons/${coupon.id}/edit`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit
          </Link>
          <DeleteConfirmButton
            itemName={coupon.code}
            itemLabel="coupon"
            onDelete={async () => {
              const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
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

export function CouponsTable({
  coupons,
  pageSize,
}: {
  coupons: CouponDTO[];
  pageSize?: number;
}) {
  return (
    <DataTable
      columns={columns}
      data={coupons}
      emptyMessage="No coupons yet."
      pageSize={pageSize}
    />
  );
}
