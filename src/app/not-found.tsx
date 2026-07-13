"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 border border-border/60 mb-5">
        <Compass className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{t("notFound.title")}</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        {t("notFound.description")}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">{t("notFound.backHome")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">{t("notFound.browseProducts")}</Link>
        </Button>
      </div>
    </div>
  );
}
