"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid3x3, ShoppingBag, Heart, LucideIcon } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

// About/Contact intentionally left off this bar — it's reserved for the
// core shopping actions; those pages stay reachable via the footer.
const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { href: "/", labelKey: "nav.home", icon: Home },
  { href: "/products", labelKey: "nav.shop", icon: Grid3x3 },
  { href: "/wishlist", labelKey: "nav.wishlist", icon: Heart },
  { href: "/cart", labelKey: "nav.cart", icon: ShoppingBag },
];

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const totalItems = useCart((state) => state.totalItems());
  const wishlistCount = useWishlist((state) => state.items.length);

  // Track mount status to delay reading local cart data during SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={t(item.labelKey)}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-muted-foreground transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}

                <span className="relative flex h-6 w-6 items-center justify-center">
                  <Icon
                    className={cn("h-5 w-5", active && "text-primary")}
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                  {/* FIXED: added isMounted safety check to eliminate hydration warnings */}
                  {item.href === "/cart" && isMounted && totalItems > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-mono font-medium text-primary-foreground">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                  {item.href === "/wishlist" && isMounted && wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-mono font-medium text-primary-foreground">
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </span>
                  )}
                </span>

                <span
                  className={cn(
                    "text-[10px] font-medium",
                    active && "text-primary"
                  )}
                >
                  {t(item.labelKey)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}