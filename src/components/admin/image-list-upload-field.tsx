"use client";

import { ImageUploadField } from "@/components/admin/image-upload-field";

interface ImageListUploadFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  folder: "products" | "categories";
}

export function ImageListUploadField({ value, onChange, folder }: ImageListUploadFieldProps) {
  const updateAt = (index: number, url: string) => {
    if (!url) {
      onChange(value.filter((_, i) => i !== index));
      return;
    }
    onChange(value.map((existing, i) => (i === index ? url : existing)));
  };

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((url, index) => (
        <ImageUploadField
          key={`${index}-${url}`}
          value={url}
          onChange={(next) => updateAt(index, next)}
          folder={folder}
        />
      ))}
      <ImageUploadField value="" onChange={(url) => url && onChange([...value, url])} folder={folder} />
    </div>
  );
}
