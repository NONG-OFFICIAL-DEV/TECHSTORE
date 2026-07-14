import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Nova",
  description: "Review the items in your cart and proceed to checkout.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}