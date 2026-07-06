"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Optional "View all" style link — always stays on the same row as
      the title (title left, link right), regardless of `align`. */
  action?: { label: string; href: string };
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  // Centering only makes sense when there's no side-by-side action link —
  // a centered title fighting a right-pinned link looks broken, so the
  // row layout takes priority whenever `action` is provided.
  const useCenteredLayout = align === "center" && !action;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("mb-8 md:mb-12", className)}
    >
      <div
        className={cn(
          "flex justify-between gap-4",
          useCenteredLayout && "flex-col items-center text-center mx-auto max-w-2xl"
        )}
      >
        <div>
          {eyebrow && (
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              {eyebrow}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>

        {action && (
          <Link
            href={action.href}
            className="group shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary mt-1 sm:mt-2"
          >
            {action.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {description && (
        <p
          className={cn(
            "mt-3 text-sm md:text-base text-muted-foreground leading-relaxed",
            useCenteredLayout && "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}