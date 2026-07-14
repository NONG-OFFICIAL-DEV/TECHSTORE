"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types/product";

interface CategoryFormProps {
  category?: Category;
}

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";
const TEXTAREA_CLASS =
  "mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const [name, setName] = React.useState(category?.name ?? "");
  const [slug, setSlug] = React.useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [nameKey, setNameKey] = React.useState(category?.nameKey ?? "");
  const [nameKeyTouched, setNameKeyTouched] = React.useState(isEdit);
  const [description, setDescription] = React.useState(category?.description ?? "");
  const [icon, setIcon] = React.useState(category?.icon ?? "");
  const [image, setImage] = React.useState(category?.image ?? "");

  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
    if (!nameKeyTouched) setNameKey(value.trim() ? `categories.${slugify(value).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}` : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      slug: slugify(slug),
      name,
      nameKey,
      description,
      icon,
      image,
    };

    setIsSubmitting(true);
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
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/categories");
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
            <Input required value={name} onChange={(e) => handleNameChange(e.target.value)} className="mt-1" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Slug</label>
            <Input
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Translation key</label>
            <Input
              required
              value={nameKey}
              onChange={(e) => {
                setNameKeyTouched(true);
                setNameKey(e.target.value);
              }}
              placeholder="categories.audio"
              className="mt-1"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Icon</label>
            <Input
              required
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Headphones"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-muted-foreground/70">
              A lucide-react icon name (e.g. Headphones, Watch, Laptop, Home).
            </p>
          </div>
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Media &amp; Copy
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>Image URL</label>
            <Input
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/categories/audio.jpg"
              className="mt-1"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={TEXTAREA_CLASS}
            />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create category"}
        </Button>
      </div>
    </form>
  );
}
