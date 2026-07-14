import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/orders-table";
import { AutoRefresh } from "@/components/admin/auto-refresh";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // Prisma's Decimal fields can't cross the Server -> Client Component
  // boundary as-is — convert to plain numbers before handing off to the
  // (client) table.
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  const orders = rows.map((order) => ({
    ...order,
    shippingCost: Number(order.shippingCost),
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    discountAmount: Number(order.discountAmount),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {orders.length} order{orders.length === 1 ? "" : "s"}.
          </p>
        </div>
        <AutoRefresh />
      </div>

      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
