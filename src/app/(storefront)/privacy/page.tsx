import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy | Nova",
  description: "How Nova collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "Privacy" }]} className="mb-8" />

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <div className="mt-10 flex flex-col gap-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Information we collect
          </h2>
          <p>
            When you place an order, contact us, or subscribe to our
            newsletter, we collect the details you provide directly — your
            name, phone number, delivery address, and email address — solely
            to fulfill your order or respond to your message.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            How we use your information
          </h2>
          <p>
            We use your information to process orders, coordinate delivery
            with our courier partners, respond to inquiries, and, if you
            opt in, send occasional updates about new products or offers.
            We do not sell your information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Data retention
          </h2>
          <p>
            Order and contact records are kept only as long as needed to
            fulfill your order and handle any follow-up questions. You can
            request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Contact us
          </h2>
          <p>
            Questions about this policy or your data? Reach out via our{" "}
            <a href="/contact" className="text-primary underline underline-offset-2">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
