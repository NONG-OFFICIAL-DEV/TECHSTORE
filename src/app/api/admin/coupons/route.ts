import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { toCouponDTO } from "@/lib/serializers";
import { validateCouponInput } from "@/lib/validation/coupon";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(coupons.map(toCouponDTO));
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateCouponInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code: validated.data.code } });
  if (existing) {
    return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: validated.data.code,
      type: validated.data.type,
      value: validated.data.value,
      active: validated.data.active,
      expiresAt: validated.data.expiresAt ? new Date(validated.data.expiresAt) : null,
      minSubtotal: validated.data.minSubtotal,
      maxRedemptions: validated.data.maxRedemptions,
    },
  });

  return NextResponse.json(toCouponDTO(coupon), { status: 201 });
}
