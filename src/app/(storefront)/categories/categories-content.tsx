"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { useLanguage } from "@/providers/language-provider";
import { isValidImagePath } from "@/lib/validation/image";
import type { Category } from "@/types/product";

export function CategoriesContent({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
      <Breadcrumb items={[{ labelKey: "categoriesPage.breadcrumb" }]} className="mb-8" />
      <SectionHeading
        title={t("categoriesPage.title")}
        description={t("categoriesPage.description")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
          >
            <Link
              href={`/products?category=${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
                {isValidImagePath(category.image) && (
                  <Image
                    src={category.image}
                    alt={t(category.nameKey)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold text-foreground">
                  {t(category.nameKey)}
                </h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t(
                      category.productCount === 1
                        ? "categoriesPage.productCountOne"
                        : "categoriesPage.productCountOther",
                      { count: category.productCount }
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    {t("categoriesPage.viewProducts")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
