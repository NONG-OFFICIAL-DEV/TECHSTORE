import { prisma } from "@/lib/prisma";
import { CustomersTable, type CustomerSummary } from "@/components/admin/customers-table";

export const dynamic = "force-dynamic";

async function getCustomers(): Promise<CustomerSummary[]> {
  // Store-scale data — same "load everything, group in JS" approach as the
  // existing orders/products list pages. No Customer table exists (the
  // storefront is guest-checkout only), so customers are derived by
  // grouping orders on the one required, non-null contact field: phone.
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      customerPhone: true,
      customerFullName: true,
      customerEmail: true,
      total: true,
      createdAt: true,
    },
  });

  const byPhone = new Map<string, CustomerSummary>();
  for (const order of orders) {
    const existing = byPhone.get(order.customerPhone);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += Number(order.total);
    } else {
      byPhone.set(order.customerPhone, {
        phone: order.customerPhone,
        // Orders are already sorted newest-first, so the first one seen
        // per phone number has the most up-to-date name/email.
        fullName: order.customerFullName,
        email: order.customerEmail,
        orderCount: 1,
        totalSpent: Number(order.total),
        lastOrderAt: order.createdAt.toISOString(),
      });
    }
  }

  return Array.from(byPhone.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {customers.length} customer{customers.length === 1 ? "" : "s"}, grouped by phone number.
        </p>
      </div>

      <div className="mt-6">
        <CustomersTable customers={customers} />
      </div>
    </div>
  );
}
