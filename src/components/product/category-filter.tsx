"use client";

import { motion } from "framer-motion";
import { Category } from "@/types/product";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selected: string | undefined;
  onSelect: (categorySlug: string | undefined) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
  className,
}: CategoryFilterProps) {
  const { t } = useLanguage();
  const allOption = { slug: undefined, name: "All", nameKey: "products.allCategories" };
  const options = [allOption, ...categories];

  return (
    <div className={cn("relative", className)}>
      {/* Edge fade — hints there's more to scroll on mobile. Disabled from
          sm up, where the row wraps instead of scrolling. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 right-0 sm:hidden [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-28px),transparent)]"
        aria-hidden
      />

      <div
        role="group"
        aria-label={t("products.filterByCategory")}
        className={cn(
          // Mobile: single-row horizontal scroll with snap
          "flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-proximity",
          "px-4 -mx-4 scroll-px-4", // let pills bleed to viewport edge, keep scroll-snap padding
          // sm+: no scrolling needed, wrap naturally in the available width
          "sm:flex-wrap sm:overflow-visible sm:px-0 sm:mx-0"
        )}
      >
        {options.map((option) => {
          const isActive = selected === option.slug;
          return (
            <button
              key={option.name}
              onClick={() => onSelect(option.slug)}
              aria-pressed={isActive}
              className={cn(
                "relative shrink-0 snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                "border",
                isActive
                  ? "text-primary-foreground border-transparent"
                  : "text-muted-foreground border-border/60 hover:text-foreground hover:border-foreground/30"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-primary -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {t(option.nameKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}