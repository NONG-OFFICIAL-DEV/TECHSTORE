import { CategorySidebar } from "./category-sidebar";
import { HeroBanner } from "./hero-banner";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-stretch">
        {/* Sidebar: desktop only. On mobile, the dedicated Categories
            section further down the page covers this job instead —
            a persistent sidebar doesn't fit a narrow viewport. */}
        <CategorySidebar className="hidden lg:block" />
        <HeroBanner />
      </div>
    </section>
  );
}