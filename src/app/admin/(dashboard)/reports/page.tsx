import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import {
  resolveReportRange,
  getReportRangePresets,
  getSalesSummary,
  getRevenueTrend,
  getBestSellingProducts,
  getOrderStatusBreakdown,
  getPaymentMethodBreakdown,
  getCustomerStatistics,
} from "@/lib/data/reports";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { STATUS_LABELS } from "@/components/admin/order-status-badge";
import { AutoRefresh } from "@/components/admin/auto-refresh";

export const dynamic = "force-dynamic";

interface ReportsPageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminReportsPage({ searchParams }: ReportsPageProps) {
  const { range: rangeParam } = await searchParams;
  const range = await resolveReportRange(rangeParam);

  const [summary, trend, bestSellers, statusBreakdown, paymentBreakdown, customerStats] = await Promise.all([
    getSalesSummary(range.from, range.to),
    getRevenueTrend(range.from, range.to, range.granularity),
    getBestSellingProducts(range.from, range.to),
    getOrderStatusBreakdown(range.from, range.to),
    getPaymentMethodBreakdown(range.from, range.to),
    getCustomerStatistics(range.from, range.to),
  ]);

  const presets = getReportRangePresets();

  const summaryCards = [
    { label: "Orders", value: String(summary.totalOrders) },
    { label: "Paid Orders", value: String(summary.paidOrders) },
    { label: "Revenue", value: formatPrice(summary.revenue) },
    { label: "Avg. Order Value", value: formatPrice(summary.avgOrderValue) },
    { label: "Items Sold", value: String(summary.itemsSold) },
    { label: "Discounts Given", value: formatPrice(summary.discountsGiven) },
  ];

  const maxStatusCount = Math.max(1, ...statusBreakdown.map((s) => s.count));
  const maxPaymentCount = Math.max(1, ...paymentBreakdown.map((p) => p.count));

  const customerCards = [
    { label: "Customers", value: String(customerStats.totalCustomers) },
    { label: "New Customers", value: String(customerStats.newCustomers) },
    { label: "Returning", value: String(customerStats.returningCustomers) },
    { label: "Avg. Orders/Customer", value: customerStats.avgOrdersPerCustomer.toFixed(1) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">{range.label}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <Link
                key={preset.key}
                href={`/admin/reports?range=${preset.key}`}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  preset.key === range.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                )}
              >
                {preset.label}
              </Link>
            ))}
          </div>
          <AutoRefresh />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <RevenueChart data={trend} title={`Revenue — ${range.label.toLowerCase()}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Best-selling products
            </h2>
            {bestSellers.length > 0 ? (
              <div className="flex flex-col divide-y divide-border/60">
                {bestSellers.map((product, index) => (
                  <div
                    key={product.productId ?? product.name}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.quantitySold} sold</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">{formatPrice(product.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No sales in this period.</p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Top customers
            </h2>
            {customerStats.topCustomers.length > 0 ? (
              <div className="flex flex-col divide-y divide-border/60">
                {customerStats.topCustomers.map((customer, index) => (
                  <div
                    key={customer.phone}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/customers/${encodeURIComponent(customer.phone)}`}
                          className="truncate text-sm font-medium text-primary hover:underline"
                        >
                          {customer.fullName}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">{formatPrice(customer.totalSpent)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No customers in this period.</p>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Orders by status
            </h2>
            {statusBreakdown.length > 0 ? (
              <div className="flex flex-col gap-3">
                {statusBreakdown.map((entry) => (
                  <div key={entry.status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-foreground">{STATUS_LABELS[entry.status]}</span>
                      <span className="text-muted-foreground">{entry.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(entry.count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders in this period.</p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Payment methods
            </h2>
            {paymentBreakdown.length > 0 ? (
              <div className="flex flex-col gap-3">
                {paymentBreakdown.map((entry) => (
                  <div key={entry.method}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-foreground uppercase">{entry.method}</span>
                      <span className="text-muted-foreground">{entry.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(entry.count / maxPaymentCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No paid orders in this period.</p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Customer statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {customerCards.map((card) => (
                <div key={card.label}>
                  <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
                  <p className="mt-1 text-xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
