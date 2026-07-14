import { getCategoriesSafe } from "@/lib/data/categories";
import { ProductsContent } from "./products-content";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const categories = await getCategoriesSafe();

  return <ProductsContent categories={categories} />;
}
