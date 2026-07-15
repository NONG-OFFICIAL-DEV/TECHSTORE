import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { toShippingMethodDTO } from "@/lib/serializers";
import { validateShippingMethodInput } from "@/lib/validation/shipping-method";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const method = await prisma.shippingMethod.findUnique({ where: { id } });
  if (!method) {
    return NextResponse.json({ error: "Shipping method not found." }, { status: 404 });
  }

  return NextResponse.json(toShippingMethodDTO(method));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const validated = validateShippingMethodInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const method = await prisma.shippingMethod.update({
      where: { id },
      data: validated.data,
    });
    return NextResponse.json(toShippingMethodDTO(method));
  } catch {
    return NextResponse.json({ error: "Shipping method not found." }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.shippingMethod.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Shipping method not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
