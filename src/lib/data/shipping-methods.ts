import { prisma } from "@/lib/prisma";
import { toShippingMethodDTO } from "@/lib/serializers";

/** Active shipping methods, grouped by delivery region, ordered for checkout display. */
export async function getActiveShippingMethodsByRegion() {
  const methods = await prisma.shippingMethod.findMany({
    where: { isActive: true },
    orderBy: [{ region: "asc" }, { sortOrder: "asc" }],
  });

  const dtos = methods.map(toShippingMethodDTO);

  return {
    PHNOM_PENH: dtos.filter((m) => m.region === "PHNOM_PENH"),
    PROVINCE: dtos.filter((m) => m.region === "PROVINCE"),
  };
}

/** Same as above, but never throws — checkout should degrade to "no couriers
 * available right now" instead of crashing the whole page on a DB hiccup. */
export async function getActiveShippingMethodsByRegionSafe() {
  return getActiveShippingMethodsByRegion().catch((error) => {
    console.error("Failed to load shipping methods:", error);
    return { PHNOM_PENH: [], PROVINCE: [] };
  });
}
