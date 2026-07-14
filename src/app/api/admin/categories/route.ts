import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/lib/serializers";
import { validateCategoryInput } from "@/lib/validation/category";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories.map(toCategoryDTO));
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const validated = validateCategoryInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug: validated.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A category with this slug already exists." }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: validated.data,
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json(toCategoryDTO(category), { status: 201 });
}
