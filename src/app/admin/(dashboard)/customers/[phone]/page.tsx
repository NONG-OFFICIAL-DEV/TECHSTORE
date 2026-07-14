import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrdersTable } from "@/components/admin/orders-table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

interface CustomerDetailPageProps {
  params: Promise<{ phone: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { phone: encodedPhone } = await params;
  const phone = decodeURIComponent(encodedPhone);

  const rows = await prisma.order.findMany({
    where: { customerPhone: phone },
    orderBy: { createdAt: "desc" },
  });
  if (rows.length === 0) notFound();

  const orders = rows.map((order) => ({
    ...order,
    shippingCost: Number(order.shippingCost),
    subtotal: Number(order.subtotal),
    total: Number(order.total),
    discountAmount: Number(order.discountAmount),
  }));

  const fullName = orders[0].customerFullName;
  const email = orders[0].customerEmail;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/customers">Customers</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{fullName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-3 text-xl font-semibold">{fullName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {phone}
        {email ? ` · ${email}` : ""} · {orders.length} order{orders.length === 1 ? "" : "s"} ·{" "}
        {formatPrice(totalSpent)} lifetime
      </p>

      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
