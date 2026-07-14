import { isValidImagePath } from "./image";

export interface ProductInput {
  slug: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  images: string[];
  thumbnail: string;
  description: string;
  shortDescription: string;
  specs: Record<string, string>;
  features: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  stockCount?: number | null;
  isNew?: boolean;
  isFeatured?: boolean;
  discountPercent?: number | null;
  tags: string[];
}

export function validateProductInput(
  body: unknown
): { data: ProductInput } | { error: string } {
  const b = body as Partial<ProductInput> | null;
  if (!b || typeof b !== "object") return { error: "Invalid request body." };

  if (!b.slug?.trim()) return { error: "Slug is required." };
  if (!b.name?.trim()) return { error: "Name is required." };
  if (!b.brand?.trim()) return { error: "Brand is required." };
  if (!b.categoryId) return { error: "Category is required." };
  if (typeof b.price !== "number" || b.price < 0) return { error: "Price must be a positive number." };
  if (!b.thumbnail?.trim()) return { error: "Thumbnail URL is required." };
  if (!isValidImagePath(b.thumbnail.trim())) {
    return { error: "Thumbnail URL must start with \"/\" or be a full http(s) URL." };
  }
  if (!b.description?.trim()) return { error: "Description is required." };
  if (!b.shortDescription?.trim()) return { error: "Short description is required." };
  if (!b.specs || typeof b.specs !== "object") return { error: "Specs must be an object." };
  if (!Array.isArray(b.images)) return { error: "Images must be an array." };
  if (b.images.some((image) => !isValidImagePath(image))) {
    return { error: "Every image URL must start with \"/\" or be a full http(s) URL." };
  }
  if (!Array.isArray(b.features)) return { error: "Features must be an array." };
  if (!Array.isArray(b.tags)) return { error: "Tags must be an array." };
  if (typeof b.inStock !== "boolean") return { error: "inStock must be a boolean." };

  return {
    data: {
      slug: b.slug.trim(),
      name: b.name.trim(),
      brand: b.brand.trim(),
      categoryId: b.categoryId,
      price: b.price,
      compareAtPrice: b.compareAtPrice ?? null,
      currency: b.currency?.trim() || "USD",
      rating: b.rating ?? 0,
      reviewCount: b.reviewCount ?? 0,
      images: b.images,
      thumbnail: b.thumbnail.trim(),
      description: b.description.trim(),
      shortDescription: b.shortDescription.trim(),
      specs: b.specs,
      features: b.features,
      colors: b.colors ?? [],
      inStock: b.inStock,
      stockCount: b.stockCount ?? null,
      isNew: b.isNew ?? false,
      isFeatured: b.isFeatured ?? false,
      discountPercent: b.discountPercent ?? null,
      tags: b.tags,
    },
  };
}
