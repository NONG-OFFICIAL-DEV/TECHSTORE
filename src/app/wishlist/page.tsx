"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const items = useWishlist((state) => state.items);
  const removeItem = useWishlist((state) => state.removeItem);
  const addToCart = useCart((state) => state.addItem);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
        <Breadcrumb items={[{ label: "Wishlist" }]} className="mb-8" />
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you're interested in by tapping the heart icon."
          actionLabel="Browse Products"
          onAction={() => (window.location.href = "/products")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
      <Breadcrumb items={[{ label: "Wishlist" }]} className="mb-8" />

      <SectionHeading
        title="Your Wishlist"
        description={`${items.length} item${items.length !== 1 ? "s" : ""} saved`}
        className="mb-8 md:mb-12"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence initial={false}>
          {items.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden"
            >
              <Link href={`/products/${product.slug}`} className="relative aspect-square bg-muted/30">
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col p-4 gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {product.brand}
                </p>
                <Link
                  href={`/products/${product.slug}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {product.name}
                </Link>
                <span className="font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>

                <div className="mt-auto flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                    disabled={!product.inStock}
                    onClick={() => addToCart(product, 1, product.colors?.[0]?.name)}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <button
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
