"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/30 mb-5">
        <AlertTriangle className="h-7 w-7 text-destructive" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{t("errorPage.title")}</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        {t("errorPage.description")}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => unstable_retry()}>{t("errorPage.tryAgain")}</Button>
        <Button variant="outline" asChild>
          <Link href="/">{t("errorPage.backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
