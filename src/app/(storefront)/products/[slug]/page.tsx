import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { RelatedProducts } from "@/components/product/related-products";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Nova" };
  }

  return {
    title: `${product.name} | Nova`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.thumbnail }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
      <Breadcrumb
        items={[
          { labelKey: "nav.products", href: "/products" },
          { label: product.name },
        ]}
        className="mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}