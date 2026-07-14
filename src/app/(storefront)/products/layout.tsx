import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products | Nova",
  description:
    "Browse Nova's full lineup of audio, wearables, computing, and smart home devices.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}