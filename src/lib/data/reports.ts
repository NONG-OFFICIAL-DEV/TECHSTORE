import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/lib/prisma";

export type ReportRangeKey = "7d" | "30d" | "90d" | "365d" | "all";

export interface ReportRange {
  key: ReportRangeKey;
  label: string;
  from: Date;
  to: Date;
  /** Chart bucketing — daily for short ranges, monthly once the range gets
   * long enough that day-by-day would just be a wall of unreadable ticks. */
  granularity: "day" | "month";
}

const RANGE_PRESETS: { key: ReportRangeKey; label: string; days: number | null }[] = [
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
  { key: "365d", label: "Last 12 months", days: 365 },
  { key: "all", label: "All time", days: null },
];

function startOfUTCDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function endOfUTCDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

/** Resolves a `?range=` query value into concrete date bounds. Falls back to
 * 30 days for anything unrecognized. "All time" bounds `from` to the actual
 * oldest order instead of an arbitrary epoch, so a young store doesn't render
 * decades of empty chart buckets. */
export async function resolveReportRange(rangeParam: string | undefined): Promise<ReportRange> {
  const preset = RANGE_PRESETS.find((p) => p.key === rangeParam) ?? RANGE_PRESETS[1];
  const to = endOfUTCDay(new Date());

  if (preset.days === null) {
    const oldest = await prisma.order.findFirst({
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    const from = oldest ? startOfUTCDay(oldest.createdAt) : startOfUTCDay(new Date());
    return { key: preset.key, label: preset.label, from, to, granularity: "month" };
  }

  const from = startOfUTCDay(new Date());
  from.setUTCDate(from.getUTCDate() - (preset.days - 1));

  return {
    key: preset.key,
    label: preset.label,
    from,
    to,
    granularity: preset.days > 90 ? "month" : "day",
  };
}

export function getReportRangePresets() {
  return RANGE_PRESETS.map(({ key, label }) => ({ key, label }));
}

export interface SalesSummary {
  totalOrders: number;
  paidOrders: number;
  revenue: number;
  avgOrderValue: number;
  itemsSold: number;
  discountsGiven: number;
}

export async function getSalesSummary(from: Date, to: Date): Promise<SalesSummary> {
  const paidWhere = { createdAt: { gte: from, lte: to }, status: { not: "PENDING_PAYMENT" as const } };

  const [totalOrders, paidOrders, revenueAgg, itemsSoldAgg, discountAgg] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: from, lte: to } } }),
    prisma.order.count({ where: paidWhere }),
    prisma.order.aggregate({ _sum: { total: true }, where: paidWhere }),
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: { order: paidWhere },
    }),
    prisma.order.aggregate({ _sum: { discountAmount: true }, where: paidWhere }),
  ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);

  return {
    totalOrders,
    paidOrders,
    revenue,
    avgOrderValue: paidOrders > 0 ? revenue / paidOrders : 0,
    itemsSold: itemsSoldAgg._sum.quantity ?? 0,
    discountsGiven: Number(discountAgg._sum.discountAmount ?? 0),
  };
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export async function getRevenueTrend(
  from: Date,
  to: Date,
  granularity: "day" | "month"
): Promise<RevenueTrendPoint[]> {
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from, lte: to }, status: { not: "PENDING_PAYMENT" } },
    select: { createdAt: true, total: true },
  });

  const buckets = new Map<string, { revenue: number; orders: number; label: string }>();

  if (granularity === "day") {
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / dayMs) + 1);
    for (let i = 0; i < days; i++) {
      const day = new Date(from.getTime() + i * dayMs);
      const key = day.toISOString().slice(0, 10);
      buckets.set(key, {
        revenue: 0,
        orders: 0,
        label: day.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      });
    }
    for (const order of orders) {
      const key = order.createdAt.toISOString().slice(0, 10);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.revenue += Number(order.total);
        bucket.orders += 1;
      }
    }
  } else {
    const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
    const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));
    while (cursor.getTime() <= end.getTime()) {
      const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, {
        revenue: 0,
        orders: 0,
        label: cursor.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" }),
      });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    for (const order of orders) {
      const key = `${order.createdAt.getUTCFullYear()}-${String(order.createdAt.getUTCMonth() + 1).padStart(2, "0")}`;
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.revenue += Number(order.total);
        bucket.orders += 1;
      }
    }
  }

  return Array.from(buckets.values()).map(({ label, revenue, orders: orderCount }) => ({
    date: label,
    revenue,
    orders: orderCount,
  }));
}

export interface BestSellingProduct {
  productId: string | null;
  name: string;
  quantitySold: number;
  revenue: number;
}

export async function getBestSellingProducts(
  from: Date,
  to: Date,
  limit = 10
): Promise<BestSellingProduct[]> {
  const items = await prisma.orderItem.findMany({
    where: {
      order: { createdAt: { gte: from, lte: to }, status: { not: "PENDING_PAYMENT" } },
    },
    select: { productId: true, name: true, price: true, quantity: true },
  });

  const byKey = new Map<string, BestSellingProduct>();
  for (const item of items) {
    const key = item.productId ?? `deleted:${item.name}`;
    const revenue = Number(item.price) * item.quantity;
    const existing = byKey.get(key);
    if (existing) {
      existing.quantitySold += item.quantity;
      existing.revenue += revenue;
    } else {
      byKey.set(key, {
        productId: item.productId,
        name: item.name,
        quantitySold: item.quantity,
        revenue,
      });
    }
  }

  return Array.from(byKey.values())
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, limit);
}

export interface StatusBreakdownEntry {
  status: OrderStatus;
  count: number;
}

export async function getOrderStatusBreakdown(from: Date, to: Date): Promise<StatusBreakdownEntry[]> {
  const results = await prisma.order.groupBy({
    by: ["status"],
    where: { createdAt: { gte: from, lte: to } },
    _count: { _all: true },
  });

  return results
    .map((r) => ({ status: r.status, count: r._count._all }))
    .sort((a, b) => b.count - a.count);
}

export interface PaymentBreakdownEntry {
  method: string;
  count: number;
}

export async function getPaymentMethodBreakdown(from: Date, to: Date): Promise<PaymentBreakdownEntry[]> {
  const results = await prisma.order.groupBy({
    by: ["paymentMethod"],
    where: { createdAt: { gte: from, lte: to }, status: { not: "PENDING_PAYMENT" } },
    _count: { _all: true },
  });

  return results
    .map((r) => ({ method: r.paymentMethod, count: r._count._all }))
    .sort((a, b) => b.count - a.count);
}

export interface TopCustomer {
  phone: string;
  fullName: string;
  orderCount: number;
  totalSpent: number;
}

export interface CustomerStatistics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  avgOrdersPerCustomer: number;
  topCustomers: TopCustomer[];
}

/** No Customer table exists — storefront is guest-checkout only — so
 * customers are derived by grouping orders on phone number, same key used by
 * the admin Customers page. Needs the customer's full (all-time) order
 * history to tell a "new" customer (first-ever order lands in this range)
 * apart from a "returning" one, so it loads all paid orders once rather than
 * scoping the initial query to the range. */
export async function getCustomerStatistics(from: Date, to: Date, limit = 5): Promise<CustomerStatistics> {
  const allOrders = await prisma.order.findMany({
    where: { status: { not: "PENDING_PAYMENT" } },
    orderBy: { createdAt: "asc" },
    select: { customerPhone: true, customerFullName: true, total: true, createdAt: true },
  });

  const firstOrderAt = new Map<string, Date>();
  for (const order of allOrders) {
    if (!firstOrderAt.has(order.customerPhone)) {
      firstOrderAt.set(order.customerPhone, order.createdAt);
    }
  }

  const inRange = new Map<string, { fullName: string; orderCount: number; totalSpent: number }>();
  for (const order of allOrders) {
    if (order.createdAt < from || order.createdAt > to) continue;
    const existing = inRange.get(order.customerPhone);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += Number(order.total);
    } else {
      inRange.set(order.customerPhone, {
        fullName: order.customerFullName,
        orderCount: 1,
        totalSpent: Number(order.total),
      });
    }
  }

  const totalCustomers = inRange.size;
  let newCustomers = 0;
  for (const phone of inRange.keys()) {
    if (firstOrderAt.get(phone)! >= from) newCustomers++;
  }

  const totalOrdersInRange = Array.from(inRange.values()).reduce((sum, c) => sum + c.orderCount, 0);

  const topCustomers = Array.from(inRange.entries())
    .map(([phone, c]) => ({ phone, ...c }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);

  return {
    totalCustomers,
    newCustomers,
    returningCustomers: totalCustomers - newCustomers,
    avgOrdersPerCustomer: totalCustomers > 0 ? totalOrdersInRange / totalCustomers : 0,
    topCustomers,
  };
}
