"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { slugify } from "@/lib/utils";
import { isValidImagePath } from "@/lib/validation/image";
import type { Category } from "@/types/product";

interface CategoryFormProps {
  category?: Category;
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  nameKey: z.string().trim().min(1, "Translation key is required."),
  icon: z.string().trim().min(1, "Icon is required."),
  image: z.string().trim().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: "custom", message: "Image URL is required." });
      return;
    }
    if (!isValidImagePath(value)) {
      ctx.addIssue({
        code: "custom",
        message: 'Image URL must start with "/" or be a full http(s) URL.',
      });
    }
  }),
  description: z.string().trim().min(1, "Description is required."),
});

type FormValues = z.infer<typeof formSchema>;

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";
const FIELD_CLASS = "gap-1.5";
const TEXTAREA_CLASS =
  "w-full rounded-lg border border-border bg-background px-4 py-2 text-base sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [nameKeyTouched, setNameKeyTouched] = React.useState(isEdit);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      nameKey: category?.nameKey ?? "",
      icon: category?.icon ?? "",
      image: category?.image ?? "",
      description: category?.description ?? "",
    },
  });

  const handleNameChange = (value: string) => {
    if (!slugTouched) form.setValue("slug", slugify(value));
    if (!nameKeyTouched) {
      form.setValue(
        "nameKey",
        value.trim()
          ? `categories.${slugify(value).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`
          : ""
      );
    }
  };

  const onSubmit = async (data: FormValues) => {
    setError(null);

    const payload = {
      slug: slugify(data.slug),
      name: data.name,
      nameKey: data.nameKey,
      description: data.description,
      icon: data.icon,
      image: data.image,
    };

    try {
      const response = await fetch(
        isEdit ? `/api/admin/categories/${category!.id}` : "/api/admin/categories",
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

      router.push("/admin/categories");
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
                <FieldLabel htmlFor="category-name" className={LABEL_CLASS}>Name</FieldLabel>
                <Input
                  {...field}
                  id="category-name"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    handleNameChange(e.target.value);
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
                <FieldLabel htmlFor="category-slug" className={LABEL_CLASS}>Slug</FieldLabel>
                <Input
                  {...field}
                  id="category-slug"
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
            name="nameKey"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="category-name-key" className={LABEL_CLASS}>Translation key</FieldLabel>
                <Input
                  {...field}
                  id="category-name-key"
                  placeholder="categories.audio"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    setNameKeyTouched(true);
                    field.onChange(e);
                  }}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="icon"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={`col-span-2 sm:col-span-1 ${FIELD_CLASS}`}>
                <FieldLabel htmlFor="category-icon" className={LABEL_CLASS}>Icon</FieldLabel>
                <Input {...field} id="category-icon" placeholder="Headphones" aria-invalid={fieldState.invalid} />
                <p className="text-xs text-muted-foreground/70">
                  A lucide-react icon name (e.g. Headphones, Watch, Laptop, Home).
                </p>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
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
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel className={LABEL_CLASS}>Image</FieldLabel>
                <ImageUploadField
                  value={field.value}
                  onChange={field.onChange}
                  folder="categories"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={FIELD_CLASS}>
                <FieldLabel htmlFor="category-description" className={LABEL_CLASS}>Description</FieldLabel>
                <textarea
                  {...field}
                  id="category-description"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                  className={TEXTAREA_CLASS}
                />
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
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  );
}
