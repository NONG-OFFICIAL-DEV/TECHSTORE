import type { Metadata } from "next";
import Image from "next/image";
import { Cpu, ShieldCheck, Truck, Users } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "About Us | Nova",
  description:
    "Learn about Nova's mission to design technology that moves with you — precision engineering meets everyday usability.",
};

const values = [
  {
    icon: Cpu,
    title: "Precision Engineering",
    description:
      "Every product goes through rigorous design and testing cycles before it reaches your hands.",
  },
  {
    icon: ShieldCheck,
    title: "Built to Last",
    description:
      "We use premium materials and back every purchase with a comprehensive warranty.",
  },
  {
    icon: Truck,
    title: "Fast, Reliable Shipping",
    description:
      "Most orders ship within 24 hours and arrive within 3-5 business days.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Our support team is available around the clock to help with anything you need.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "About" }]} className="mb-8" />

      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Our Story
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Technology built around
            <span className="block text-primary">real life.</span>
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Nova was founded on a simple idea: great technology shouldn&apos;t
            require compromise. We design audio, wearables, and computing
            products that pair premium materials with performance you can
            actually feel in daily use — not just on a spec sheet.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From our first pair of headphones to our latest ultrabook, every
            product is developed by a small team obsessed with details most
            companies skip. We test longer, iterate more, and ship only when
            something meets our bar.
          </p>
        </div>

        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border/60">
          <Image
            src="/images/about/about-hero.jpg"
            alt="Nova design studio"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Values */}
      <SectionHeading
        eyebrow="What we stand for"
        title="Our Values"
        align="center"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
        {values.map((value) => (
          <div
            key={value.title}
            className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <value.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">
              {value.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: "2019", label: "Founded" },
          { value: "50K+", label: "Customers served" },
          { value: "12", label: "Countries shipped to" },
          { value: "4.8/5", label: "Average rating" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}