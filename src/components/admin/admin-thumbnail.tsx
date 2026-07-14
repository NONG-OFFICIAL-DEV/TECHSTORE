"use client";

import * as React from "react";
import { ImageOff } from "lucide-react";
import { isValidImagePath } from "@/lib/validation/image";

/** Admin-entered image URLs are unpredictable (any external host, typos,
 * dead links) — next/image would need every such host allow-listed in
 * next.config.ts and still throws at render time for malformed values. A
 * plain <img> with onError sidesteps both: the browser just fails to load
 * the pixel and we swap in a placeholder, instead of taking down the page. */
export function AdminThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = React.useState(!isValidImagePath(src));

  if (failed) {
    return (
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/30">
        <ImageOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/30">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
