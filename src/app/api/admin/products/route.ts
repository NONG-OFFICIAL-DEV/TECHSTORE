import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { toAdminProductDTO } from "@/lib/serializers";
import { validateProductInput } from "@/lib/validation/product";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(toAdminProductDTO));
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateProductInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { id: validated.data.categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { slug: validated.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: validated.data,
    include: { category: true },
  });

  return NextResponse.json(toAdminProductDTO(product), { status: 201 });
}
