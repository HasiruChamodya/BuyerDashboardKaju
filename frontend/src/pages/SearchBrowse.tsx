import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import ListingCard from "../components/ui/ListingCard";
import FilterSidebar, { defaultFilters } from "../components/ui/FilterSidebar";
import { useFilteredListings } from "../lib/useFilteredListings";
import { useApp } from "../context/AppContext";
import { EmptyState } from "../components/ui/Misc";
import type { ProcessingType } from "../types";

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest";

export default function SearchBrowse() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState<SortOption>("relevance");
  const { listings, listingsLoading, watchlist, toggleWatchlist, addToCart } = useApp();

  const query = searchParams.get("q") ?? "";
  const categoryState = (location.state as { processingType?: ProcessingType } | null)?.processingType;

  useEffect(() => {
    if (categoryState) {
      setFilters((f) => ({ ...f, processingTypes: [categoryState] }));
    }
  }, [categoryState]);

  const filtered = useFilteredListings(listings, filters, query);

  const sorted = [...filtered].sort((a, b) => {
    const priceA = a.listingType === "auction" ? a.currentHighBidPerMt ?? a.pricePerMt : a.pricePerMt;
    const priceB = b.listingType === "auction" ? b.currentHighBidPerMt ?? b.pricePerMt : b.pricePerMt;
    switch (sort) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "newest":
        return new Date(b.processingDate).getTime() - new Date(a.processingDate).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text-h">Search &amp; Browse</h1>
        <p className="mt-1 text-sm text-text">
          {query ? (
            <>
              Showing results for <span className="font-medium text-text-h">"{query}"</span>
            </>
          ) : (
            "Browse all lots across KajuMart's verified vendor network."
          )}
        </p>
      </div>

      {listingsLoading ? (
        <p className="py-12 text-center text-sm text-text">Loading listings…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <div>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-white px-4 py-3">
              <p className="text-sm text-text">
                <span className="font-semibold text-text-h">{sorted.length}</span> lots found
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs text-text">Sort by</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="rounded-md border border-border bg-white px-2.5 py-1.5 text-sm text-text-h focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Processed</option>
                </select>
              </div>
            </div>

            {sorted.length === 0 ? (
              <EmptyState
                icon={<SearchX className="h-6 w-6" />}
                title="No lots match your filters"
                description="Try widening your price band, removing a grade filter, or clearing the vendor rating requirement."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    watchlisted={watchlist.includes(listing.id)}
                    onToggleWatchlist={toggleWatchlist}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}