import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma, OrderStatus } from "@/lib/prisma";
import { toAdminOrderDTO } from "@/lib/serializers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json(toAdminOrderDTO(order));
}

const VALID_STATUSES = new Set<string>(Object.values(OrderStatus));

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (typeof status !== "string" || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  // Tracking fields are only touched when the caller actually sends them —
  // OrderStatusSelect PATCHes with just {status}, and must not wipe out
  // tracking info that was set separately via the tracking form.
  const data: { status: OrderStatus; trackingNumber?: string | null; carrier?: string | null; shippedAt?: Date | null } = {
    status: status as OrderStatus,
  };
  if ("trackingNumber" in body) {
    data.trackingNumber = typeof body.trackingNumber === "string" ? body.trackingNumber.trim() || null : null;
  }
  if ("carrier" in body) {
    data.carrier = typeof body.carrier === "string" ? body.carrier.trim() || null : null;
  }
  if ("shippedAt" in body) {
    data.shippedAt = body.shippedAt ? new Date(body.shippedAt) : null;
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });
    return NextResponse.json(toAdminOrderDTO(order));
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
