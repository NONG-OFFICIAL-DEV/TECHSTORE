import { NextRequest, NextResponse } from "next/server";
import { appendJsonRecord } from "@/lib/json-store";
import type { Order } from "@/types/order";

const ORDERS_FILE = "orders.json";

function generateOrderNumber() {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `NV-${random}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (
    !body?.customer?.fullName?.trim() ||
    !body?.customer?.phone?.trim() ||
    !Array.isArray(body?.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json(
      { error: "Missing required order fields." },
      { status: 400 }
    );
  }

  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    customer: body.customer,
    delivery: body.delivery,
    shipping: body.shipping,
    paymentMethod: body.paymentMethod,
    items: body.items,
    subtotal: body.subtotal,
    total: body.total,
  };

  await appendJsonRecord<Order>(ORDERS_FILE, order);

  return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
}
