import { getFeaturedProducts } from "@/data/products";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-4 md:py-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SectionHeading
          eyebrow="Handpicked"
          title="Featured Products"
          description="Our most-loved devices, chosen for standout performance and design."
          className="mb-0"
        />
        <Button variant="ghost" asChild className="gap-2 mb-14 shrink-0">
          <Link href="/products">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {featured.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}