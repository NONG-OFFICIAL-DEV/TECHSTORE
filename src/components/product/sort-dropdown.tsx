"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/types/product";
import { useLanguage } from "@/providers/language-provider";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: "featured", labelKey: "products.sortFeatured" },
  { value: "newest", labelKey: "products.sortNewest" },
  { value: "price-asc", labelKey: "products.sortPriceAsc" },
  { value: "price-desc", labelKey: "products.sortPriceDesc" },
  { value: "rating", labelKey: "products.sortRating" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t } = useLanguage();

  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[190px] gap-2">
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <SelectValue placeholder={t("products.sortBy")} />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {t(option.labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}