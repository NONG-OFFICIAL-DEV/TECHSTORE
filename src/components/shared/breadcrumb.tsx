"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

export interface BreadcrumbItem {
  /** Static content (e.g. a product name) that isn't part of the UI dictionary. */
  label?: string;
  /** Dictionary key for chrome labels — used when this page is a server
      component and can't call useLanguage() itself. Takes priority over label. */
  labelKey?: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className={cn("w-full", className)}>
      <ol className="flex items-center flex-wrap gap-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">{t("common.home")}</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const text = item.labelKey ? t(item.labelKey) : item.label;
          return (
            <li key={item.labelKey ?? item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {text}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "text-foreground font-medium")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {text}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}