"use client";

import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { useLanguage } from "@/providers/language-provider";

export function FeaturedProducts({ featured }: { featured: Product[] }) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-4 md:py-4">
      <SectionHeading
        eyebrow={t("home.featuredEyebrow")}
        title={t("home.featuredTitle")}
        description={t("home.featuredDesc")}
        action={{ label: t("common.viewAll"), href: "/products" }}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {featured.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}