import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Categories } from "@/components/home/categories";
import { Testimonials } from "@/components/home/testimonials";
import { CtaSection } from "@/components/home/cta-section";
import { getCategoriesSafe } from "@/lib/data/categories";
import { getFeaturedProductsSafe } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategoriesSafe(),
    getFeaturedProductsSafe(),
  ]);

  return (
    <>
      <Hero categories={categories} />
      <Categories categories={categories} />
      <FeaturedProducts featured={featured} />
      <Testimonials />
      <CtaSection />
    </>
  );
}