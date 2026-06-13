import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  ShoppingCart,
  Tag,
  Truck,
  Warehouse,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { listings, districts } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { GradeStamp } from "../components/ui/Badge";
import { ImagePlaceholder, EmptyState } from "../components/ui/Misc";
import Button from "../components/ui/Button";
import { formatLkr } from "../lib/format";

type Step = "cart" | "delivery" | "shipping" | "payment" | "confirmation";

const SHIPPING_RATES = { Courier: 18500, Pickup: 0 };

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useApp();
  const [step, setStep] = useState<Step>("cart");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [district, setDistrict] = useState(districts[0]);
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState<"Courier" | "Pickup">("Courier");
  const [payment, setPayment] = useState<"Digital" | "COD">("Digital");
  const [orderId, setOrderId] = useState("");

  const cartListings = cart
    .map((item) => ({ item, listing: listings.find((l) => l.id === item.listingId) }))
    .filter((x) => x.listing);

  const discount = promoApplied ? Math.round(cartTotal * 0.05) : 0;
  const shippingCost = SHIPPING_RATES[shipping];
  const grandTotal = cartTotal - discount + (step === "cart" ? 0 : shippingCost);

  function applyPromo() {
    if (promoCode.trim().toUpperCase() === "KAJU5") {
      setPromoApplied(true);
    }
  }

  function handlePlaceOrder() {
    setOrderId(`ORD-${Math.floor(20000 + Math.random() * 9999)}`);
    setStep("confirmation");
  }

  if (step === "confirmation") {
    return (
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center gap-4 rounded-card border border-border bg-white p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-h">Order placed successfully</h1>
            <p className="mt-1 text-sm text-text">
              Your order <span className="mono-num font-medium text-text-h">{orderId}</span> has been registered.
              {payment === "Digital"
                ? " Funds will be held in escrow until the batch is dispatched."
                : " Pay the courier upon delivery to confirm acceptance."}
            </p>
          </div>
          <div className="flex w-full gap-3">
            <Link to="/orders" className="flex-1">
              <Button fullWidth>Track this order</Button>
            </Link>
            <Link to="/marketplace" className="flex-1">
              <Button variant="secondary" fullWidth>Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartListings.length === 0 && step === "cart") {
    return (
      <EmptyState
        icon={<ShoppingCart className="h-6 w-6" />}
        title="Your cart is empty"
        description="Browse the marketplace to add fixed-price lots, or check Active Auctions if you've won a bid."
        action={
          <Link to="/marketplace">
            <Button>Browse Marketplace</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text-h">{step === "cart" ? "Your Cart" : "Checkout"}</h1>
        <p className="mt-1 text-sm text-text">
          {step === "cart"
            ? `${cartListings.length} lot${cartListings.length === 1 ? "" : "s"} ready for checkout`
            : "Confirm delivery, shipping, and settlement details to complete your order."}
        </p>
      </div>

      {/* Step indicator for checkout */}
      {step !== "cart" && (
        <div className="flex items-center gap-2 text-xs">
          {(["delivery", "shipping", "payment"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold ${
                  step === s ? "bg-brand-600 text-white" : "bg-bg-soft text-text"
                }`}
              >
                {i + 1}
              </span>
              <span className={step === s ? "font-medium text-text-h" : "text-text"}>
                {s === "delivery" ? "Delivery" : s === "shipping" ? "Shipping" : "Settlement"}
              </span>
              {i < 2 && <span className="mx-1 h-px w-6 bg-border" />}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {step === "cart" &&
            cartListings.map(({ item, listing }) => (
              <div key={item.listingId} className="flex gap-4 rounded-card border border-border bg-white p-4">
                <ImagePlaceholder className="h-20 w-24 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/marketplace/${listing!.id}`} className="text-sm font-semibold text-text-h hover:text-brand-600">
                      {listing!.title}
                    </Link>
                    <GradeStamp grade={listing!.grade} />
                  </div>
                  <p className="text-xs text-text">{listing!.vendor.name} · {item.packWeight} packs</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.listingId, item.quantityMt - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-h hover:bg-bg-soft"
                      >
                        −
                      </button>
                      <span className="mono-num w-10 text-center text-sm font-semibold text-text-h">{item.quantityMt} MT</span>
                      <button
                        onClick={() => updateCartQuantity(item.listingId, item.quantityMt + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-h hover:bg-bg-soft"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="mono-num text-sm font-bold text-text-h">
                        {formatLkr((listing!.listingType === "auction" ? listing!.currentHighBidPerMt ?? listing!.pricePerMt : listing!.pricePerMt) * item.quantityMt)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.listingId)}
                        className="text-text hover:text-danger-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Step: Delivery Configuration */}
          {step === "delivery" && (
            <div className="rounded-card border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-text-h">Delivery Configuration</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-h">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text-h focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-h">Local handling address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    placeholder="No. 12, Industrial Estate Road, Colombo 14"
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text-h placeholder:text-text focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Shipping Handler */}
          {step === "shipping" && (
            <div className="rounded-card border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-text-h">Shipping Handler</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setShipping("Courier")}
                  className={`flex flex-col gap-2 rounded-card border p-4 text-left ${
                    shipping === "Courier" ? "border-brand-600 bg-brand-50" : "border-border hover:bg-bg-soft"
                  }`}
                >
                  <Truck className="h-5 w-5 text-brand-600" />
                  <p className="text-sm font-semibold text-text-h">Scheduled Courier Transport</p>
                  <p className="text-xs text-text">Delivered to {district} within 3–5 business days.</p>
                  <p className="mono-num text-sm font-bold text-text-h">{formatLkr(SHIPPING_RATES.Courier)}</p>
                </button>
                <button
                  onClick={() => setShipping("Pickup")}
                  className={`flex flex-col gap-2 rounded-card border p-4 text-left ${
                    shipping === "Pickup" ? "border-brand-600 bg-brand-50" : "border-border hover:bg-bg-soft"
                  }`}
                >
                  <Warehouse className="h-5 w-5 text-brand-600" />
                  <p className="text-sm font-semibold text-text-h">Direct Warehouse Pick-Up</p>
                  <p className="text-xs text-text">Collect directly from the vendor's warehouse.</p>
                  <p className="mono-num text-sm font-bold text-text-h">Free</p>
                </button>
              </div>
            </div>
          )}

          {/* Step: Settlement Protocol */}
          {step === "payment" && (
            <div className="rounded-card border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-text-h">Settlement Protocol</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setPayment("Digital")}
                  className={`flex flex-col gap-2 rounded-card border p-4 text-left ${
                    payment === "Digital" ? "border-brand-600 bg-brand-50" : "border-border hover:bg-bg-soft"
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-brand-600" />
                  <p className="text-sm font-semibold text-text-h">Digital Payment</p>
                  <p className="text-xs text-text">Card or bank transfer. Funds held in escrow until dispatch.</p>
                </button>
                <button
                  onClick={() => setPayment("COD")}
                  className={`flex flex-col gap-2 rounded-card border p-4 text-left ${
                    payment === "COD" ? "border-brand-600 bg-brand-50" : "border-border hover:bg-bg-soft"
                  }`}
                >
                  <Banknote className="h-5 w-5 text-brand-600" />
                  <p className="text-sm font-semibold text-text-h">Cash on Delivery</p>
                  <p className="text-xs text-text">Pay in full when your batch arrives.</p>
                </button>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3">
            {step !== "cart" && (
              <Button
                variant="secondary"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={() =>
                  setStep(step === "delivery" ? "cart" : step === "shipping" ? "delivery" : "shipping")
                }
              >
                Back
              </Button>
            )}
          </div>
        </div>

        {/* Summary panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-border bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-text-h">Order Summary</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text">Subtotal</span>
                <span className="mono-num font-medium text-text-h">{formatLkr(cartTotal)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-brand-600">
                  <span>Promo (KAJU5)</span>
                  <span className="mono-num font-medium">−{formatLkr(discount)}</span>
                </div>
              )}
              {step !== "cart" && (
                <div className="flex justify-between">
                  <span className="text-text">Shipping ({shipping})</span>
                  <span className="mono-num font-medium text-text-h">{shippingCost === 0 ? "Free" : formatLkr(shippingCost)}</span>
                </div>
              )}
              <div className="mt-1 flex justify-between border-t border-border pt-2 text-base">
                <span className="font-semibold text-text-h">Total</span>
                <span className="mono-num font-bold text-text-h">{formatLkr(grandTotal)}</span>
              </div>
            </div>

            {step === "cart" && (
              <div className="mt-4">
                <label className="mb-1 block text-xs font-medium text-text-h">Promo code</label>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. KAJU5"
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <Button variant="secondary" icon={<Tag className="h-3.5 w-3.5" />} onClick={applyPromo}>
                    Apply
                  </Button>
                </div>
                {promoApplied && <p className="mt-1 text-xs text-brand-600">5% discount applied!</p>}
              </div>
            )}

            <div className="mt-4">
              {step === "cart" && (
                <Button fullWidth onClick={() => setStep("delivery")}>
                  Proceed to Checkout
                </Button>
              )}
              {step === "delivery" && (
                <Button fullWidth onClick={() => setStep("shipping")} disabled={!address.trim()}>
                  Continue to Shipping
                </Button>
              )}
              {step === "shipping" && (
                <Button fullWidth onClick={() => setStep("payment")}>
                  Continue to Settlement
                </Button>
              )}
              {step === "payment" && (
                <Button fullWidth onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              )}
            </div>
          </div>

          {step !== "cart" && (
            <div className="rounded-card border border-border bg-white p-5 text-sm">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-h">Delivering to</h3>
              <p className="text-text">{address || "—"}</p>
              <p className="text-text">{district} District, Sri Lanka</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
