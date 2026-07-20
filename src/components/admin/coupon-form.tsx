"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { requiredNumberString, optionalNumberString } from "@/lib/validation/zod-helpers";
import type { CouponDTO } from "@/lib/serializers";

interface CouponFormProps {
  coupon?: CouponDTO;
}

const formSchema = z
  .object({
    code: z.string().trim().min(1, "Code is required."),
    type: z.enum(["PERCENT", "FIXED"]),
    value: requiredNumberString("Value is required.").refine((n) => n >= 0, "Value must be 0 or more."),
    active: z.boolean(),
    expiresAt: z.string(),
    minSubtotal: optionalNumberString().refine((n) => n === null || n >= 0, "Must be 0 or more."),
    maxRedemptions: optionalNumberString().refine(
      (n) => n === null || (Number.isInteger(n) && n >= 1),
      "Must be a whole number, 1 or more."
    ),
  })
  .superRefine((data, ctx) => {
    if (data.type === "PERCENT" && data.value > 100) {
      ctx.addIssue({ code: "custom", message: "Percent value must be 100 or less.", path: ["value"] });
    }
  });

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";
const FIELD_CLASS = "gap-1.5";

export function CouponForm({ coupon }: CouponFormProps) {
  const router = useRouter();
  const isEdit = !!coupon;

  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: coupon?.code ?? "",
      type: coupon?.type ?? "PERCENT",
      value: coupon ? String(coupon.value) : "",
      active: coupon?.active ?? true,
      expiresAt: coupon?.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      minSubtotal: coupon?.minSubtotal != null ? String(coupon.minSubtotal) : "",
      maxRedemptions: coupon?.maxRedemptions != null ? String(coupon.maxRedemptions) : "",
    },
  });

  const type = form.watch("type");

  const onSubmit = async (data: FormOutput) => {
    setError(null);

    const payload = {
      code: data.code,
      type: data.type,
      value: data.value,
      active: data.active,
      expiresAt: data.expiresAt || null,
      minSubtotal: data.minSubtotal,
      maxRedemptions: data.maxRedemptions,
    };

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
        return;
      }

      router.push("/admin/coupons");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="coupon-code" className={LABEL_CLASS}>Code</FieldLabel>
                <Input
                  {...field}
                  id="coupon-code"
                  placeholder="SUMMER10"
                  className="font-mono uppercase"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel className={LABEL_CLASS}>Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Percent off</SelectItem>
                    <SelectItem value="FIXED">Fixed amount off</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="value"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="coupon-value" className={LABEL_CLASS}>
                  Value {type === "PERCENT" ? "(%)" : "($)"}
                </FieldLabel>
                <Input
                  {...field}
                  id="coupon-value"
                  type="number"
                  min="0"
                  max={type === "PERCENT" ? "100" : undefined}
                  step="0.01"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="active"
            control={form.control}
            render={({ field }) => (
              <div className="col-span-2 sm:col-span-1 flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                  Active
                </label>
              </div>
            )}
          />
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Limits (optional)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="expiresAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel className={LABEL_CLASS}>Expires on</FieldLabel>
                <DatePicker value={field.value} onChange={field.onChange} placeholder="No expiry" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="minSubtotal"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="coupon-min-subtotal" className={LABEL_CLASS}>
                  Minimum order amount ($)
                </FieldLabel>
                <Input
                  {...field}
                  id="coupon-min-subtotal"
                  type="number"
                  min="0"
                  step="0.01"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="maxRedemptions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="coupon-max-redemptions" className={LABEL_CLASS}>Max redemptions</FieldLabel>
                <Input
                  {...field}
                  id="coupon-max-redemptions"
                  type="number"
                  min="1"
                  step="1"
                  aria-invalid={fieldState.invalid}
                />
                {isEdit && (
                  <p className="text-xs text-muted-foreground/70">
                    Redeemed {coupon.timesRedeemed} time{coupon.timesRedeemed === 1 ? "" : "s"} so far.
                  </p>
                )}
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create coupon"}
        </Button>
      </div>
    </form>
  );
}
