import Link from "next/link";
import { ShippingMethodForm } from "@/components/admin/shipping-method-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function NewShippingMethodPage() {
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
            <BreadcrumbPage>New shipping method</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-3 text-xl font-semibold">New shipping method</h1>
      <p className="mt-1 text-sm text-muted-foreground">Add a new courier option for checkout.</p>

      <div className="mt-6 max-w-2xl">
        <ShippingMethodForm />
      </div>
    </div>
  );
}
