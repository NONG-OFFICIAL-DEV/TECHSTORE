import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getCategories } from "@/lib/data/categories";

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <MobileNav />
    </>
  );
}
