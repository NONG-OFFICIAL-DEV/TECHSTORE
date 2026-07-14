import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCategories } from "@/lib/data/categories";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout wraps statically-generated pages (e.g. /products/[slug],
  // built via generateStaticParams) — a DB hiccup here must not fail the
  // whole build over data the footer treats as decoration. Degrade to an
  // empty list instead of throwing.
  const categories = await getCategories().catch((error) => {
    console.error("Failed to load categories for storefront layout:", error);
    return [];
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <MobileNav />
    </>
  );
}
