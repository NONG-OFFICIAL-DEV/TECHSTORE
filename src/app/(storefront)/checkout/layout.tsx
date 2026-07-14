import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout | Nova",
  description: "Provide your shipping details and payment information to complete your order.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}