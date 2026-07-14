"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

/**
 * Polls the server for fresh data by re-running the current Server Component
 * on an interval. Not push-based realtime (no websockets/Supabase Realtime
 * subscription) — just a periodic `router.refresh()`, which is enough to
 * surface new orders within a few seconds without any new infra. Pauses
 * while the tab is hidden so it doesn't burn requests in the background.
 */
export function AutoRefresh({ intervalMs = 10_000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      router.refresh();
    };

    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    // No completion signal from router.refresh() itself — this just gives
    // the icon a moment to spin so the click registers as having done something.
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Live
      <button
        type="button"
        onClick={handleManualRefresh}
        aria-label="Refresh now"
        className="ml-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <RefreshCw className={isRefreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
      </button>
    </div>
  );
}
