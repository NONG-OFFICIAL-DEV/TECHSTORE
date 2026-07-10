"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/data/nav";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const totalItems = useCart((state) => state.totalItems());
  const wishlistCount = useWishlist((state) => state.items.length);

  // Avoid a hydration mismatch: the cart is read from localStorage, which
  // only exists on the client, so the server always renders 0 items.
  const mounted = useHasMounted();
  const displayedCartCount = mounted ? totalItems : 0;
  const displayedWishlistCount = mounted ? wishlistCount : 0;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span
            className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_2px] shadow-primary/60"
            aria-hidden
          />
          TECHSTORE
        </Link>

        {/* Desktop links */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute -bottom-[1px] left-0 h-[1.5px] w-full bg-primary"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search products" asChild>
            <Link href="/products">
              <Search />
            </Link>
          </Button>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            aria-label={`View wishlist, ${displayedWishlistCount} item${displayedWishlistCount === 1 ? "" : "s"}`}
            className="relative hidden md:inline-flex"
            asChild
          >
            <Link href="/wishlist">
              <Heart />
              {displayedWishlistCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-mono font-medium text-primary-foreground">
                  {displayedWishlistCount > 9 ? "9+" : displayedWishlistCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Cart icon stays here for desktop; mobile users have the bottom tab bar */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`View cart, ${displayedCartCount} item${displayedCartCount === 1 ? "" : "s"}`}
            className="relative hidden md:inline-flex"
            asChild
          >
            <Link href="/cart">
              <ShoppingBag />
              {displayedCartCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-mono font-medium text-primary-foreground">
                  {displayedCartCount > 9 ? "9+" : displayedCartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}