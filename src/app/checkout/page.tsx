"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Truck, Landmark, QrCode, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { cn, formatPrice } from "@/lib/utils";

// Cambodian logistics constants
type DeliveryRegion = "phnom_penh" | "province";

const LOCATION_PHNOM_PENH: DeliveryRegion = "phnom_penh";
const LOCATION_PROVINCE: DeliveryRegion = "province";

// 2. Add an explicit Record type signature to the logistics object
const SHIPPING_METHODS: Record<DeliveryRegion, { id: string; name: string; desc: string; cost: number; }[]> = {
  phnom_penh: [
    { id: "grab", name: "Grab Express", desc: "Instant bike delivery within PP", cost: 2.5 },
    { id: "jnt_pp", name: "J&T Express (Phnom Penh)", desc: "Next day delivery", cost: 1.5 },
  ],
  province: [
    { id: "vet", name: "Vireak Buntham (VET)", desc: "1-2 days to bus station/home", cost: 3.0 },
    { id: "jnt_prov", name: "J&T Express (Province)", desc: "1-3 days to doorstep", cost: 2.5 },
  ],
};

export default function CheckoutPage() {
  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.totalPrice());
  const clearCart = useCart((state) => state.clearCart);

  // Form States
  const [location, setLocation] = useState(LOCATION_PHNOM_PENH);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[LOCATION_PHNOM_PENH][0]);
  const [paymentMethod, setPaymentMethod] = useState("khqr"); // khqr or aba
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  // Handle shifting shipping methods when changing location type
    const handleLocationChange = (loc: DeliveryRegion) => {
    setLocation(loc);
    setSelectedShipping(SHIPPING_METHODS[loc][0]);
    };

  const total = subtotal + selectedShipping.cost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order placement
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsOrdered(true);
      clearCart();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center flex flex-col items-center justify-center">
        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">សូមអរគុណ! Order Placed!</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Your order has been registered. Please send your payment screenshot to our Telegram channel or page inbox to confirm fulfillment.
        </p>
        <Button asChild className="mt-8 w-full">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 text-center">
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <Button asChild className="mt-4"><Link href="/products">Go to Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-10">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-8" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mt-2">Secure Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form Elements */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Customer / Delivery Info */}
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> Delivery Information
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <input required type="text" placeholder="e.g. Sok Chan" className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Phone Number (Telegram)</label>
                <input required type="tel" placeholder="e.g. 092 123 456" className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>

              {/* Destination Sector Toggle */}
              <div className="col-span-2 mt-2">
                <label className="text-xs font-medium text-muted-foreground block mb-2">Delivery Region</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleLocationChange(LOCATION_PHNOM_PENH)} className={cn("p-3 rounded-xl border text-left text-sm font-medium transition-all", location === LOCATION_PHNOM_PENH ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/30")}>
                    Phnom Penh
                  </button>
                  <button type="button" onClick={() => handleLocationChange(LOCATION_PROVINCE)} className={cn("p-3 rounded-xl border text-left text-sm font-medium transition-all", location === LOCATION_PROVINCE ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/30")}>
                    Provinces
                  </button>
                </div>
              </div>

              {/* Dynamic Carriers Mapping */}
              <div className="col-span-2 mt-2">
                <label className="text-xs font-medium text-muted-foreground block mb-2">Select Delivery Company </label>
                <div className="flex flex-col gap-2.5">
                  {SHIPPING_METHODS[location].map((method) => (
                    <div key={method.id} onClick={() => setSelectedShipping(method)} className={cn("flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all", selectedShipping.id === method.id ? "border-primary bg-primary/5" : "border-border/70 hover:bg-muted/20")}>
                      <div>
                        <p className="text-sm font-semibold">{method.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
                      </div>
                      <span className="text-sm font-bold">{formatPrice(method.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Drop-off Address Details </label>
                <textarea required rows={3} placeholder="House number, Street name, Sangkat or Province/District details..." className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
            </div>
          </div>

          {/* Cambodia Payment Engine */}
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" /> Payment Method
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div onClick={() => setPaymentMethod("khqr")} className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer text-center transition-all", paymentMethod === "khqr" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                <QrCode className="h-6 w-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Bakong KHQR</span>
              </div>
              <div onClick={() => setPaymentMethod("aba")} className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer text-center transition-all", paymentMethod === "aba" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:text-foreground")}>
                <Landmark className="h-6 w-6" />
                <span className="text-xs font-bold uppercase tracking-wider">ABA Mobile Bank</span>
              </div>
            </div>

            {/* Static Interactive Gateway Interface Elements */}
            <div className="rounded-xl bg-muted/40 p-4 border border-border/40 flex flex-col items-center text-center">
              {paymentMethod === "khqr" ? (
                <>
                  <div className="bg-white p-3 rounded-xl border mb-3 shadow-sm">
                    {/* Placeholder for standard dynamic KHQR Graphic asset */}
                    <div className="w-40 h-40 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white rounded-lg font-mono font-bold text-lg">
                      KHQR DUMMY
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Scan using Bakong or any Cambodian Banking App to auto-pay <span className="font-semibold text-foreground">{formatPrice(total)}</span>
                  </p>
                </>
              ) : (
                <div className="w-full text-left space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Our Official Bank Account</p>
                  <div className="p-3 bg-background border rounded-lg">
                    <p className="text-sm font-bold text-foreground">ABA Bank (000 123 456)</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Account Name: NOVA COMMERCE CO., LTD.</p>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">
                    Please transfer exactly <span className="font-semibold text-foreground">{formatPrice(total)}</span> into the account above.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full h-12 text-base">
            {isSubmitting ? "Registering order..." : "Confirm & Complete Order"}
          </Button>
          
          <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Direct encrypted verification logic.
          </p>
        </form>

        {/* Sticky Review Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Review Items</h2>
            
            <div className="max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor ?? "default"}`} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted/30 border">
                    <Image src={item.product.thumbnail} alt={item.product.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-sm">
                    <h4 className="font-medium text-foreground line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Via ({selectedShipping.name})</span>
                <span className="text-foreground font-medium">{formatPrice(selectedShipping.cost)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <span className="font-semibold">Total to Pay</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}