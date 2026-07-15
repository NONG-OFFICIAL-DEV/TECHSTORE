"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ShippingMethodDTO } from "@/lib/serializers";

interface ShippingMethodFormProps {
  method?: ShippingMethodDTO;
}

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";

export function ShippingMethodForm({ method }: ShippingMethodFormProps) {
  const router = useRouter();
  const isEdit = !!method;

  const [name, setName] = React.useState(method?.name ?? "");
  const [description, setDescription] = React.useState(method?.description ?? "");
  const [region, setRegion] = React.useState<"PHNOM_PENH" | "PROVINCE">(
    method?.region ?? "PHNOM_PENH"
  );
  const [cost, setCost] = React.useState(method ? String(method.cost) : "");
  const [isActive, setIsActive] = React.useState(method?.isActive ?? true);
  const [sortOrder, setSortOrder] = React.useState(String(method?.sortOrder ?? 0));

  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name,
      description,
      region,
      cost: Number(cost),
      isActive,
      sortOrder: Number(sortOrder) || 0,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        isEdit ? `/api/admin/shipping-methods/${method!.id}` : "/api/admin/shipping-methods",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/shipping-methods");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Basics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Name</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Grab Express"
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Region</label>
            <Select value={region} onValueChange={(v) => setRegion(v as "PHNOM_PENH" | "PROVINCE")}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHNOM_PENH">Phnom Penh</SelectItem>
                <SelectItem value="PROVINCE">Province</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <label className={LABEL_CLASS}>Description</label>
            <Input
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instant bike delivery within PP"
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Cost ($)</label>
            <Input
              required
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Sort order</label>
            <Input
              type="number"
              step="1"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground/70">
              Lower numbers show first in the region&apos;s courier list at checkout.
            </p>
          </div>
          <div className="col-span-2 flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} />
              Active (shown to customers at checkout)
            </label>
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create shipping method"}
        </Button>
      </div>
    </form>
  );
}
