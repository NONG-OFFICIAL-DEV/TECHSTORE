"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);

  const specEntries = Object.entries(product.specs).slice(0, 3);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.colors?.[0]?.name);
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
        className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_32px_-8px] hover:shadow-primary/20"
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
                New
              </Badge>
            )}
            {product.discountPercent && (
              <Badge variant="destructive" className="border-0">
                -{product.discountPercent}%
              </Badge>
            )}
          </div>

          {/* Quick add */}
          <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              size="icon"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="rounded-full shadow-lg"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 gap-3">
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

          {/* Spec strip — signature element */}
          <ul className="flex flex-col gap-1 border-t border-border/50 pt-3 text-xs text-muted-foreground">
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
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}