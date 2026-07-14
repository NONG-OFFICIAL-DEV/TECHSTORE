import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma, Prisma } from "@/lib/prisma";
import { toCouponDTO } from "@/lib/serializers";
import { validateCouponInput } from "@/lib/validation/coupon";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
  }

  return NextResponse.json(toCouponDTO(coupon));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const validated = validateCouponInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const conflict = await prisma.coupon.findFirst({
    where: { code: validated.data.code, NOT: { id } },
  });
  if (conflict) {
    return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
  }

  try {
    const coupon = await prisma.coupon.update({
      where: { id },
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
    return NextResponse.json(toCouponDTO(coupon));
  } catch {
    return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.coupon.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Coupon not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete coupon." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
