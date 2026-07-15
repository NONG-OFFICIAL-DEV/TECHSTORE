import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toShippingMethodDTO } from "@/lib/serializers";
import { ShippingMethodsTable } from "@/components/admin/shipping-methods-table";

export const dynamic = "force-dynamic";

export default async function AdminShippingMethodsPage() {
  const methods = await prisma.shippingMethod.findMany({
    orderBy: [{ region: "asc" }, { sortOrder: "asc" }],
  });
  const dtos = methods.map(toShippingMethodDTO);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Shipping methods</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dtos.length} method{dtos.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Link
          href="/admin/shipping-methods/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New shipping method
        </Link>
      </div>

      <div className="mt-6">
        <ShippingMethodsTable methods={dtos} />
      </div>
    </div>
  );
}
