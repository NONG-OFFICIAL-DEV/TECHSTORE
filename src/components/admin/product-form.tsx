"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { ImageListUploadField } from "@/components/admin/image-list-upload-field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import { isValidImagePath } from "@/lib/validation/image";
import { requiredNumberString, optionalNumberString } from "@/lib/validation/zod-helpers";
import type { AdminProduct } from "@/lib/serializers";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  product?: AdminProduct;
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  brand: z.string().trim().min(1, "Brand is required."),
  categoryId: z.string().min(1, "Category is required."),
  price: requiredNumberString("Price is required.").refine(
    (n) => n >= 0,
    "Price must be 0 or more."
  ),
  compareAtPrice: optionalNumberString().refine(
    (n) => n === null || n >= 0,
    "Must be 0 or more."
  ),
  stockCount: optionalNumberString().refine(
    (n) => n === null || (Number.isInteger(n) && n >= 0),
    "Stock count must be a non-negative whole number."
  ),
  discountPercent: optionalNumberString().refine(
    (n) => n === null || (n >= 0 && n <= 100),
    "Discount must be between 0 and 100."
  ),
  inStock: z.boolean(),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  thumbnail: z.string().trim().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: "custom", message: "Thumbnail URL is required." });
      return;
    }
    if (!isValidImagePath(value)) {
      ctx.addIssue({
        code: "custom",
        message: 'Thumbnail URL must start with "/" or be a full http(s) URL.',
      });
    }
  }),
  images: z.array(z.string()),
  shortDescription: z.string().trim().min(1, "Short description is required."),
  description: z.string().trim().min(1, "Description is required."),
  features: z.string(),
  tags: z.string(),
  specs: z.array(z.object({ key: z.string(), value: z.string() })),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

function specsToRows(specs: Record<string, string>): FormInput["specs"] {
  const rows = Object.entries(specs).map(([key, value]) => ({ key, value }));
  return rows.length > 0 ? rows : [{ key: "", value: "" }];
}

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";
const FIELD_CLASS = "gap-1.5";
const TEXTAREA_CLASS =
  "w-full rounded-lg border border-border bg-background px-4 py-2 text-base sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      brand: product?.brand ?? "",
      categoryId: product?.categoryId ?? categories[0]?.id ?? "",
      price: product?.price?.toString() ?? "",
      compareAtPrice: product?.compareAtPrice?.toString() ?? "",
      stockCount: product?.stockCount?.toString() ?? "",
      discountPercent: product?.discountPercent?.toString() ?? "",
      inStock: product?.inStock ?? true,
      isNew: product?.isNew ?? false,
      isFeatured: product?.isFeatured ?? false,
      thumbnail: product?.thumbnail ?? "",
      images: product?.images ?? [],
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      features: (product?.features ?? []).join("\n"),
      tags: (product?.tags ?? []).join(", "),
      specs: specsToRows(product?.specs ?? {}),
      colors: product?.colors ?? [],
    },
  });

  const specFields = useFieldArray({ control: form.control, name: "specs" });
  const colorFields = useFieldArray({ control: form.control, name: "colors" });

  const categoryId = form.watch("categoryId");
  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name;

  const onSubmit = async (data: FormOutput) => {
    setError(null);

    const specs = Object.fromEntries(
      data.specs.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value.trim()])
    );

    const payload = {
      slug: slugify(data.slug),
      name: data.name,
      brand: data.brand,
      categoryId: data.categoryId,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      currency: "USD",
      images: data.images,
      thumbnail: data.thumbnail,
      description: data.description,
      shortDescription: data.shortDescription,
      specs,
      features: data.features.split("\n").map((line) => line.trim()).filter(Boolean),
      colors: data.colors.filter((row) => row.name.trim() && row.hex.trim()),
      inStock: data.inStock,
      stockCount: data.stockCount,
      isNew: data.isNew,
      isFeatured: data.isFeatured,
      discountPercent: data.discountPercent,
      tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      const response = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
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

      router.push("/admin/products");
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
                <FieldLabel htmlFor="product-name" className={LABEL_CLASS}>Name</FieldLabel>
                <Input
                  {...field}
                  id="product-name"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!slugTouched) form.setValue("slug", slugify(e.target.value));
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="product-slug" className={LABEL_CLASS}>Slug</FieldLabel>
                <Input
                  {...field}
                  id="product-slug"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    setSlugTouched(true);
                    field.onChange(e);
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="brand"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="product-brand" className={LABEL_CLASS}>Brand</FieldLabel>
                <Input {...field} id="product-brand" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel className={LABEL_CLASS}>Category</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select a category">{selectedCategoryName}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pricing &amp; Stock
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-price" className={LABEL_CLASS}>Price (USD)</FieldLabel>
                <Input
                  {...field}
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="compareAtPrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-compare-price" className={LABEL_CLASS}>
                  Compare-at price
                </FieldLabel>
                <Input
                  {...field}
                  id="product-compare-price"
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="stockCount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-stock" className={LABEL_CLASS}>Stock count</FieldLabel>
                <Input
                  {...field}
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="discountPercent"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-discount" className={LABEL_CLASS}>Discount %</FieldLabel>
                <Input
                  {...field}
                  id="product-discount"
                  type="number"
                  min="0"
                  max="100"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <Controller
            name="inStock"
            control={form.control}
            render={({ field }) => (
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                In stock
              </label>
            )}
          />
          <Controller
            name="isNew"
            control={form.control}
            render={({ field }) => (
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                Mark as new
              </label>
            )}
          />
          <Controller
            name="isFeatured"
            control={form.control}
            render={({ field }) => (
              <label className="flex items-center gap-2.5 text-sm">
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                Featured
              </label>
            )}
          />
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Media &amp; Copy
        </h2>
        <div className="flex flex-col gap-4">
          <Controller
            name="thumbnail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel className={LABEL_CLASS}>Thumbnail</FieldLabel>
                <ImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  folder="products"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="images"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel className={LABEL_CLASS}>Additional images</FieldLabel>
                <ImageListUploadField value={field.value} onChange={field.onChange} folder="products" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="shortDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-short-description" className={LABEL_CLASS}>
                  Short description
                </FieldLabel>
                <Input {...field} id="product-short-description" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-description" className={LABEL_CLASS}>Description</FieldLabel>
                <textarea
                  {...field}
                  id="product-description"
                  rows={4}
                  aria-invalid={fieldState.invalid}
                  className={TEXTAREA_CLASS}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="features"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-features" className={LABEL_CLASS}>
                  Features (one per line)
                </FieldLabel>
                <textarea
                  {...field}
                  id="product-features"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                  className={TEXTAREA_CLASS}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="product-tags" className={LABEL_CLASS}>Tags (comma separated)</FieldLabel>
                <Input {...field} id="product-tags" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Specs
          </h2>
          <button
            type="button"
            onClick={() => specFields.append({ key: "", value: "" })}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add spec
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {specFields.fields.map((row, index) => (
            <div key={row.id} className="flex items-center gap-2">
              <Input placeholder="Battery Life" {...form.register(`specs.${index}.key`)} />
              <Input placeholder="40 hours" {...form.register(`specs.${index}.value`)} />
              <button
                type="button"
                onClick={() => specFields.remove(index)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Remove spec"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Colors <span className="normal-case text-muted-foreground/70">(optional)</span>
          </h2>
          <button
            type="button"
            onClick={() => colorFields.append({ name: "", hex: "#000000" })}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add color
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {colorFields.fields.map((row, index) => (
            <div key={row.id} className="flex items-center gap-2">
              <Input placeholder="Graphite" {...form.register(`colors.${index}.name`)} />
              <Input placeholder="#1a1a1a" {...form.register(`colors.${index}.hex`)} className="max-w-32" />
              <button
                type="button"
                onClick={() => colorFields.remove(index)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Remove color"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
