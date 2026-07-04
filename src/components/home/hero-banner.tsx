"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerSlide {
  eyebrow: string;
  offer: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
}

// Swap in real campaign photography — full-bleed, dark/moody works best
// since the text overlay relies on a gradient darkening the left side.
const BANNER_SLIDES: BannerSlide[] = [
  {
    eyebrow: "AeroBuds Pro Series",
    offer: "Up to 20% off Voucher",
    ctaLabel: "Shop Now",
    ctaHref: "/products?category=audio",
    image: "/images/hero/hero-product-2.avif",
    imageAlt: "AeroBuds Pro wireless earbuds",
  },
  {
    eyebrow: "PulseWatch Series",
    offer: "Launch price — 15% off",
    ctaLabel: "Shop Now",
    ctaHref: "/products?category=wearables",
    image: "/images/hero/hero-product-1.jpg",
    imageAlt: "PulseWatch smartwatch",
  },
];

export function HeroBanner({ className }: { className?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = BANNER_SLIDES[active];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-neutral-950 aspect-[16/9] sm:aspect-[21/9]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={active === 0}
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover"
          />
          {/* Gradient darkens the left side so overlaid text stays readable
              regardless of what's in the photo. */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="absolute inset-0 flex flex-col justify-end sm:justify-center gap-3 px-6 py-6 sm:px-10 max-w-sm"
        >
          <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
            <Zap className="h-3.5 w-3.5 text-primary" />
            {slide.eyebrow}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight text-balance">
            {slide.offer}
          </h2>

          <Link
            href={slide.ctaHref}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-white w-fit"
          >
            <span className="underline-offset-4 group-hover:underline">{slide.ctaLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators, overlaid on the image */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {BANNER_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={active === i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              active === i ? "w-5 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}