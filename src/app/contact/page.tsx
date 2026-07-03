import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Nova",
  description:
    "Get in touch with the Nova team — we're here to help with orders, products, and support.",
};

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "support@novatech.com",
    href: "mailto:support@novatech.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 012-3456",
    href: "tel:+15550123456",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "148 Harbor St, San Francisco, CA",
    href: "https://maps.google.com",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "Contact" }]} className="mb-8" />

      <div className="mb-12 max-w-2xl">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          Get in Touch
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          We&apos;d love to hear from you
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Questions about an order, a product, or a partnership — send us a
          message and our team will respond within one business day.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="flex flex-col gap-4 lg:order-2">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <method.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {method.label}
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {method.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 lg:order-1">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}