import { useState } from "react";
import { Link } from "react-router-dom";
import { Nut, Flame, Cookie, Sparkles, ArrowRight, Gavel } from "lucide-react";
import ListingCard from "../components/ui/ListingCard";
import FilterSidebar, { defaultFilters } from "../components/ui/FilterSidebar";
import { useFilteredListings } from "../lib/useFilteredListings";
import { useApp } from "../context/AppContext";
import type { ProcessingType } from "../types";

const categories: { type: ProcessingType; icon: typeof Nut; description: string }[] = [
  { type: "Raw", icon: Nut, description: "Unprocessed, graded by size" },
  { type: "Roasted", icon: Flame, description: "Salted & plain roasted lots" },
  { type: "Baked", icon: Cookie, description: "Bakery & confectionery grades" },
  { type: "Flavoured", icon: Sparkles, description: "Honey, chili-lime & more" },
];

export default function Marketplace() {
  const [filters, setFilters] = useState(defaultFilters);
  const { listings, listingsLoading, watchlist, toggleWatchlist, addToCart } = useApp();
  const filtered = useFilteredListings(listings, filters);

  const liveAuctions = listings.filter((l) => l.listingType === "auction");

  return (
    <div className="flex flex-col gap-6">
      {/* Promo banner */}
      <div className="relative overflow-hidden rounded-card bg-brand-600 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            June Harvest Season
          </span>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
            Bulk W180 & W240 lots now open for bidding
          </h1>
          <p className="mt-2 text-sm text-brand-100">
            Source directly from verified Sri Lankan processors across Anuradhapura, Puttalam and Ampara.
            New harvest lots are added daily — set alerts so you never miss a closing auction.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/auctions">
              <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50">
                <Gavel className="h-4 w-4" />
                View Active Auctions
              </button>
            </Link>
            <Link to="/search">
              <button className="inline-flex items-center gap-2 rounded-md border border-white/30 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                Browse Bulk Lots
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-500/40" aria-hidden />
        <div className="absolute bottom-0 right-20 h-32 w-32 rounded-full bg-brand-400/30" aria-hidden />
      </div>

      {/* Category tiles */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-text-h">Browse by processing type</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.type}
              to="/search"
              state={{ processingType: cat.type }}
              className="group flex flex-col gap-2 rounded-card border border-border bg-white p-4 transition-colors hover:border-brand-200 hover:bg-brand-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600 group-hover:bg-white">
                <cat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-h">{cat.type} Cashews</p>
                <p className="text-xs text-text">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {listingsLoading ? (
        <p className="py-12 text-center text-sm text-text">Loading marketplace listings…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <div>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          <div className="flex flex-col gap-6">
            {/* Live auctions strip */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-text-h">Live auctions ending soon</h2>
                <Link to="/auctions" className="text-xs font-medium text-brand-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {liveAuctions.slice(0, 3).map((listing) => (
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

            {/* All listings */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-text-h">
                  All lots <span className="text-sm font-normal text-text">({filtered.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((listing) => (
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
        </div>
      )}
    </div>
  );
}