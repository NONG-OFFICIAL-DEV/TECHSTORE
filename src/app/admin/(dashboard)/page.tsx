import Link from "next/link";
import { Package, Tags, ShoppingCart, Clock, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import { RevenueChart, type RevenueTrendPoint } from "@/components/admin/revenue-chart";

export const dynamic = "force-dynamic";

async function getRevenueTrend(): Promise<RevenueTrendPoint[]> {
  const DAYS = 30;
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (DAYS - 1));

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start }, status: { not: "PENDING_PAYMENT" } },
    select: { createdAt: true, total: true },
  });

  const buckets = new Map<string, { revenue: number; orders: number }>();
  for (let i = 0; i < DAYS; i++) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    buckets.set(day.toISOString().slice(0, 10), { revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.revenue += Number(order.total);
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.entries()).map(([isoDate, { revenue, orders: orderCount }]) => ({
    date: new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
    revenue,
    orders: orderCount,
  }));
}

async function getStats() {
  const [productCount, categoryCount, orderCount, pendingCount, lowStockCount, revenue] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.product.count({
        where: { inStock: true, stockCount: { lte: LOW_STOCK_THRESHOLD } },
      }),
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
    lowStockCount,
    revenue: Number(revenue._sum.total ?? 0),
  };
}

export default async function AdminDashboardPage() {
  const [stats, revenueTrend] = await Promise.all([getStats(), getRevenueTrend()]);

  const cards = [
    { label: "Products", value: stats.productCount, icon: Package, href: "/admin/products" },
    { label: "Categories", value: stats.categoryCount, icon: Tags, href: "/admin/categories" },
    { label: "Orders", value: stats.orderCount, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Pending Payment", value: stats.pendingCount, icon: Clock, href: "/admin/orders" },
    {
      label: "Low Stock",
      value: stats.lowStockCount,
      icon: AlertTriangle,
      href: "/admin/products",
    },
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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

      <div className="mt-6">
        <RevenueChart data={revenueTrend} />
      </div>
    </div>
  );
}
