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

// Matches the couriers that used to be hardcoded in checkout/page.tsx.
// No unique constraint on [name, region] in the DB, so this finds-then-
// writes instead of using Prisma's upsert (which needs one).
const DEFAULT_SHIPPING_METHODS = [
  {
    name: "Grab Express",
    description: "Instant bike delivery within PP",
    region: "PHNOM_PENH" as const,
    cost: 2.5,
    sortOrder: 0,
  },
  {
    name: "J&T Express (Phnom Penh)",
    description: "Next day delivery",
    region: "PHNOM_PENH" as const,
    cost: 1.5,
    sortOrder: 1,
  },
  {
    name: "Vireak Buntham (VET)",
    description: "1-2 days to bus station/home",
    region: "PROVINCE" as const,
    cost: 3.0,
    sortOrder: 0,
  },
  {
    name: "J&T Express (Province)",
    description: "1-3 days to doorstep",
    region: "PROVINCE" as const,
    cost: 2.5,
    sortOrder: 1,
  },
];

async function seedShippingMethods() {
  for (const method of DEFAULT_SHIPPING_METHODS) {
    const existing = await prisma.shippingMethod.findFirst({
      where: { name: method.name, region: method.region },
    });

    if (existing) {
      await prisma.shippingMethod.update({
        where: { id: existing.id },
        data: method,
      });
    } else {
      await prisma.shippingMethod.create({ data: method });
    }
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
  await seedShippingMethods();
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
