import { getFeaturedProducts } from "@/data/products";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-4 md:py-4">
      <SectionHeading
        eyebrow="Handpicked"
        title="Featured Products"
        description="Our most-loved devices, chosen for standout performance and design."
        action={{ label: "View all", href: "/products" }}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {featured.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}