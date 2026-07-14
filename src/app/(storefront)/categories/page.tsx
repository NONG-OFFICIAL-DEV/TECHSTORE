import type { Metadata } from "next";
import { getCategories } from "@/lib/data/categories";
import { CategoriesContent } from "./categories-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse the full catalog by category.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return <CategoriesContent categories={categories} />;
}
