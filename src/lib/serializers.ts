import type {
  Category as CategoryModel,
  Product as ProductModel,
  Order as OrderModel,
  OrderItem as OrderItemModel,
} from "../../generated/prisma/client";
import type { Category, Product } from "@/types/product";

export type ProductWithCategory = ProductModel & { category: CategoryModel };
export type CategoryWithCount = CategoryModel & { _count: { products: number } };
export type OrderWithItems = OrderModel & { items: OrderItemModel[] };

/** Prisma's Decimal (and null) -> the plain numbers the frontend types expect. */
function toNumber(value: unknown): number {
  return value === null || value === undefined ? 0 : Number(value);
}

export function toProductDTO(product: ProductWithCategory): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category.slug,
    price: toNumber(product.price),
    compareAtPrice: product.compareAtPrice ? toNumber(product.compareAtPrice) : undefined,
    currency: product.currency,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images: product.images,
    thumbnail: product.thumbnail,
    description: product.description,
    shortDescription: product.shortDescription,
    specs: product.specs as Record<string, string>,
    features: product.features,
    colors: (product.colors as { name: string; hex: string }[] | null) ?? undefined,
    inStock: product.inStock,
    stockCount: product.stockCount ?? undefined,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    discountPercent: product.discountPercent ?? undefined,
    tags: product.tags,
  };
}

export interface AdminProduct extends Omit<Product, "category"> {
  categoryId: string;
  category: { id: string; slug: string; name: string };
}

/** Like toProductDTO, but keeps categoryId/category as an object — the admin
 * edit form needs to populate a category <select>, not just display a slug. */
export function toAdminProductDTO(product: ProductWithCategory): AdminProduct {
  const { category: categorySlug, ...dto } = toProductDTO(product);
  void categorySlug;
  return {
    ...dto,
    categoryId: product.categoryId,
    category: {
      id: product.category.id,
      slug: product.category.slug,
      name: product.category.name,
    },
  };
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderModel["status"];
  customer: { fullName: string; phone: string; email: string | null };
  delivery: {
    region: OrderModel["deliveryRegion"];
    address: string;
    province: string | null;
    district: string | null;
    lat: number | null;
    lng: number | null;
  };
  shipping: { method: string; cost: number };
  paymentMethod: string;
  subtotal: number;
  total: number;
  currency: string;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
  createdAt: string;
  items: {
    id: string;
    productId: string | null;
    name: string;
    price: number;
    quantity: number;
    selectedColor: string | null;
  }[];
}

export function toAdminOrderDTO(order: OrderWithItems): AdminOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    customer: {
      fullName: order.customerFullName,
      phone: order.customerPhone,
      email: order.customerEmail,
    },
    delivery: {
      region: order.deliveryRegion,
      address: order.deliveryAddress,
      province: order.deliveryProvince,
      district: order.deliveryDistrict,
      lat: order.deliveryLat,
      lng: order.deliveryLng,
    },
    shipping: { method: order.shippingMethod, cost: toNumber(order.shippingCost) },
    paymentMethod: order.paymentMethod,
    subtotal: toNumber(order.subtotal),
    total: toNumber(order.total),
    currency: order.currency,
    stripeSessionId: order.stripeSessionId,
    stripePaymentIntentId: order.stripePaymentIntentId,
    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: toNumber(item.price),
      quantity: item.quantity,
      selectedColor: item.selectedColor,
    })),
  };
}

export function toCategoryDTO(category: CategoryWithCount): Category {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    nameKey: category.nameKey,
    description: category.description,
    icon: category.icon,
    productCount: category._count.products,
    image: category.image,
  };
}
