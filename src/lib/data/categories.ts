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
