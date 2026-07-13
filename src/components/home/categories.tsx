"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Headphones, Watch, Laptop, Home as HomeIcon, type LucideIcon } from "lucide-react";
import { categories } from "@/data/products";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { useLanguage } from "@/providers/language-provider";

const ICON_MAP: Record<string, LucideIcon> = {
  Headphones,
  Watch,
  Laptop,
  Home: HomeIcon,
};

export function Categories() {
  const { t } = useLanguage();

  return (
    <Container className="py-16 md:py-16">
      <SectionHeading
        eyebrow={t("home.categoriesEyebrow")}
        title={t("home.categoriesTitle")}
        description={t("home.categoriesDesc")}
        action={{ label: t("common.viewAll"), href: "/categories" }}
      />

      {/* Icon row: horizontal scroll on mobile, wraps + centers from sm up */}
      <div className="relative">
        <div
          className={cn(
            "flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-proximity",
            "px-4 -mx-4 scroll-px-4",
            "sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:mx-0"
          )}
        >
          {categories.map((category, index) => {
            const Icon = ICON_MAP[category.icon] ?? Headphones;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
                className="shrink-0 snap-start"
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group flex flex-col items-center gap-3 w-20"
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-full border border-border",
                      "transition-all duration-300 group-hover:border-primary group-hover:-translate-y-1",
                      "group-hover:shadow-lg group-hover:shadow-primary/15"
                    )}
                  >
                    <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground text-center transition-colors group-hover:text-foreground">
                    {t(category.nameKey)}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Edge fade hinting more content on mobile scroll */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 right-0 sm:hidden [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-28px),transparent)]"
          aria-hidden
        />
      </div>
    </Container>
  );
}