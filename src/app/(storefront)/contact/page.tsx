import type { Metadata } from "next";
import { ContactContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Contact Us | Nova",
  description:
    "Get in touch with the Nova team — we're here to help with orders, products, and support.",
};

export default function ContactPage() {
  return <ContactContent />;
}
