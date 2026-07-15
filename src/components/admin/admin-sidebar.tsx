"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Package, Tags, ShoppingCart, Ticket, Truck, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: null,
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/categories", label: "Categories", icon: Tags, exact: false },
      { href: "/admin/products", label: "Products", icon: Package, exact: false },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
      { href: "/admin/coupons", label: "Coupons", icon: Ticket, exact: false },
      { href: "/admin/customers", label: "Customers", icon: Users, exact: false },
    ],
  },
  {
    label: "Shipping",
    items: [
      { href: "/admin/shipping-methods", label: "Shipping", icon: Truck, exact: false }
    ],
  },
] as const;

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6 font-display text-base font-semibold tracking-tight">
        <span
          className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_2px] shadow-primary/60"
          aria-hidden
        />
        TECHSTORE <span className="text-muted-foreground font-normal">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-5">
          {NAV_GROUPS.map((group, index) => (
            <div key={group.label ?? index}>
              {group.label && (
                <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.label}
                </p>
              )}
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate px-1 text-xs text-muted-foreground">{adminEmail}</p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
