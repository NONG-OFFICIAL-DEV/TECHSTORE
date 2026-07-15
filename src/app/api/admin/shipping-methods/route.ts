import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { toShippingMethodDTO } from "@/lib/serializers";
import { validateShippingMethodInput } from "@/lib/validation/shipping-method";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const methods = await prisma.shippingMethod.findMany({
    orderBy: [{ region: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json(methods.map(toShippingMethodDTO));
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateShippingMethodInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const method = await prisma.shippingMethod.create({ data: validated.data });

  return NextResponse.json(toShippingMethodDTO(method), { status: 201 });
}
