"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS } from "@/components/admin/order-status-badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/prisma";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export function OrderStatusSelect({
  orderId,
  status,
  compact = false,
}: {
  orderId: string;
  status: OrderStatus;
  /** Table-row usage: no label, smaller trigger, stops row click-through. */
  compact?: boolean;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = async (nextStatus: string) => {
    setIsSaving(true);
    setError(null);
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!response.ok) {
      setError("Failed to update status.");
      setIsSaving(false);
      return;
    }

    router.refresh();
    setIsSaving(false);
  };

  const select = (
    <div className={cn("flex items-center gap-2", compact ? "" : "mt-1")}>
      <Select value={status} onValueChange={handleChange} disabled={isSaving}>
        <SelectTrigger className={compact ? "h-8 w-40 text-xs" : ""}>
          <SelectValue>{STATUS_LABELS[status]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {STATUS_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isSaving && <Spinner className="text-muted-foreground" />}
    </div>
  );

  if (compact) {
    // Swallow clicks so the select doesn't also trigger a parent row link.
    return (
      <div onClick={(e) => e.stopPropagation()}>
        {select}
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">Fulfillment status</label>
      {select}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
