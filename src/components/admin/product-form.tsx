"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import type { AdminProduct } from "@/lib/serializers";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  product?: AdminProduct;
}

interface SpecRow {
  key: string;
  value: string;
}

interface ColorRow {
  name: string;
  hex: string;
}

function specsToRows(specs: Record<string, string>): SpecRow[] {
  const rows = Object.entries(specs).map(([key, value]) => ({ key, value }));
  return rows.length > 0 ? rows : [{ key: "", value: "" }];
}

const SECTION_CLASS = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const LABEL_CLASS = "text-xs font-medium text-muted-foreground";
const TEXTAREA_CLASS =
  "mt-1 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = React.useState(product?.name ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [brand, setBrand] = React.useState(product?.brand ?? "");
  const [categoryId, setCategoryId] = React.useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [price, setPrice] = React.useState(product?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = React.useState(
    product?.compareAtPrice?.toString() ?? ""
  );
  const [thumbnail, setThumbnail] = React.useState(product?.thumbnail ?? "");
  const [images, setImages] = React.useState((product?.images ?? []).join("\n"));
  const [shortDescription, setShortDescription] = React.useState(product?.shortDescription ?? "");
  const [description, setDescription] = React.useState(product?.description ?? "");
  const [features, setFeatures] = React.useState((product?.features ?? []).join("\n"));
  const [tags, setTags] = React.useState((product?.tags ?? []).join(", "));
  const [specRows, setSpecRows] = React.useState<SpecRow[]>(specsToRows(product?.specs ?? {}));
  const [colorRows, setColorRows] = React.useState<ColorRow[]>(product?.colors ?? []);
  const [inStock, setInStock] = React.useState(product?.inStock ?? true);
  const [stockCount, setStockCount] = React.useState(product?.stockCount?.toString() ?? "");
  const [isNew, setIsNew] = React.useState(product?.isNew ?? false);
  const [isFeatured, setIsFeatured] = React.useState(product?.isFeatured ?? false);
  const [discountPercent, setDiscountPercent] = React.useState(
    product?.discountPercent?.toString() ?? ""
  );

  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const updateSpecRow = (index: number, field: keyof SpecRow, value: string) => {
    setSpecRows((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const updateColorRow = (index: number, field: keyof ColorRow, value: string) => {
    setColorRows((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const specs = Object.fromEntries(
      specRows.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value.trim()])
    );

    const payload = {
      slug: slugify(slug),
      name,
      brand,
      categoryId,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      currency: "USD",
      images: images.split("\n").map((line) => line.trim()).filter(Boolean),
      thumbnail,
      description,
      shortDescription,
      specs,
      features: features.split("\n").map((line) => line.trim()).filter(Boolean),
      colors: colorRows.filter((row) => row.name.trim() && row.hex.trim()),
      inStock,
      stockCount: stockCount ? Number(stockCount) : null,
      isNew,
      isFeatured,
      discountPercent: discountPercent ? Number(discountPercent) : null,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    setIsSubmitting(true);
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
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name;

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
            <label className={LABEL_CLASS}>Brand</label>
            <Input required value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={LABEL_CLASS}>Category</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1">
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
          </div>
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pricing &amp; Stock
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className={LABEL_CLASS}>Price (USD)</label>
            <Input
              required
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Compare-at price</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Stock count</label>
            <Input
              type="number"
              min="0"
              value={stockCount}
              onChange={(e) => setStockCount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Discount %</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={inStock} onCheckedChange={(checked) => setInStock(checked === true)} />
            In stock
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox checked={isNew} onCheckedChange={(checked) => setIsNew(checked === true)} />
            Mark as new
          </label>
          <label className="flex items-center gap-2.5 text-sm">
            <Checkbox
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked === true)}
            />
            Featured
          </label>
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Media &amp; Copy
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>Thumbnail URL</label>
            <Input
              required
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="/images/products/example.jpg"
              className="mt-1"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Image URLs (one per line)</label>
            <textarea
              value={images}
              onChange={(e) => setImages(e.target.value)}
              rows={3}
              className={TEXTAREA_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Short description</label>
            <Input
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={TEXTAREA_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Features (one per line)</label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={3}
              className={TEXTAREA_CLASS}
            />
          </div>
          <div>
            <label className={LABEL_CLASS}>Tags (comma separated)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1" />
          </div>
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Specs
          </h2>
          <button
            type="button"
            onClick={() => setSpecRows((rows) => [...rows, { key: "", value: "" }])}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add spec
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {specRows.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Battery Life"
                value={row.key}
                onChange={(e) => updateSpecRow(index, "key", e.target.value)}
              />
              <Input
                placeholder="40 hours"
                value={row.value}
                onChange={(e) => updateSpecRow(index, "value", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setSpecRows((rows) => rows.filter((_, i) => i !== index))}
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
            onClick={() => setColorRows((rows) => [...rows, { name: "", hex: "#000000" }])}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add color
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {colorRows.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder="Graphite"
                value={row.name}
                onChange={(e) => updateColorRow(index, "name", e.target.value)}
              />
              <Input
                placeholder="#1a1a1a"
                value={row.hex}
                onChange={(e) => updateColorRow(index, "hex", e.target.value)}
                className="max-w-32"
              />
              <button
                type="button"
                onClick={() => setColorRows((rows) => rows.filter((_, i) => i !== index))}
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
