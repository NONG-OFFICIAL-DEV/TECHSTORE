import Link from "next/link";
import { Package, Tags, ShoppingCart, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AutoRefresh } from "@/components/admin/auto-refresh";

export const dynamic = "force-dynamic";

async function getStats() {
  const [productCount, categoryCount, orderCount, pendingCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "PENDING_PAYMENT" } },
    }),
  ]);

  return {
    productCount,
    categoryCount,
    orderCount,
    pendingCount,
    revenue: Number(revenue._sum.total ?? 0),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Products", value: stats.productCount, icon: Package, href: "/admin/products" },
    { label: "Categories", value: stats.categoryCount, icon: Tags, href: "/admin/categories" },
    { label: "Orders", value: stats.orderCount, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Pending Payment", value: stats.pendingCount, icon: Clock, href: "/admin/orders" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at the store.
          </p>
        </div>
        <AutoRefresh />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-bold">{card.value}</p>
            </Link>
          );
        })}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <span className="text-sm font-medium text-muted-foreground">Paid Revenue</span>
          <p className="mt-2 text-2xl font-bold text-primary">{formatPrice(stats.revenue)}</p>
        </div>
      </div>
    </div>
  );
}
