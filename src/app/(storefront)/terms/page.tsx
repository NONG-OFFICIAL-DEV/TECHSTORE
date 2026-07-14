import type { Metadata } from "next";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Service | Nova",
  description: "The terms that govern your use of the Nova store.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "Terms" }]} className="mb-8" />

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

      <div className="mt-10 flex flex-col gap-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Orders</h2>
          <p>
            Placing an order through checkout registers a request to
            purchase; it is confirmed once we receive and verify your
            payment. Prices, delivery estimates, and product availability
            are subject to change without notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Payment</h2>
          <p>
            We currently confirm payments manually via Bakong KHQR or bank
            transfer. Please send your payment screenshot referencing your
            order number so we can confirm and fulfill your order promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Shipping &amp; delivery
          </h2>
          <p>
            Delivery timelines shown at checkout are estimates provided by
            our courier partners and are not guaranteed. Nova is not
            responsible for delays caused by couriers, weather, or
            incorrect address information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Returns &amp; warranty
          </h2>
          <p>
            Products are covered by their listed warranty against
            manufacturing defects. Contact us within 7 days of delivery for
            issues with your order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Contact us
          </h2>
          <p>
            Questions about these terms? Reach out via our{" "}
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
