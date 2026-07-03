"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm px-8 py-16 md:py-20 text-center"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-primary/20 blur-[100px]" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground max-w-2xl mx-auto">
          Ready to upgrade your setup?
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Explore the full collection and find the device that fits how you
          work, train, and live.
        </p>
        <Button size="lg" asChild className="mt-8 gap-2">
          <Link href="/products">
            Browse All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}