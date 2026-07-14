// `prisma db seed` runs this as its own `tsx` process, separate from
// prisma.config.ts — so env vars need loading here too.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import { categories, products } from "../src/data/products";

// Direct connection, not the pooled one — this is a one-off CLI script,
// same reasoning as migrations (see prisma.config.ts).
const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function seedCategories() {
  const bySlug = new Map<string, string>();

  for (const category of categories) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        nameKey: category.nameKey,
        description: category.description,
        icon: category.icon,
        image: category.image,
      },
      create: {
        slug: category.slug,
        name: category.name,
        nameKey: category.nameKey,
        description: category.description,
        icon: category.icon,
        image: category.image,
      },
    });
    bySlug.set(category.slug, row.id);
  }

  return bySlug;
}

async function seedProducts(categoryIdBySlug: Map<string, string>) {
  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.category);
    if (!categoryId) {
      throw new Error(
        `Product "${product.slug}" references unknown category "${product.category}"`
      );
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        brand: product.brand,
        categoryId,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        currency: product.currency,
        rating: product.rating,
        reviewCount: product.reviewCount,
        images: product.images,
        thumbnail: product.thumbnail,
        description: product.description,
        shortDescription: product.shortDescription,
        specs: product.specs,
        features: product.features,
        colors: product.colors ?? undefined,
        inStock: product.inStock,
        stockCount: product.stockCount ?? null,
        isNew: product.isNew ?? false,
        isFeatured: product.isFeatured ?? false,
        discountPercent: product.discountPercent ?? null,
        tags: product.tags,
      },
      create: {
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        categoryId,
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? null,
        currency: product.currency,
        rating: product.rating,
        reviewCount: product.reviewCount,
        images: product.images,
        thumbnail: product.thumbnail,
        description: product.description,
        shortDescription: product.shortDescription,
        specs: product.specs,
        features: product.features,
        colors: product.colors ?? undefined,
        inStock: product.inStock,
        stockCount: product.stockCount ?? null,
        isNew: product.isNew ?? false,
        isFeatured: product.isFeatured ?? false,
        discountPercent: product.discountPercent ?? null,
        tags: product.tags,
      },
    });
  }
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "Skipping admin user seed: set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create one."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Admin" },
  });
}

async function main() {
  const categoryIdBySlug = await seedCategories();
  await seedProducts(categoryIdBySlug);
  await seedAdminUser();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
