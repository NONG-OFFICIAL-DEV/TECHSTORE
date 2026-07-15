import type { DeliveryRegion } from "@/lib/prisma";

export interface ShippingMethodInput {
  name: string;
  description: string;
  region: DeliveryRegion;
  cost: number;
  isActive: boolean;
  sortOrder: number;
}

const VALID_REGIONS = new Set(["PHNOM_PENH", "PROVINCE"]);

export function validateShippingMethodInput(
  body: unknown
): { data: ShippingMethodInput } | { error: string } {
  const b = body as Partial<ShippingMethodInput> | null;
  if (!b || typeof b !== "object") return { error: "Invalid request body." };

  if (!b.name?.trim()) return { error: "Name is required." };
  if (!b.description?.trim()) return { error: "Description is required." };
  if (typeof b.region !== "string" || !VALID_REGIONS.has(b.region)) {
    return { error: "Region must be Phnom Penh or Province." };
  }
  if (typeof b.cost !== "number" || b.cost < 0) {
    return { error: "Cost must be a positive number." };
  }
  if (typeof b.isActive !== "boolean") return { error: "isActive must be a boolean." };

  return {
    data: {
      name: b.name.trim(),
      description: b.description.trim(),
      region: b.region as DeliveryRegion,
      cost: b.cost,
      isActive: b.isActive,
      sortOrder: typeof b.sortOrder === "number" ? b.sortOrder : 0,
    },
  };
}
