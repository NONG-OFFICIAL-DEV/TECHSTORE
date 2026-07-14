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

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { items: true },
    });
    return NextResponse.json(toAdminOrderDTO(order));
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
