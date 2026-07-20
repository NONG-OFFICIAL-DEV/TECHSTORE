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
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { requiredNumberString } from "@/lib/validation/zod-helpers";
import type { ShippingMethodDTO } from "@/lib/serializers";

interface ShippingMethodFormProps {
  method?: ShippingMethodDTO;
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().trim().min(1, "Description is required."),
  region: z.enum(["PHNOM_PENH", "PROVINCE"]),
  cost: requiredNumberString("Cost is required.").refine((n) => n >= 0, "Cost must be 0 or more."),
  isActive: z.boolean(),
  sortOrder: z.string().trim().transform((v) => {
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  }),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";
const FIELD_CLASS = "gap-1.5";

export function ShippingMethodForm({ method }: ShippingMethodFormProps) {
  const router = useRouter();
  const isEdit = !!method;

  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: method?.name ?? "",
      description: method?.description ?? "",
      region: method?.region ?? "PHNOM_PENH",
      cost: method ? String(method.cost) : "",
      isActive: method?.isActive ?? true,
      sortOrder: String(method?.sortOrder ?? 0),
    },
  });

  const onSubmit = async (data: FormOutput) => {
    setError(null);

    const payload = {
      name: data.name,
      description: data.description,
      region: data.region,
      cost: data.cost,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    };

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
        return;
      }

      router.push("/admin/shipping-methods");
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
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="shipping-name" className={LABEL_CLASS}>Name</FieldLabel>
                <Input {...field} id="shipping-name" placeholder="Grab Express" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="region"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel className={LABEL_CLASS}>Region</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHNOM_PENH">Phnom Penh</SelectItem>
                    <SelectItem value="PROVINCE">Province</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="shipping-description" className={LABEL_CLASS}>Description</FieldLabel>
                <Input
                  {...field}
                  id="shipping-description"
                  placeholder="Instant bike delivery within PP"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="cost"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="shipping-cost" className={LABEL_CLASS}>Cost ($)</FieldLabel>
                <Input
                  {...field}
                  id="shipping-cost"
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
            name="sortOrder"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="shipping-sort-order" className={LABEL_CLASS}>Sort order</FieldLabel>
                <Input {...field} id="shipping-sort-order" type="number" step="1" aria-invalid={fieldState.invalid} />
                <p className="text-xs text-muted-foreground/70">
                  Lower numbers show first in the region&apos;s courier list at checkout.
                </p>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <div className="col-span-2 flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                  Active (shown to customers at checkout)
                </label>
              </div>
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
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create shipping method"}
        </Button>
      </div>
    </form>
  );
}
