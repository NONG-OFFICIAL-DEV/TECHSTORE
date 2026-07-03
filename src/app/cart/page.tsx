"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 12;

export default function CartPage() {
  const items = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const clearCart = useCart((state) => state.clearCart);
  const subtotal = useCart((state) => state.totalPrice());

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
        <Breadcrumb items={[{ label: "Cart" }]} className="mb-8" />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse our products to get started."
          actionLabel="Browse Products"
          onAction={() => (window.location.href = "/products")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "Cart" }]} className="mb-8" />

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Your Cart
          </h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="gap-1.5 text-muted-foreground">
          <Trash2 className="h-3.5 w-3.5" />
          Clear cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Line items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              const key = `${item.product.id}-${item.selectedColor ?? "default"}`;

              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex gap-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-4"
                >
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted/30"
                  >
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {item.product.brand}
                        </p>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {item.selectedColor && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Color: {item.selectedColor}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <div className="flex items-center rounded-lg border border-border/60">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="p-2.5 hover:text-primary transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="p-2.5 hover:text-primary transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="font-semibold text-foreground">
                        {formatPrice(lineTotal, item.product.currency)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <motion.div
          layout
          className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 lg:sticky lg:top-24"
        >
          <h2 className="text-lg font-semibold text-foreground mb-5">
            Order Summary
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">
                {formatPrice(subtotal, "USD")}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span
                className={cn(
                  "font-medium",
                  shipping === 0 ? "text-primary" : "text-foreground"
                )}
              >
                {shipping === 0 ? "Free" : formatPrice(shipping, "USD")}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal, "USD")} more for free shipping.
              </p>
            )}
          </div>

          <Separator className="my-5" />

          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(total, "USD")}
            </span>
          </div>

          <Button size="lg" className="w-full gap-2">
            Checkout <ArrowRight className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" asChild className="w-full mt-2">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}