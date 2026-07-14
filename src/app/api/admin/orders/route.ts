import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { toAdminOrderDTO } from "@/lib/serializers";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders.map(toAdminOrderDTO));
}
