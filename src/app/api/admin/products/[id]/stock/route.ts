import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const stockCount = (body as { stockCount?: unknown } | null)?.stockCount;

  if (typeof stockCount !== "number" || !Number.isInteger(stockCount) || stockCount < 0) {
    return NextResponse.json(
      { error: "Stock count must be a non-negative whole number." },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { stockCount, inStock: stockCount > 0 },
    });
    return NextResponse.json({ stockCount: product.stockCount, inStock: product.inStock });
  } catch {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}
