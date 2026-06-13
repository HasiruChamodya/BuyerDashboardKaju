import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Calendar,
  Package,
  Layers,
  ShoppingCart,
  TrendingUp,
  Zap,
  MessageSquare,
} from "lucide-react";
import { GradeStamp, ProcessingPill, ListingTypeTag, VerifiedBadge } from "../components/ui/Badge";
import { ImagePlaceholder, RatingStars } from "../components/ui/Misc";
import CountdownTimer from "../components/ui/CountdownTimer";
import Button from "../components/ui/Button";
import { formatDate, formatLkr, formatLkrPerMt } from "../lib/format";
import { useApp } from "../context/AppContext";
import { apiFetch } from "../lib/api";

export default function ProductProfile() {
  const { id } = useParams<{ id: string }>();
  const {
    listings,
    listingsLoading,
    watchlist,
    toggleWatchlist,
    addToCart,
    cartItems,
    refreshListings,
  } = useApp();

  const listing = listings.find((l) => l.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [packWeight, setPackWeight] = useState(listing?.availablePackWeights[0] ?? "");
  const [quantityMt, setQuantityMt] = useState(1);
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [bidPlaced, setBidPlaced] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [added, setAdded] = useState(false);

  if (listingsLoading) {
    return <p className="py-12 text-center text-sm text-text">Loading lot details…</p>;
  }

  if (!listing) return <Navigate to="/marketplace" replace />;

  const isAuction = listing.listingType === "auction";
  const minNextBid = (listing.currentHighBidPerMt ?? listing.pricePerMt) + (listing.minIncrementPerMt ?? 1000);
  const effectiveBid = bidAmount ?? minNextBid;
  const isValidBid = effectiveBid >= minNextBid;
  const inCart = cartItems.some((c) => c.listingId === listing.id);

  async function handleAddToCart() {
    await addToCart(listing!.id, quantityMt, packWeight);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handlePlaceBid() {
    if (!isValidBid) return;
    setBidError(null);
    setSubmittingBid(true);
    try {
      await apiFetch(`/listings/${listing!.id}/bid`, {
        method: "POST",
        body: JSON.stringify({ amountPerMt: effectiveBid }),
      });
      await refreshListings();
      setBidAmount(null);
      setBidPlaced(true);
      setTimeout(() => setBidPlaced(false), 2500);
    } catch (err) {
      setBidError(err instanceof Error ? err.message : "Could not place bid");
    } finally {
      setSubmittingBid(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-text">
        <Link to="/marketplace" className="hover:text-brand-600">Marketplace</Link>
        <span>/</span>
        <ProcessingPill type={listing.processingType} />
        <span>/</span>
        <span className="text-text-h">{listing.id}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        {/* Left: image gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <ImagePlaceholder className="h-80 w-full rounded-card sm:h-96" label={listing.images[activeImage]} />
            <div className="absolute left-3 top-3 flex gap-2">
              <ListingTypeTag type={listing.listingType} />
            </div>
            <button
              onClick={() => toggleWatchlist(listing.id)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text shadow-card hover:text-danger-500"
              aria-label="Toggle watchlist"
            >
              <Heart className={`h-4.5 w-4.5 ${watchlist.includes(listing.id) ? "fill-danger-500 text-danger-500" : ""}`} />
            </button>
          </div>
          <div className="flex gap-2">
            {listing.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`overflow-hidden rounded-md border-2 ${
                  activeImage === i ? "border-brand-600" : "border-transparent"
                }`}
              >
                <ImagePlaceholder className="h-16 w-20" />
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="rounded-card border border-border bg-white p-5">
            <h2 className="mb-2 text-sm font-semibold text-text-h">Lot Description</h2>
            <p className="text-sm leading-relaxed text-text">{listing.description}</p>
          </div>

          {/* Specification breakdown */}
          <div className="rounded-card border border-border bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-text-h">Specification Breakdown</h2>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Spec icon={Layers} label="Cashew Grade" value={listing.grade} mono />
              <Spec icon={MapPin} label="Certified Origin" value={listing.origin} />
              <Spec icon={Calendar} label="Processing Date" value={formatDate(listing.processingDate)} />
              <Spec icon={Package} label="Total Batch Volume" value={`${listing.totalVolumeKg.toLocaleString()} kg`} mono />
              <Spec icon={Package} label="Available Pack Weights" value={listing.availablePackWeights.join(", ")} mono />
              <Spec icon={Package} label="Stock Available" value={`${listing.stockAvailable} MT`} mono />
            </dl>
          </div>

          {/* Vendor profile card */}
          <div className="rounded-card border border-border bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-text-h">Vendor Profile</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text-h">{listing.vendor.name}</p>
                  <VerifiedBadge verified={listing.vendor.verified} />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-text">
                  <MapPin className="h-3 w-3" /> {listing.vendor.location} · {listing.vendor.yearsActive} years on KajuMart
                </p>
                <div className="mt-1.5">
                  <RatingStars rating={listing.vendor.rating} reviews={listing.vendor.totalReviews} />
                </div>
              </div>
              <Link to="/messages">
                <Button variant="secondary" size="sm" icon={<MessageSquare className="h-3.5 w-3.5" />}>
                  Message
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: consolidated metrics + actions */}
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-border bg-white p-5">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h1 className="text-lg font-bold leading-snug text-text-h">{listing.title}</h1>
              <GradeStamp grade={listing.grade} />
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <ProcessingPill type={listing.processingType} />
              <span className="text-xs text-text">Lot ID: <span className="mono-num">{listing.id}</span></span>
            </div>

            {/* Perforated ledger divider */}
            <div
              className="mb-3 h-px w-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, var(--border) 0 6px, transparent 6px 12px)",
              }}
            />

            {isAuction ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text">Current High Bid</p>
                    <p className="mono-num text-2xl font-bold text-text-h">{formatLkrPerMt(listing.currentHighBidPerMt!)}</p>
                  </div>
                  <CountdownTimer endsAt={listing.auctionEndsAt!} />
                </div>
                <p className="text-xs text-text">{listing.bidCount} bids placed so far</p>

                <div className="rounded-card border border-border bg-bg-soft p-3">
                  <label className="mb-1 block text-[11px] text-text">Your bid (LKR / MT)</label>
                  <input
                    type="number"
                    placeholder={String(minNextBid)}
                    value={bidAmount ?? ""}
                    step={listing.minIncrementPerMt}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="mono-num w-full rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-text-h focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <p className="mt-1 text-[11px] text-text">
                    Minimum next bid: <span className="mono-num font-medium text-text-h">{formatLkrPerMt(minNextBid)}</span>
                    {" · "}Increment: <span className="mono-num font-medium text-text-h">{formatLkr(listing.minIncrementPerMt!)}</span>
                  </p>
                  {bidAmount !== null && bidAmount > 0 && !isValidBid && (
                    <p className="mt-1 text-[11px] text-danger-500">Bid does not meet the minimum increment threshold.</p>
                  )}
                  {bidError && (
                    <p className="mt-1 text-[11px] text-danger-500">{bidError}</p>
                  )}
                </div>

                <Button onClick={handlePlaceBid} disabled={!isValidBid || submittingBid} icon={<TrendingUp className="h-4 w-4" />}>
                  {submittingBid ? "Placing bid…" : bidPlaced ? "Bid placed!" : "Place Bid"}
                </Button>
                {bidPlaced && (
                  <p className="rounded-md bg-brand-50 px-3 py-2 text-xs font-medium text-brand-600">
                    Your bid of {formatLkrPerMt(effectiveBid)} has been submitted and is now the highest bid.
                  </p>
                )}

                {listing.buyItNowPricePerMt && (
                  <Button variant="secondary" icon={<Zap className="h-4 w-4" />}>
                    Buy It Now — {formatLkrPerMt(listing.buyItNowPricePerMt)}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-text">Price</p>
                  <p className="mono-num text-2xl font-bold text-text-h">{formatLkrPerMt(listing.pricePerMt)}</p>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] text-text">Pack weight</label>
                  <div className="flex flex-wrap gap-2">
                    {listing.availablePackWeights.map((w) => (
                      <button
                        key={w}
                        onClick={() => setPackWeight(w)}
                        className={`mono-num rounded-md border px-3 py-1.5 text-xs font-medium ${
                          packWeight === w
                            ? "border-brand-600 bg-brand-50 text-brand-600"
                            : "border-border text-text hover:bg-bg-soft"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] text-text">Quantity (MT)</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantityMt((q) => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-h hover:bg-bg-soft"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={listing.stockAvailable}
                      value={quantityMt}
                      onChange={(e) => setQuantityMt(Math.max(1, Number(e.target.value)))}
                      className="mono-num w-20 rounded-md border border-border px-3 py-2 text-center text-sm font-semibold text-text-h focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <button
                      onClick={() => setQuantityMt((q) => Math.min(listing.stockAvailable, q + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-h hover:bg-bg-soft"
                    >
                      +
                    </button>
                    <span className="text-xs text-text">of {listing.stockAvailable} MT available</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-card bg-bg-soft px-3 py-2.5">
                  <span className="text-sm text-text">Subtotal</span>
                  <span className="mono-num text-lg font-bold text-text-h">{formatLkr(listing.pricePerMt * quantityMt)}</span>
                </div>

                <Button onClick={handleAddToCart} icon={<ShoppingCart className="h-4 w-4" />}>
                  {added ? "Added to cart!" : inCart ? "Add more to cart" : "Add to Cart"}
                </Button>
                <Link to="/cart">
                  <Button variant="secondary" fullWidth>Go to Cart</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Trust note */}
          <div className="rounded-card border border-brand-100 bg-brand-50 p-4 text-xs text-brand-600">
            Payments are held in escrow until the buyer confirms delivery. Disputes can be raised from the Orders &amp; Logistics page within 48 hours of delivery.
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof Layers;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <dt className="text-[11px] uppercase tracking-wide text-text">{label}</dt>
        <dd className={`text-sm font-medium text-text-h ${mono ? "mono-num" : ""}`}>{value}</dd>
      </div>
    </div>
  );
}