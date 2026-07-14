import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Categories } from "@/components/home/categories";
import { Testimonials } from "@/components/home/testimonials";
import { CtaSection } from "@/components/home/cta-section";
import { getCategoriesSafe } from "@/lib/data/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getCategoriesSafe();

  return (
    <>
      <Hero categories={categories} />
      <Categories categories={categories} />
      <FeaturedProducts />
      <Testimonials />
      <CtaSection />
    </>
  );
}