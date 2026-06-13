import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Gavel, TrendingUp, Zap } from "lucide-react";
import { listings } from "../data/mockData";
import ListingCard from "../components/ui/ListingCard";
import CountdownTimer from "../components/ui/CountdownTimer";
import { GradeStamp } from "../components/ui/Badge";
import { ImagePlaceholder } from "../components/ui/Misc";
import Button from "../components/ui/Button";
import { formatLkrPerMt } from "../lib/format";
import { useApp } from "../context/AppContext";

export default function AuctionDesk() {
  const { watchlist, toggleWatchlist, addToCart } = useApp();
  const auctions = useMemo(
    () =>
      listings
        .filter((l) => l.listingType === "auction")
        .sort((a, b) => new Date(a.auctionEndsAt!).getTime() - new Date(b.auctionEndsAt!).getTime()),
    []
  );

  const featured = auctions[0];
  const [bidAmount, setBidAmount] = useState(
    featured ? (featured.currentHighBidPerMt ?? featured.pricePerMt) + (featured.minIncrementPerMt ?? 1000) : 0
  );
  const [bidPlaced, setBidPlaced] = useState(false);

  if (!featured) return null;

  const minNextBid = (featured.currentHighBidPerMt ?? featured.pricePerMt) + (featured.minIncrementPerMt ?? 1000);
  const isValidBid = bidAmount >= minNextBid;

  function handlePlaceBid() {
    if (!isValidBid) return;
    setBidPlaced(true);
    setTimeout(() => setBidPlaced(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text-h">Active Auctions</h1>
        <p className="mt-1 text-sm text-text">
          Live cashew lots currently open for bidding across KajuMart's vendor network. All bids are binding once placed.
        </p>
      </div>

      {/* Bidding Terminal — featured lot */}
      <div className="overflow-hidden rounded-card border border-border bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-border bg-text-h px-4 py-2.5 text-white">
          <Gavel className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">Bidding Terminal — Closing Soonest</span>
        </div>
        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-[200px_1fr_280px]">
          <ImagePlaceholder className="h-40 w-full rounded-card md:h-full" label={featured.processingType} />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <GradeStamp grade={featured.grade} />
              <span className="text-xs text-text">Lot {featured.id}</span>
            </div>
            <Link to={`/marketplace/${featured.id}`}>
              <h2 className="text-lg font-bold text-text-h hover:text-brand-600">{featured.title}</h2>
            </Link>
            <p className="text-sm text-text">{featured.vendor.name} · {featured.vendor.location}</p>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text">Current High Bid</p>
                <p className="mono-num text-lg font-bold text-text-h">{formatLkrPerMt(featured.currentHighBidPerMt ?? featured.pricePerMt)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text">Total Bids</p>
                <p className="mono-num text-lg font-bold text-text-h">{featured.bidCount}</p>
              </div>
            </div>
            <div className="mt-1">
              <CountdownTimer endsAt={featured.auctionEndsAt!} />
            </div>
          </div>

          {/* Smart interaction panel */}
          <div className="flex flex-col gap-3 rounded-card border border-border bg-bg-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-h">Place a manual bid</p>
            <div>
              <label className="mb-1 block text-[11px] text-text">Your bid (LKR / MT)</label>
              <input
                type="number"
                value={bidAmount}
                step={featured.minIncrementPerMt}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="mono-num w-full rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-text-h focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <p className="mt-1 text-[11px] text-text">
                Minimum next bid: <span className="mono-num font-medium text-text-h">{formatLkrPerMt(minNextBid)}</span>
              </p>
              {!isValidBid && (
                <p className="mt-1 text-[11px] text-danger-500">Bid must meet the minimum increment threshold.</p>
              )}
            </div>
            <div className="flex gap-2">
              {[1, 2, 5].map((mult) => (
                <button
                  key={mult}
                  onClick={() => setBidAmount(minNextBid + (featured.minIncrementPerMt ?? 1000) * (mult - 1))}
                  className="flex-1 rounded-md border border-border bg-white py-1.5 text-xs font-medium text-text hover:border-brand-200 hover:bg-brand-50"
                >
                  +{(featured.minIncrementPerMt! * mult).toLocaleString()}
                </button>
              ))}
            </div>
            <Button onClick={handlePlaceBid} icon={<TrendingUp className="h-4 w-4" />}>
              {bidPlaced ? "Bid placed!" : "Place Bid"}
            </Button>
            {featured.buyItNowPricePerMt && (
              <Button variant="secondary" icon={<Zap className="h-4 w-4" />}>
                Buy It Now — {formatLkrPerMt(featured.buyItNowPricePerMt)}
              </Button>
            )}
            {bidPlaced && (
              <p className="rounded-md bg-brand-50 px-3 py-2 text-xs font-medium text-brand-600">
                Your bid of {formatLkrPerMt(bidAmount)} has been submitted and is now the highest bid.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* All live auctions grid */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-text-h">
          All live auctions <span className="text-sm font-normal text-text">({auctions.length})</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              watchlisted={watchlist.includes(listing.id)}
              onToggleWatchlist={toggleWatchlist}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
