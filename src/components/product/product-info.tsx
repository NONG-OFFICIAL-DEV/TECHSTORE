"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {product.brand}
          </p>
          {product.isNew && <Badge>New</Badge>}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          {product.name}
        </h1>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.round(product.rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">
            {product.rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-foreground">
          {formatPrice(product.price, product.currency)}
        </span>
        {product.compareAtPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
            <Badge variant="destructive">
              Save {product.discountPercent}%
            </Badge>
          </>
        )}
      </div>

      <p className="text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      <Separator />

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-3">
            Color — <span className="text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="flex gap-2.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                aria-label={`Select ${color.name}`}
                aria-pressed={selectedColor === color.name}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-all duration-200",
                  selectedColor === color.name
                    ? "border-primary scale-110"
                    : "border-border/60 hover:scale-105"
                )}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <ul className="flex flex-col gap-2.5">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground/90">{feature}</span>
          </li>
        ))}
      </ul>

      <Separator />

      {/* Quantity + Add to cart */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-border/60">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="p-3 hover:text-primary transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="p-3 hover:text-primary transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex-1 gap-2"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </Button>
      </div>

      {product.inStock && product.stockCount && product.stockCount < 20 && (
        <p className="text-xs text-primary font-medium">
          Only {product.stockCount} left in stock — order soon.
        </p>
      )}

      <Separator />

      {/* Specifications */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Specifications
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {Object.entries(product.specs).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between border-b border-border/40 pb-2 text-sm"
            >
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="font-medium text-foreground text-right">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}