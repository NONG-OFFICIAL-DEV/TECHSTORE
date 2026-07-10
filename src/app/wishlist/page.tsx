"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";

export default function WishlistPage() {
  const storedItems = useWishlist((state) => state.items);

  // Wishlist state comes from localStorage, which the server can't see —
  // gate on mount so the first client render matches the server's markup.
  const mounted = useHasMounted();
  const items = mounted ? storedItems : [];

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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence initial={false}>
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
