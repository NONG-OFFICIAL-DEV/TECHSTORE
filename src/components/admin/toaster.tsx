"use client";

import { useTheme } from "@/providers/theme-provider";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "light" ? "light" : "dark"}
      richColors
      position="top-right"
    />
  );
}
