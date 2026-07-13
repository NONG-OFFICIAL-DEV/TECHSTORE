"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { useLanguage } from "@/providers/language-provider";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Designer",
    content:
      "The build quality on the Vector 14 is unreal. Screen alone was worth the upgrade, and battery life actually matches the marketing.",
    rating: 5,
    avatar: "/images/testimonials/avatar-1.jpg",
  },
  {
    id: "2",
    name: "Marcus Reyes",
    role: "Software Engineer",
    content:
      "Aero Pro's ANC is the best I've tried at this price point. Ordered a second pair for the office within a month.",
    rating: 5,
    avatar: "/images/testimonials/avatar-2.jpg",
  },
  {
    id: "3",
    name: "Priya Nair",
    role: "Fitness Coach",
    content:
      "Orbit tracks my workouts more accurately than my previous watch that cost twice as much. Battery easily lasts my whole week.",
    rating: 5,
    avatar: "/images/testimonials/avatar-3.jpg",
  },
];

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border/60 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
        <SectionHeading
          eyebrow={t("home.testimonialsEyebrow")}
          title={t("home.testimonialsTitle")}
          description={t("home.testimonialsDesc")}
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6"
            >
              <Quote className="h-6 w-6 text-primary/50" />

              <blockquote className="text-sm text-foreground/90 leading-relaxed flex-1">
                {testimonial.content}
              </blockquote>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>

              <figcaption className="flex items-center gap-3 pt-2 border-t border-border/50">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">
                  {testimonial.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}