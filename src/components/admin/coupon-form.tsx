"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { CouponDTO } from "@/lib/serializers";

interface CouponFormProps {
  coupon?: CouponDTO;
}

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter();
  const isEdit = !!coupon;

  const [code, setCode] = React.useState(coupon?.code ?? "");
  const [type, setType] = React.useState<"PERCENT" | "FIXED">(coupon?.type ?? "PERCENT");
  const [value, setValue] = React.useState(coupon ? String(coupon.value) : "");
  const [active, setActive] = React.useState(coupon?.active ?? true);
  const [expiresAt, setExpiresAt] = React.useState(
    coupon?.expiresAt ? coupon.expiresAt.slice(0, 10) : ""
  );
  const [minSubtotal, setMinSubtotal] = React.useState(
    coupon?.minSubtotal != null ? String(coupon.minSubtotal) : ""
  );
  const [maxRedemptions, setMaxRedemptions] = React.useState(
    coupon?.maxRedemptions != null ? String(coupon.maxRedemptions) : ""
  );

  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      code,
      type,
      value: Number(value),
      active,
      expiresAt: expiresAt || null,
      minSubtotal: minSubtotal.trim() ? Number(minSubtotal) : null,
      maxRedemptions: maxRedemptions.trim() ? Number(maxRedemptions) : null,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(
        isEdit ? `/api/admin/coupons/${coupon!.id}` : "/api/admin/coupons",
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

      router.push("/admin/coupons");
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
            <label className={LABEL_CLASS}>Code</label>
            <Input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SUMMER10"
              className="mt-1 font-mono uppercase"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Type</label>
            <Select value={type} onValueChange={(v) => setType(v as "PERCENT" | "FIXED")}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT">Percent off</SelectItem>
                <SelectItem value="FIXED">Fixed amount off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>
              Value {type === "PERCENT" ? "(%)" : "($)"}
            </label>
            <Input
              required
              type="number"
              min="0"
              max={type === "PERCENT" ? "100" : undefined}
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
              Active
            </label>
          </div>
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Limits (optional)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Expires on</label>
            <DatePicker
              value={expiresAt}
              onChange={setExpiresAt}
              placeholder="No expiry"
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Minimum order amount ($)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={minSubtotal}
              onChange={(e) => setMinSubtotal(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Max redemptions</label>
            <Input
              type="number"
              min="1"
              step="1"
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
              className="mt-1"
            />
            {isEdit && (
              <p className="mt-1 text-xs text-muted-foreground/70">
                Redeemed {coupon.timesRedeemed} time{coupon.timesRedeemed === 1 ? "" : "s"} so far.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create coupon"}
        </Button>
      </div>
    </form>
  );
}
