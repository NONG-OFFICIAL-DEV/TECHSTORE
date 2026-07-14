import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeCouponDiscount, getCouponRedemptionError } from "@/lib/validation/coupon";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const code: string | undefined = body?.code?.trim().toUpperCase();
  const subtotal: number = body?.subtotal ?? 0;

  if (!code) {
    return NextResponse.json({ valid: false, error: "Enter a coupon code." }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) {
    return NextResponse.json({ valid: false, error: "Invalid coupon code." }, { status: 404 });
  }

  const redemptionError = getCouponRedemptionError(coupon, subtotal);
  if (redemptionError) {
    return NextResponse.json({ valid: false, error: redemptionError }, { status: 400 });
  }

  const discountAmount = computeCouponDiscount(coupon, subtotal);
  return NextResponse.json({ valid: true, code: coupon.code, discountAmount });
}
