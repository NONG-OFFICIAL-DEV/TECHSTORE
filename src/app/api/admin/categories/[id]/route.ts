import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { prisma, Prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/lib/serializers";
import { validateCategoryInput } from "@/lib/validation/category";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  return NextResponse.json(toCategoryDTO(category));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const validated = validateCategoryInput(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const conflict = await prisma.category.findFirst({
    where: { slug: validated.data.slug, NOT: { id } },
  });
  if (conflict) {
    return NextResponse.json({ error: "A category with this slug already exists." }, { status: 409 });
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: validated.data,
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(toCategoryDTO(category));
  } catch {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Can't delete a category that still has products in it. Move or delete those products first." },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Category not found." }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
