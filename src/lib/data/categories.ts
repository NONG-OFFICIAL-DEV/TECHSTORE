import { prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/lib/serializers";

/** All categories, shaped for both the storefront and the admin panel. */
export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return categories.map(toCategoryDTO);
}

/**
 * Same as getCategories(), but never throws — categories are decoration on
 * most storefront pages (nav/footer/filters), not the reason someone's
 * visiting. A DB hiccup should degrade to an empty list instead of taking
 * the whole page down with it. Use the throwing version in the admin panel,
 * where a real error is more useful than a silently-empty table.
 */
export async function getCategoriesSafe() {
  return getCategories().catch((error) => {
    console.error("Failed to load categories:", error);
    return [];
  });
}
