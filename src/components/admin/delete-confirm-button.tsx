"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmButtonProps {
  /** What's being deleted, shown in the confirmation copy (e.g. "Titan Gaming Headset"). */
  itemName: string;
  /** Noun for generic copy, e.g. "product" / "category". */
  itemLabel: string;
  /** Performs the deletion; return `{ ok: true }` or `{ ok: false, error }`. */
  onDelete: () => Promise<{ ok: boolean; error?: string }>;
}

export function DeleteConfirmButton({ itemName, itemLabel, onDelete }: DeleteConfirmButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    const result = await onDelete();
    setIsDeleting(false);
    setOpen(false);

    if (result.ok) {
      toast.success(`"${itemName}" deleted.`);
      router.refresh();
    } else {
      toast.error(result.error ?? `Failed to delete ${itemLabel}.`);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isDeleting && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-medium text-destructive hover:underline"
          aria-label={`Delete ${itemName}`}
        >
          <span className="inline-flex items-center gap-1">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this {itemLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &ldquo;{itemName}&rdquo;. This action can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isDeleting}
          >
            {isDeleting && <Spinner className="mr-1.5" />}
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
