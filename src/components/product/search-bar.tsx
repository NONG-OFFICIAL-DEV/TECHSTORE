"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search products…",
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce input to avoid filtering on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(localValue);
    }, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-9"
        aria-label="Search products"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}