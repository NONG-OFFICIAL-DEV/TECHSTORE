"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  Landmark,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { LocationLinkInput } from "@/components/checkout/location-link-input";
import { cn, formatPrice } from "@/lib/utils";

// ------------------------------------------------------------------
// Cambodian logistics constants
// ------------------------------------------------------------------
type DeliveryRegion = "phnom_penh" | "province";

const LOCATION_PHNOM_PENH: DeliveryRegion = "phnom_penh";
const LOCATION_PROVINCE: DeliveryRegion = "province";

const SHIPPING_METHODS: Record<
  DeliveryRegion,
  { id: string; name: string; desc: string; cost: number }[]
> = {
  phnom_penh: [
    { id: "grab", name: "Grab Express", desc: "Instant bike delivery within PP", cost: 2.5 },
    { id: "jnt_pp", name: "J&T Express (Phnom Penh)", desc: "Next day delivery", cost: 1.5 },
  ],
  province: [
    { id: "vet", name: "Vireak Buntham (VET)", desc: "1-2 days to bus station/home", cost: 3.0 },
    { id: "jnt_prov", name: "J&T Express (Province)", desc: "1-3 days to doorstep", cost: 2.5 },
  ],
};

// Provinces with districts that have delivery coverage — user picks
// province, then district, then the courier serving that district.
const PROVINCES: { province: string; districts: string[] }[] = [
  { province: "Siem Reap", districts: ["Krong Siem Reap", "Angkor Thom", "Banteay Srei", "Puok"] },
  { province: "Battambang", districts: ["Krong Battambang", "Bavel", "Thma Koul"] },
  { province: "Kampong Cham", districts: ["Krong Kampong Cham", "Batheay", "Chamkar Leu"] },
  { province: "Kampot", districts: ["Krong Kampot", "Angkor Chey", "Chum Kiri"] },
  { province: "Preah Sihanouk (Sihanoukville)", districts: ["Krong Preah Sihanouk", "Prey Nob", "Stueng Hav"] },
  { province: "Kandal", districts: ["Ta Khmau", "Kien Svay", "Lvea Aem"] },
  { province: "Takeo", districts: ["Krong Doun Kaev", "Bati", "Tram Kak"] },
  { province: "Kampong Speu", districts: ["Krong Chbar Mon", "Basedth", "Odongk"] },
];

// ------------------------------------------------------------------
// Step indicator
// ------------------------------------------------------------------
const STEPS = [
  { id: 1, label: "Delivery" },
  { id: 2, label: "Review & Payment" },
] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center w-full mb-10" aria-label="Checkout progress">
      {STEPS.map((step, i) => {
        const isDone = current > step.id;
        const isActive = current === step.id;
        return (
          <li key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isDone && "bg-primary border-primary text-primary-foreground",
                  isActive && !isDone && "border-primary text-primary",
                  !isActive && !isDone && "border-border text-muted-foreground"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:inline",
                  isActive || isDone ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 h-px flex-1 transition-colors",
                  isDone ? "bg-primary" : "bg-border"
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
};

// Reusable, responsive inline error banner.
function StepErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span className="break-words leading-relaxed">{message}</span>
    </div>
  );
}

export default function CheckoutPage() {
  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.totalPrice());
  const clearCart = useCart((state) => state.clearCart);

  // Step control
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Customer info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Delivery region
  const [location, setLocation] = useState<DeliveryRegion>(LOCATION_PHNOM_PENH);

  // Phnom Penh: location pasted in via a Google Maps share link
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Province: cascading province -> district -> courier
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Shared free-text address (directions, house number, landmark, etc.)
  const [address, setAddress] = useState("");

  // Shipping & payment
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[LOCATION_PHNOM_PENH][0]);
  const [paymentMethod, setPaymentMethod] = useState("khqr");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const handleLocationChange = (loc: DeliveryRegion) => {
    setLocation(loc);
    setSelectedShipping(SHIPPING_METHODS[loc][0]);
    setSelectedProvince("");
    setSelectedDistrict("");
    setStepError(null);
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict("");
    setStepError(null);
  };

  const total = subtotal + selectedShipping.cost;

  const goToStep = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStepError(null);
    setStep(next);
  };

  const handleNextFromDelivery = () => {
    if (!fullName.trim() || !phone.trim()) {
      setStepError("Please enter your name and phone number.");
      return;
    }
    if (location === "phnom_penh" && !coords && !address.trim()) {
      setStepError("Paste your Google Maps link or type your address so the rider can find you.");
      return;
    }
    if (location === "province" && !selectedProvince) {
      setStepError("Please select your province.");
      return;
    }
    if (location === "province" && !selectedDistrict) {
      setStepError("Please select your district so we can match you with a courier.");
      return;
    }
    goToStep(2);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 2) return; // only the final Review & Payment step actually submits
    setIsSubmitting(true);
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
        <Button asChild className="mt-4">
          <Link href="/products">Go to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 py-5">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-8" />

      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight mt-2">Secure Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 flex flex-col gap-6">
          <StepIndicator current={step} />

          <AnimatePresence mode="wait" custom={direction}>
            {/* ---------------- STEP 1: DELIVERY ---------------- */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" /> Delivery Information
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        type="text"
                        placeholder="e.g. Sok Chan"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">Phone Number (Telegram)</label>
                      <input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        placeholder="e.g. 092 123 456"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Destination Sector Toggle */}
                    <div className="col-span-2 mt-2">
                      <label className="text-xs font-medium text-muted-foreground block mb-2">Delivery Region</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleLocationChange(LOCATION_PHNOM_PENH)}
                          className={cn(
                            "p-3 rounded-xl border text-left text-sm font-medium transition-all",
                            location === LOCATION_PHNOM_PENH
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:bg-muted/30"
                          )}
                        >
                          Phnom Penh
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLocationChange(LOCATION_PROVINCE)}
                          className={cn(
                            "p-3 rounded-xl border text-left text-sm font-medium transition-all",
                            location === LOCATION_PROVINCE
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:bg-muted/30"
                          )}
                        >
                          Provinces
                        </button>
                      </div>
                    </div>

                    {/* Phnom Penh: paste a Google Maps share link */}
                    {location === LOCATION_PHNOM_PENH && (
                      <div className="col-span-2 mt-2">
                        <label className="text-xs font-medium text-muted-foreground block mb-2">
                          Share Your Location
                        </label>
                        <LocationLinkInput value={coords} onChange={setCoords} />
                        <p className="mt-2 text-xs text-muted-foreground">
                          {coords
                            ? "Rider will navigate directly to this pin. You can still add landmark notes below."
                            : "Fastest way for Grab/J&T riders to find you — or type your address below instead."}
                        </p>
                      </div>
                    )}

                    {/* Province: cascading province -> district */}
                    {location === LOCATION_PROVINCE && (
                      <div className="col-span-2 mt-2 flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-2">
                            Your Province
                          </label>
                          <select
                            required
                            value={selectedProvince}
                            onChange={(e) => handleProvinceChange(e.target.value)}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="" disabled>
                              Select your province…
                            </option>
                            {PROVINCES.map((p) => (
                              <option key={p.province} value={p.province}>
                                {p.province}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedProvince && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-2">
                              Your District
                            </label>
                            <select
                              required
                              value={selectedDistrict}
                              onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setStepError(null);
                              }}
                              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              <option value="" disabled>
                                Select your district…
                              </option>
                              {PROVINCES.find((p) => p.province === selectedProvince)?.districts.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        {location === LOCATION_PHNOM_PENH
                          ? "Landmark / Address Notes (optional if location shared)"
                          : "Home Address Details (for doorstep delivery)"}
                      </label>
                      <textarea
                        required={location === LOCATION_PROVINCE || !coords}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        placeholder="House number, Street name, Sangkat or Province/District details..."
                        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery company — only shown once the destination is resolved,
                    so the courier list is always relevant to where they're shipping. */}
                {((location === LOCATION_PHNOM_PENH && (!!coords || address.trim().length > 0)) ||
                  (location === LOCATION_PROVINCE && !!selectedDistrict)) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6"
                  >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" /> Choose Delivery Company
                    </h2>
                    <div className="flex flex-col gap-2.5">
                      {SHIPPING_METHODS[location].map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedShipping(method)}
                          className={cn(
                            "flex items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-all",
                            selectedShipping.id === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border/70 hover:bg-muted/20"
                          )}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{method.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
                          </div>
                          <span className="text-sm font-bold shrink-0">{formatPrice(method.cost)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {stepError && <StepErrorBanner message={stepError} />}

                <Button type="button" size="lg" onClick={handleNextFromDelivery} className="w-full h-12 text-base">
                  Continue to Review &amp; Payment <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* ---------------- STEP 2: REVIEW & PAYMENT ---------------- */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                {/* Delivery summary — read-only recap, editable via link */}
                <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 flex flex-col gap-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" /> Delivery Summary
                  </h2>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-right font-medium truncate">{fullName}</span>

                    <span className="text-muted-foreground">Phone</span>
                    <span className="text-right font-medium truncate">{phone}</span>

                    <span className="text-muted-foreground">Region</span>
                    <span className="text-right font-medium truncate">
                      {location === LOCATION_PHNOM_PENH
                        ? "Phnom Penh"
                        : `${selectedDistrict}, ${selectedProvince}`}
                    </span>

                    {location === LOCATION_PHNOM_PENH && coords && (
                      <>
                        <span className="text-muted-foreground">Pinned location</span>
                        <span className="text-right">
                          <a
                            href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline underline-offset-2"
                          >
                            View on map
                          </a>
                        </span>
                      </>
                    )}

                    <span className="text-muted-foreground">Delivery company</span>
                    <span className="text-right font-medium truncate">{selectedShipping.name}</span>
                  </div>

                  {address && (
                    <div className="pt-2 border-t border-border/60">
                      <p className="text-xs text-muted-foreground mb-1">Address notes</p>
                      <p className="text-sm break-words">{address}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="self-start text-xs font-medium text-primary underline underline-offset-2"
                  >
                    Edit delivery info
                  </button>
                </div>

                {/* Payment method */}
                <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary" /> Payment Method
                  </h2>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
                    <div
                      onClick={() => setPaymentMethod("khqr")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border cursor-pointer text-center transition-all",
                        paymentMethod === "khqr"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <QrCode className="h-6 w-6" />
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                        Bakong KHQR
                      </span>
                    </div>
                    <div
                      onClick={() => setPaymentMethod("aba")}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border cursor-pointer text-center transition-all",
                        paymentMethod === "aba"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Landmark className="h-6 w-6" />
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                        ABA Mobile Bank
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/40 p-4 border border-border/40 flex flex-col items-center text-center">
                    {paymentMethod === "khqr" ? (
                      <>
                        <div className="bg-white p-3 rounded-xl border mb-3 shadow-sm">
                          <div className="w-36 h-36 sm:w-40 sm:h-40 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white rounded-lg font-mono font-bold text-lg">
                            KHQR DUMMY
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-xs break-words">
                          Scan using Bakong or any Cambodian Banking App to auto-pay{" "}
                          <span className="font-semibold text-foreground">{formatPrice(total)}</span>
                        </p>
                      </>
                    ) : (
                      <div className="w-full text-left space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Our Official Bank Account
                        </p>
                        <div className="p-3 bg-background border rounded-lg">
                          <p className="text-sm font-bold text-foreground break-words">ABA Bank (000 123 456)</p>
                          <p className="text-xs text-muted-foreground mt-0.5 break-words">Account Name: NOVA COMMERCE CO., LTD.</p>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1 break-words">
                          Please transfer exactly{" "}
                          <span className="font-semibold text-foreground">{formatPrice(total)}</span> into the account
                          above.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {stepError && <StepErrorBanner message={stepError} />}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="button" variant="outline" size="lg" onClick={() => goToStep(1)} className="w-full sm:flex-1 h-12">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:flex-1 h-12 text-base">
                    {isSubmitting ? "Registering order..." : "Confirm & Complete Order"}
                  </Button>
                </div>

                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground text-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Direct encrypted verification logic.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
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
                  <span className="text-sm font-semibold shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-2 text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium shrink-0">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-baseline gap-2 text-muted-foreground">
                <span className="truncate">Delivery Via ({selectedShipping.name})</span>
                <span className="text-foreground font-medium shrink-0">{formatPrice(selectedShipping.cost)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center gap-2">
              <span className="font-semibold">Total to Pay</span>
              <span className="text-2xl font-bold text-primary shrink-0">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}