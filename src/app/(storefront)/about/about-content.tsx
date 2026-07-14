"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Cpu,
  ShieldCheck,
  Truck,
  Users,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";

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

const stats = [
  { value: "2019", label: "Founded" },
  { value: "50K+", label: "Customers served" },
  { value: "12", label: "Countries shipped to" },
  { value: "4.8/5", label: "Average rating" },
];

const galleryImages = [
  {
    src: "/images/categories/computing.jpg",
    alt: "Nova computing lineup arranged in the studio",
  },
  {
    src: "/images/products/headphones-2.jpg",
    alt: "Close-up detail of Nova headphones",
  },
  {
    src: "/images/products/laptop-3.jpg",
    alt: "Nova ultrabook being used at a desk",
  },
];

export function AboutContent() {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "About" }]} className="mb-8" />

      {/* Hero */}
      <div className="relative mb-28 md:mb-32">
        <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-[320px] w-[320px] rounded-full bg-primary/20 blur-[110px]" />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Our Story
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight text-balance">
              Technology built around
              <span className="block text-primary">real life.</span>
            </h1>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Nova was founded on a simple idea: great technology
              shouldn&apos;t require compromise. We design audio, wearables,
              and computing products that pair premium materials with
              performance you can actually feel in daily use — not just on a
              spec sheet.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From our first pair of headphones to our latest ultrabook,
              every product is developed by a small team obsessed with
              details most companies skip. We test longer, iterate more, and
              ship only when something meets our bar.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild className="gap-2">
                <Link href="/products">
                  Shop Collection <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border/60">
              <Image
                src="/images/hero/spotlight-audio.jpg"
                alt="Nova products styled in a studio setting"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Floating rating card */}
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-border/60 bg-card/90 backdrop-blur-md px-5 py-4 shadow-xl">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Star className="h-5 w-5 fill-primary text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">
                  4.8/5
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  from 50K+ customers
                </p>
              </div>
            </div>

            {/* Floating founded badge */}
            <div className="absolute -top-4 -right-4 hidden sm:block rounded-2xl border border-border/60 bg-card/90 backdrop-blur-md px-4 py-2.5 shadow-xl">
              <p className="text-xs font-semibold text-foreground">
                Est. 2019
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-24 md:mb-28">
        <SectionHeading
          eyebrow="A closer look"
          title="Crafted with care"
          align="center"
        />
        <div className="grid sm:grid-cols-3 gap-5">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/60"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-24 md:mb-28">
        <SectionHeading
          eyebrow="What we stand for"
          title="Our Values"
          align="center"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] w-[560px] rounded-full bg-primary/15 blur-[100px]" />
        </div>

        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
