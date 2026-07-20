import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/serializers";
import type { Product } from "@/types/product";

/** All products, shaped for the storefront. */
export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductDTO);
}

/** Same as getProducts(), but never throws — see getCategoriesSafe for why. */
export async function getProductsSafe(): Promise<Product[]> {
  return getProducts().catch((error) => {
    console.error("Failed to load products:", error);
    return [];
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductDTO);
}

export async function getFeaturedProductsSafe(): Promise<Product[]> {
  return getFeaturedProducts().catch((error) => {
    console.error("Failed to load featured products:", error);
    return [];
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  return product ? toProductDTO(product) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const related = await prisma.product.findMany({
    where: { category: { slug: product.category }, id: { not: product.id } },
    include: { category: true },
    take: limit,
  });

  return related.map(toProductDTO);
}
