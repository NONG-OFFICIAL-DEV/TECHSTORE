import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCouponDTO } from "@/lib/serializers";
import { CouponsTable } from "@/components/admin/coupons-table";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  const dtos = coupons.map(toCouponDTO);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {dtos.length} coupon{dtos.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New coupon
        </Link>
      </div>

      <div className="mt-6">
        <CouponsTable coupons={dtos} />
      </div>
    </div>
  );
}
