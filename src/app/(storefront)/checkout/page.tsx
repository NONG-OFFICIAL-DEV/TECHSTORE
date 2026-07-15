import { getActiveShippingMethodsByRegionSafe } from "@/lib/data/shipping-methods";
import { CheckoutContent } from "./checkout-content";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const shippingMethods = await getActiveShippingMethodsByRegionSafe();

  return <CheckoutContent shippingMethods={shippingMethods} />;
}
