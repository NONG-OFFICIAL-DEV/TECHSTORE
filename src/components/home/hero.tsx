import { CategorySidebar } from "./category-sidebar";
import { HeroBanner } from "./hero-banner";
import type { Category } from "@/types/product";

export function Hero({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-6 items-stretch">
        {/* Sidebar: desktop only. On mobile, the dedicated Categories
            section further down the page covers this job instead. */}
        <CategorySidebar categories={categories} className="hidden lg:block" />
        <HeroBanner className="w-full" />
      </div>
    </section>
  );
}