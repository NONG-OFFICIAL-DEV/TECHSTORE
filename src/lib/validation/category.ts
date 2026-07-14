import { isValidImagePath } from "./image";

export interface CategoryInput {
  slug: string;
  name: string;
  nameKey: string;
  description: string;
  icon: string;
  image: string;
}

export function validateCategoryInput(
  body: unknown
): { data: CategoryInput } | { error: string } {
  const b = body as Partial<CategoryInput> | null;
  if (!b || typeof b !== "object") return { error: "Invalid request body." };

  if (!b.slug?.trim()) return { error: "Slug is required." };
  if (!b.name?.trim()) return { error: "Name is required." };
  if (!b.nameKey?.trim()) return { error: "Translation key is required." };
  if (!b.description?.trim()) return { error: "Description is required." };
  if (!b.icon?.trim()) return { error: "Icon is required." };
  if (!b.image?.trim()) return { error: "Image URL is required." };
  if (!isValidImagePath(b.image.trim())) {
    return { error: "Image URL must start with \"/\" or be a full http(s) URL." };
  }

  return {
    data: {
      slug: b.slug.trim(),
      name: b.name.trim(),
      nameKey: b.nameKey.trim(),
      description: b.description.trim(),
      icon: b.icon.trim(),
      image: b.image.trim(),
    },
  };
}
