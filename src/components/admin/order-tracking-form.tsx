"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import type { OrderStatus } from "@/lib/prisma";

export function OrderTrackingForm({
  orderId,
  status,
  trackingNumber,
  carrier,
  shippedAt,
}: {
  orderId: string;
  status: OrderStatus;
  trackingNumber: string | null;
  carrier: string | null;
  shippedAt: string | null;
}) {
  const router = useRouter();
  const [trackingValue, setTrackingValue] = React.useState(trackingNumber ?? "");
  const [carrierValue, setCarrierValue] = React.useState(carrier ?? "");
  const [shippedAtValue, setShippedAtValue] = React.useState(shippedAt ? shippedAt.slice(0, 10) : "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        trackingNumber: trackingValue.trim() || null,
        carrier: carrierValue.trim() || null,
        shippedAt: shippedAtValue || null,
      }),
    });

    setIsSaving(false);
    if (!response.ok) {
      setError("Failed to save tracking info.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground">Carrier</label>
        <Input
          value={carrierValue}
          onChange={(e) => setCarrierValue(e.target.value)}
          placeholder="Grab Express"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Tracking number</label>
        <Input
          value={trackingValue}
          onChange={(e) => setTrackingValue(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Shipped on</label>
        <DatePicker
          value={shippedAtValue}
          onChange={setShippedAtValue}
          placeholder="Not shipped yet"
          className="mt-1"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save tracking info"}
      </Button>
    </form>
  );
}
