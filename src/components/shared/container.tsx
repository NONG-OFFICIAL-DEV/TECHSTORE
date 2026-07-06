import { cn } from "@/lib/utils";

/**
 * Use this to wrap every top-level page section instead of repeating
 * "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" by hand in each component.
 * One source of truth = sections can never drift out of alignment.
 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}