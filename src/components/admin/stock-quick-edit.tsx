"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

interface StockQuickEditProps {
  productId: string;
  stockCount: number | null;
  inStock: boolean;
}

export function StockQuickEdit({ productId, stockCount, inStock }: StockQuickEditProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(stockCount?.toString() ?? "0");
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const startEditing = () => {
    setValue(stockCount?.toString() ?? "0");
    setError(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
      setError("Whole number, 0 or more.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockCount: parsed }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Failed to update stock.");
        setIsSaving(false);
        return;
      }

      toast.success("Stock updated.");
      setIsEditing(false);
      setIsSaving(false);
      router.refresh();
    } catch {
      setError("Failed to update stock.");
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Input
          autoFocus
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setIsEditing(false);
          }}
          className="h-8 w-20 text-base sm:text-sm"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save stock count"
          className="shrink-0 text-primary hover:text-primary/80 disabled:opacity-50"
        >
          {isSaving ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          disabled={isSaving}
          aria-label="Cancel"
          className="shrink-0 text-muted-foreground hover:text-destructive disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    );
  }

  const isLowStock = inStock && stockCount != null && stockCount <= LOW_STOCK_THRESHOLD;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        startEditing();
      }}
      className="group flex items-center gap-2"
      aria-label="Adjust stock"
    >
      {!inStock ? (
        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
          Out of stock
        </span>
      ) : (
        <span className="text-muted-foreground">{stockCount ?? "—"}</span>
      )}
      {isLowStock && (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Low stock
        </span>
      )}
      <Pencil className="h-3 w-3 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground" />
    </button>
  );
}
