import { getCategoriesSafe } from "@/lib/data/categories";
import { getProductsSafe } from "@/lib/data/products";
import { ProductsContent } from "./products-content";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getCategoriesSafe(), getProductsSafe()]);

  return <ProductsContent categories={categories} products={products} />;
}
