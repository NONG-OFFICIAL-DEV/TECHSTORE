"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${productName}"? This can't be undone.`)) return;

    setIsDeleting(true);
    const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    if (response.ok) {
      router.refresh();
    } else {
      setIsDeleting(false);
      window.alert("Failed to delete product.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm font-medium text-destructive hover:underline disabled:opacity-50"
      aria-label={`Delete ${productName}`}
    >
      <span className="inline-flex items-center gap-1">
        <Trash2 className="h-3.5 w-3.5" />
        {isDeleting ? "Deleting..." : "Delete"}
      </span>
    </button>
  );
}
