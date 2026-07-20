"use client";

import * as React from "react";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  folder: "products" | "categories";
  disabled?: boolean;
  "aria-invalid"?: boolean;
  className?: string;
}

export function ImageUploadField({
  value,
  onChange,
  folder,
  disabled,
  "aria-invalid": ariaInvalid,
  className,
}: ImageUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = React.useState(false);

  const upload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Upload failed. Please try again.");
        return;
      }
      setPreviewFailed(false);
      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) upload(file);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={handleFileChange}
      />
      <div
        role="button"
        tabIndex={0}
        data-invalid={ariaInvalid}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-background/60 transition-colors",
          "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "data-[invalid=true]:border-destructive",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {value && !previewFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
            {previewFailed ? <ImageOff className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
            <span className="text-[11px]">{previewFailed ? "Broken image" : "Click to upload"}</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        {value && !isUploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setPreviewFailed(false);
            }}
            aria-label="Remove image"
            className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
