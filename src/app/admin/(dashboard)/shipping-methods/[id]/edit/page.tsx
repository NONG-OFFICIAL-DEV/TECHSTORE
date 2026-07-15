import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toShippingMethodDTO } from "@/lib/serializers";
import { ShippingMethodForm } from "@/components/admin/shipping-method-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const dynamic = "force-dynamic";

interface EditShippingMethodPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditShippingMethodPage({ params }: EditShippingMethodPageProps) {
  const { id } = await params;

  const method = await prisma.shippingMethod.findUnique({ where: { id } });
  if (!method) notFound();

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/shipping-methods">Shipping methods</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{method.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-3 text-xl font-semibold">Edit shipping method</h1>

      <div className="mt-6 max-w-2xl">
        <ShippingMethodForm method={toShippingMethodDTO(method)} />
      </div>
    </div>
  );
}
