import Link from "next/link";
import { Headphones, Watch, Keyboard, BatteryCharging, ChevronRight, type LucideIcon } from "lucide-react";
import { CATEGORIES } from "@/data/nav";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Headphones,
  Watch,
  Keyboard,
  BatteryCharging,
};

export function CategorySidebar({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Shop by category"
      className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}
    >
      <ul className="divide-y divide-border">
        {CATEGORIES.map((category) => {
          const Icon = ICONS[category.icon];
          return (
            <li key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface"
              >
                <span className="flex items-center gap-3 text-foreground">
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                  {category.name}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}