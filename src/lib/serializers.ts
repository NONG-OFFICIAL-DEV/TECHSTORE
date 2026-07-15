import type {
  Category as CategoryModel,
  Product as ProductModel,
  Order as OrderModel,
  OrderItem as OrderItemModel,
  Coupon as CouponModel,
  ShippingMethod as ShippingMethodModel,
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
  couponCode: string | null;
  discountAmount: number;
  trackingNumber: string | null;
  carrier: string | null;
  shippedAt: string | null;
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
    couponCode: order.couponCode,
    discountAmount: toNumber(order.discountAmount),
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    shippedAt: order.shippedAt ? order.shippedAt.toISOString() : null,
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

export interface CouponDTO {
  id: string;
  code: string;
  type: CouponModel["type"];
  value: number;
  active: boolean;
  expiresAt: string | null;
  minSubtotal: number | null;
  maxRedemptions: number | null;
  timesRedeemed: number;
  createdAt: string;
}

export function toCouponDTO(coupon: CouponModel): CouponDTO {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: toNumber(coupon.value),
    active: coupon.active,
    expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString() : null,
    minSubtotal: coupon.minSubtotal != null ? toNumber(coupon.minSubtotal) : null,
    maxRedemptions: coupon.maxRedemptions,
    timesRedeemed: coupon.timesRedeemed,
    createdAt: coupon.createdAt.toISOString(),
  };
}

export interface ShippingMethodDTO {
  id: string;
  name: string;
  description: string;
  region: ShippingMethodModel["region"];
  cost: number;
  isActive: boolean;
  sortOrder: number;
}

export function toShippingMethodDTO(method: ShippingMethodModel): ShippingMethodDTO {
  return {
    id: method.id,
    name: method.name,
    description: method.description,
    region: method.region,
    cost: toNumber(method.cost),
    isActive: method.isActive,
    sortOrder: method.sortOrder,
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
