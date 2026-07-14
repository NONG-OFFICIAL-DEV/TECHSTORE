"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${categoryName}"? This can't be undone.`)) return;

    setIsDeleting(true);
    const response = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
      return;
    }

    const data = await response.json().catch(() => null);
    setIsDeleting(false);
    window.alert(data?.error ?? "Failed to delete category.");
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm font-medium text-destructive hover:underline disabled:opacity-50"
      aria-label={`Delete ${categoryName}`}
    >
      <span className="inline-flex items-center gap-1">
        <Trash2 className="h-3.5 w-3.5" />
        {isDeleting ? "Deleting..." : "Delete"}
      </span>
    </button>
  );
}
