export interface CouponInput {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
  expiresAt?: string | null;
  minSubtotal?: number | null;
  maxRedemptions?: number | null;
}

export function validateCouponInput(
  body: unknown
): { data: CouponInput } | { error: string } {
  const b = body as Partial<CouponInput> | null;
  if (!b || typeof b !== "object") return { error: "Invalid request body." };

  if (!b.code?.trim()) return { error: "Code is required." };
  if (b.type !== "PERCENT" && b.type !== "FIXED") {
    return { error: "Type must be either PERCENT or FIXED." };
  }
  if (typeof b.value !== "number" || b.value <= 0) {
    return { error: "Value must be a positive number." };
  }
  if (b.type === "PERCENT" && b.value > 100) {
    return { error: "A percentage discount can't exceed 100." };
  }
  if (typeof b.active !== "boolean") return { error: "active must be a boolean." };
  if (b.expiresAt && Number.isNaN(Date.parse(b.expiresAt))) {
    return { error: "Expiry date is invalid." };
  }
  if (b.minSubtotal != null && (typeof b.minSubtotal !== "number" || b.minSubtotal < 0)) {
    return { error: "Minimum order amount must be a positive number." };
  }
  if (
    b.maxRedemptions != null &&
    (typeof b.maxRedemptions !== "number" || !Number.isInteger(b.maxRedemptions) || b.maxRedemptions < 1)
  ) {
    return { error: "Max redemptions must be a whole number of at least 1." };
  }

  return {
    data: {
      code: b.code.trim().toUpperCase(),
      type: b.type,
      value: b.value,
      active: b.active,
      expiresAt: b.expiresAt || null,
      minSubtotal: b.minSubtotal ?? null,
      maxRedemptions: b.maxRedemptions ?? null,
    },
  };
}

interface RedeemableCoupon {
  active: boolean;
  expiresAt: Date | null;
  minSubtotal: unknown;
  maxRedemptions: number | null;
  timesRedeemed: number;
}

/** Returns null if the coupon can be applied to this subtotal, else a user-facing reason. */
export function getCouponRedemptionError(
  coupon: RedeemableCoupon,
  subtotal: number
): string | null {
  if (!coupon.active) return "This coupon is no longer active.";
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return "This coupon has expired.";
  }
  if (coupon.minSubtotal != null && subtotal < Number(coupon.minSubtotal)) {
    return "Your order doesn't meet this coupon's minimum amount.";
  }
  if (coupon.maxRedemptions != null && coupon.timesRedeemed >= coupon.maxRedemptions) {
    return "This coupon has reached its redemption limit.";
  }
  return null;
}

/** Discount amount for a subtotal, clamped so it never exceeds the subtotal itself. */
export function computeCouponDiscount(
  coupon: { type: "PERCENT" | "FIXED"; value: unknown },
  subtotal: number
): number {
  const value = Number(coupon.value);
  const raw = coupon.type === "PERCENT" ? (subtotal * value) / 100 : value;
  return Math.min(Math.max(raw, 0), subtotal);
}
