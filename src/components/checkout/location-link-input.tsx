"use client";

import { useState } from "react";
import { Link2, CheckCircle2, LoaderCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  parseCoordsFromGoogleMapsUrl,
  isGoogleMapsUrl,
  isGoogleMapsShortLink,
} from "@/lib/google-maps-link";

interface LocationLinkInputProps {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number } | null) => void;
}

export function LocationLinkInput({ value, onChange }: LocationLinkInputProps) {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    const trimmed = link.trim();
    if (!trimmed) return;

    if (!isGoogleMapsUrl(trimmed)) {
      setStatus("error");
      setError(
        "That doesn't look like a Google Maps link. Open Google Maps, tap Share, and paste the link here."
      );
      return;
    }

    setStatus("loading");
    setError(null);

    // Long-form links already contain coordinates — no network round trip needed.
    if (!isGoogleMapsShortLink(trimmed)) {
      const directCoords = parseCoordsFromGoogleMapsUrl(trimmed);
      if (directCoords) {
        onChange(directCoords);
        setStatus("idle");
        return;
      }
    }

    // Shortened links (maps.app.goo.gl) redirect to a long-form URL — the
    // browser can't read a cross-origin redirect, so resolve it server-side.
    try {
      const res = await fetch(
        `/api/resolve-map-link?url=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();

      if (!res.ok || typeof data.lat !== "number") {
        throw new Error(data.error || "Couldn't read that link.");
      }

      onChange({ lat: data.lat, lng: data.lng });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't read that link.");
    }
  };

  if (value) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> Location captured
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={`https://www.google.com/maps?q=${value.lat},${value.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-primary underline underline-offset-2"
          >
            View on map
          </a>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setLink("");
              setStatus("idle");
              setError(null);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="url"
            inputMode="url"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Paste Google Maps share link…"
            className="pl-10"
          />
        </div>
        <Button
          type="button"
          onClick={handleParse}
          disabled={!link.trim() || status === "loading"}
          className="gap-2 sm:w-auto"
        >
          {status === "loading" ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" /> Reading…
            </>
          ) : (
            "Use This Link"
          )}
        </Button>
      </div>

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Open Google Maps → tap your location → Share → Copy link, then paste
        it above.
      </p>
    </div>
  );
}