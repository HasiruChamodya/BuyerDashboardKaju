import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import type { Listing } from "../../types";
import { formatLkrPerMt } from "../../lib/format";
import { GradeStamp, ProcessingPill, ListingTypeTag } from "./Badge";
import { ImagePlaceholder, RatingStars } from "./Misc";
import CountdownTimer from "./CountdownTimer";
import Button from "./Button";

interface ListingCardProps {
  listing: Listing;
  watchlisted?: boolean;
  onToggleWatchlist?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export default function ListingCard({
  listing,
  watchlisted,
  onToggleWatchlist,
  onAddToCart,
}: ListingCardProps) {
  const isAuction = listing.listingType === "auction";
  const displayPrice = isAuction ? listing.currentHighBidPerMt ?? listing.pricePerMt : listing.pricePerMt;

  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-card transition-shadow hover:shadow-pop">
      {/* Image */}
      <Link to={`/marketplace/${listing.id}`} className="relative block">
        <ImagePlaceholder className="h-40 w-full" label={listing.processingType} />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <ListingTypeTag type={listing.listingType} />
        </div>
        {onToggleWatchlist && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWatchlist(listing.id);
            }}
            aria-label={watchlisted ? "Remove from watchlist" : "Save to watchlist"}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-text shadow-card transition-colors hover:text-danger-500"
          >
            <Heart className={`h-4 w-4 ${watchlisted ? "fill-danger-500 text-danger-500" : ""}`} />
          </button>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/marketplace/${listing.id}`} className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-text-h hover:text-brand-600">
              {listing.title}
            </h3>
          </Link>
          <GradeStamp grade={listing.grade} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <ProcessingPill type={listing.processingType} />
          <span className="inline-flex items-center gap-1 text-[11px] text-text">
            <MapPin className="h-3 w-3" />
            {listing.vendor.location}
          </span>
        </div>

        {/* Perforated ledger divider */}
        <div
          className="h-px w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, var(--border) 0 6px, transparent 6px 12px)",
          }}
        />

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-text">
              {isAuction ? "Current High Bid" : "Price"}
            </p>
            <p className="mono-num text-base font-semibold text-text-h">
              {formatLkrPerMt(displayPrice)}
            </p>
          </div>
          {isAuction && listing.auctionEndsAt ? (
            <CountdownTimer endsAt={listing.auctionEndsAt} size="sm" />
          ) : (
            <span className="text-xs text-text">{listing.stockAvailable} MT in stock</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-text">
          <span className="truncate">{listing.vendor.name}</span>
          <RatingStars rating={listing.vendor.rating} />
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <Link to={`/marketplace/${listing.id}`} className="flex-1">
            <Button variant="secondary" size="sm" fullWidth>
              View Lot
            </Button>
          </Link>
          {isAuction ? (
            <Link to={`/marketplace/${listing.id}`} className="flex-1">
              <Button variant="primary" size="sm" fullWidth>
                Place Bid
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="sm" fullWidth onClick={() => onAddToCart?.(listing.id)}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
