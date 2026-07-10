export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

export interface OrderDelivery {
  region: "phnom_penh" | "province";
  address: string;
  province?: string;
  district?: string;
  coords?: { lat: number; lng: number } | null;
}

export interface OrderShipping {
  method: string;
  cost: number;
}

export type OrderStatus = "pending_payment";

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customer: { fullName: string; phone: string };
  delivery: OrderDelivery;
  shipping: OrderShipping;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
}
