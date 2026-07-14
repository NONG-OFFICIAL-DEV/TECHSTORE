"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useLanguage } from "@/providers/language-provider";
import { ContactForm } from "./contact-form";

const contactMethods = [
  {
    icon: Mail,
    labelKey: "contact.emailLabel",
    value: "support@novatech.com",
    href: "mailto:support@novatech.com",
  },
  {
    icon: Phone,
    labelKey: "contact.phoneLabel",
    value: "+1 (555) 012-3456",
    href: "tel:+15550123456",
  },
  {
    icon: MapPin,
    labelKey: "contact.studioLabel",
    value: "148 Harbor St, San Francisco, CA",
    href: "https://maps.google.com",
  },
];

export function ContactContent() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
      <Breadcrumb items={[{ label: t("nav.contact") }]} className="mb-8" />

      <div className="mb-12 max-w-2xl">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          {t("contact.eyebrow")}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {t("contact.title")}
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {t("contact.description")}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="flex flex-col gap-4 lg:order-2">
          {contactMethods.map((method) => (
            <a
              key={method.labelKey}
              href={method.href}
              className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <method.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t(method.labelKey)}
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
