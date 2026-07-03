"use client";

import { motion } from "framer-motion";
import { Category } from "@/types/product";
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
  const allOption = { slug: undefined, name: "All" };
  const options = [allOption, ...categories];

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => {
        const isActive = selected === option.slug;
        return (
          <button
            key={option.name}
            onClick={() => onSelect(option.slug)}
            aria-pressed={isActive}
            className={cn(
              "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
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
            {option.name}
          </button>
        );
      })}
    </div>
  );
}