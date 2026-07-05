import { CategorySidebar } from "./category-sidebar";
import { HeroBanner } from "./hero-banner";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-stretch">
        <CategorySidebar className="hidden lg:block" />
        <HeroBanner />
      </div>
    </section>
  );
}