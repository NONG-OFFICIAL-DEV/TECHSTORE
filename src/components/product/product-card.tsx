"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useLanguage } from "@/providers/language-provider";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useLanguage();
  const addItem = useCart((state) => state.addItem);
  const wishlisted = useWishlist((state) => state.isWishlisted(product.id));
  const toggleWishlist = useWishlist((state) => state.toggleItem);

  // Wishlist state comes from localStorage, which the server can't see —
  // gate on mount so the first client render matches the server's markup.
  const mounted = useHasMounted();
  const isWishlisted = mounted && wishlisted;

  const specEntries = Object.entries(product.specs).slice(0, 3);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.colors?.[0]?.name);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="group h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300",
          "hover:border-primary/40 hover:shadow-[0_0_32px_-8px] hover:shadow-primary/20",
          // :active fires on tap (unlike :hover), so touch users still get
          // feedback that the card responded to their press.
          "active:scale-[0.98] active:border-primary/30"
        )}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground border-0">
                {t("products.newBadge")}
              </Badge>
            )}
            {product.discountPercent && (
              <Badge variant="secondary" className="border-0">
                -{product.discountPercent}%
              </Badge>
            )}
          </div>

          {/* Wishlist toggle */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={t(
              isWishlisted ? "productDetail.removeFromWishlist" : "productDetail.addToWishlist"
            )}
            aria-pressed={isWishlisted}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm border border-border/60 transition-colors hover:border-primary/40 cursor-pointer"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </button>

          {/* Quick add — always visible on touch devices (no hover to
              reveal it on), hover-reveal kept only from md up where a
              mouse/hover actually exists. */}
          <div
            className={cn(
              "absolute bottom-3 right-3 opacity-100 translate-y-0 transition-all duration-300",
              "md:opacity-0 md:translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            )}
          >
            <Button
              size="icon"
              onClick={handleAddToCart}
              aria-label={t("common.addToCart")}
              className="h-11 w-11 md:h-10 md:w-10 rounded-full shadow-lg cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3 sm:p-4 gap-2.5 sm:gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {product.brand}
            </p>
            <h3 className="mt-1 font-semibold text-foreground leading-snug line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>

          {/* Spec strip — signature element on larger cards, but too much
              detail for a quick mobile browse. Hidden below sm; mobile
              cards show only name, rating, and price. */}
          <ul className="hidden sm:flex flex-col gap-1 border-t border-border/50 pt-3 text-xs text-muted-foreground">
            {specEntries.map(([key, value]) => (
              <li key={key} className="flex items-center justify-between gap-2">
                <span className="truncate">{key}</span>
                <span className="font-medium text-foreground/80 truncate">
                  {value}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center gap-2 pt-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}