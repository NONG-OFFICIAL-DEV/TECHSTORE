import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toAdminOrderDTO } from "@/lib/serializers";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { AutoRefresh } from "@/components/admin/auto-refresh";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const dto = toAdminOrderDTO(order);

  return (
    <div className="max-w-4xl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/orders">Orders</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{dto.orderNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Order detail</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed{" "}
            {new Date(dto.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <AutoRefresh />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Items
            </h2>
            <div className="flex flex-col gap-3">
              {dto.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty {item.quantity}
                      {item.selectedColor ? ` · ${item.selectedColor}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-border/60 pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">{formatPrice(dto.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping ({dto.shipping.method})</span>
                <span className="text-foreground">{formatPrice(dto.shipping.cost)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(dto.total)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Delivery
            </h2>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Region</dt>
              <dd className="text-right font-medium">
                {dto.delivery.region === "PHNOM_PENH" ? "Phnom Penh" : "Province"}
              </dd>

              {dto.delivery.province && (
                <>
                  <dt className="text-muted-foreground">Province</dt>
                  <dd className="text-right font-medium">{dto.delivery.province}</dd>
                </>
              )}
              {dto.delivery.district && (
                <>
                  <dt className="text-muted-foreground">District</dt>
                  <dd className="text-right font-medium">{dto.delivery.district}</dd>
                </>
              )}

              <dt className="text-muted-foreground">Address notes</dt>
              <dd className="text-right font-medium break-words">{dto.delivery.address || "—"}</dd>

              {dto.delivery.lat && dto.delivery.lng && (
                <>
                  <dt className="text-muted-foreground">Pinned location</dt>
                  <dd className="text-right">
                    <a
                      href={`https://www.google.com/maps?q=${dto.delivery.lat},${dto.delivery.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      View on map
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </h2>
            <OrderStatusSelect orderId={dto.id} status={dto.status} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{dto.customer.fullName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{dto.customer.phone}</dd>
              </div>
              {dto.customer.email && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{dto.customer.email}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Payment
            </h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Method</dt>
                <dd className="font-medium uppercase">{dto.paymentMethod}</dd>
              </div>
              {dto.paidAt && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Paid at</dt>
                  <dd className="font-medium">
                    {new Date(dto.paidAt).toLocaleString("en-US", { dateStyle: "medium" })}
                  </dd>
                </div>
              )}
              {dto.stripeSessionId && (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Stripe session</dt>
                  <dd className="truncate font-mono text-xs">{dto.stripeSessionId}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
