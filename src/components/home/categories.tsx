"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Headphones, Watch, Laptop, Home as HomeIcon, LucideIcon } from "lucide-react";
import { categories } from "@/data/products";
import { SectionHeading } from "@/components/shared/section-heading";

const ICON_MAP: Record<string, LucideIcon> = {
  Headphones,
  Watch,
  Laptop,
  Home: HomeIcon,
};

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by Category"
        description="Find exactly what you're looking for, organized the way you think."
        align="center"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category, index) => {
          const Icon = ICON_MAP[category.icon] ?? Headphones;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-border/60 aspect-[4/5] p-5 transition-all duration-300 hover:border-primary/40"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 -z-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent -z-10" />

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm mb-3">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {category.productCount} products
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}