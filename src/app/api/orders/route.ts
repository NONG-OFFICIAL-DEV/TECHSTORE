import { NextRequest, NextResponse } from "next/server";
import { prisma, DeliveryRegion } from "@/lib/prisma";
import { computeCouponDiscount, getCouponRedemptionError } from "@/lib/validation/coupon";

function generateOrderNumber() {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `NV-${random}`;
}

interface OrderItemInput {
  productSlug?: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const fullName: string | undefined = body?.customer?.fullName?.trim();
  const phone: string | undefined = body?.customer?.phone?.trim();
  const items: OrderItemInput[] | undefined = body?.items;

  if (!fullName || !phone || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Missing required order fields." },
      { status: 400 }
    );
  }

  // The cart's product ids come from the static storefront catalog, which
  // don't match real Product rows in the DB — resolve real ids via slug so
  // OrderItem.productId links to an actual product wherever possible.
  const slugs = items
    .map((item) => item.productSlug)
    .filter((slug): slug is string => Boolean(slug));
  const products = slugs.length
    ? await prisma.product.findMany({ where: { slug: { in: slugs } } })
    : [];
  const productIdBySlug = new Map(products.map((p) => [p.slug, p.id]));

  const region: DeliveryRegion =
    body.delivery?.region === "province" ? "PROVINCE" : "PHNOM_PENH";

  const subtotal: number = body.subtotal ?? 0;
  const shippingCost: number = body.shipping?.cost ?? 0;

  // The discount is never trusted from the client — re-derive it here from
  // the coupon's own rules so a tampered client-side amount can't apply.
  const couponCode: string | undefined = body.couponCode?.trim().toUpperCase();
  let discountAmount = 0;
  let coupon: Awaited<ReturnType<typeof prisma.coupon.findUnique>> = null;

  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
    }
    const redemptionError = getCouponRedemptionError(coupon, subtotal);
    if (redemptionError) {
      return NextResponse.json({ error: redemptionError }, { status: 400 });
    }
    discountAmount = computeCouponDiscount(coupon, subtotal);
  }

  const total = subtotal + shippingCost - discountAmount;

  const order = await prisma.$transaction(async (tx) => {
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { timesRedeemed: { increment: 1 } },
      });
    }

    return tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerFullName: fullName,
        customerPhone: phone,
        deliveryRegion: region,
        deliveryAddress: body.delivery?.address ?? "",
        deliveryProvince: body.delivery?.province ?? null,
        deliveryDistrict: body.delivery?.district ?? null,
        deliveryLat: body.delivery?.coords?.lat ?? null,
        deliveryLng: body.delivery?.coords?.lng ?? null,
        shippingMethod: body.shipping?.method ?? "",
        shippingCost,
        paymentMethod: body.paymentMethod ?? "",
        subtotal,
        total,
        couponCode: coupon ? coupon.code : null,
        discountAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productSlug ? productIdBySlug.get(item.productSlug) ?? null : null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedColor: item.selectedColor,
          })),
        },
      },
    });
  });

  return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
}
