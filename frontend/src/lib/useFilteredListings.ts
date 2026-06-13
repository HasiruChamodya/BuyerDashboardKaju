import { useMemo } from "react";
import type { Listing, ProcessingType } from "../types";
import type { FilterState } from "../components/ui/FilterSidebar";

export function useFilteredListings(
  listings: Listing[],
  filters: FilterState,
  query = "",
  processingTypeOverride?: ProcessingType
) {
  return useMemo(() => {
    return listings.filter((l) => {
      if (processingTypeOverride && l.processingType !== processingTypeOverride) return false;

      if (filters.processingTypes.length && !filters.processingTypes.includes(l.processingType)) return false;
      if (filters.grades.length && !filters.grades.includes(l.grade)) return false;
      if (
        filters.packWeights.length &&
        !l.availablePackWeights.some((w) => filters.packWeights.includes(w))
      )
        return false;

      const price = l.listingType === "auction" ? l.currentHighBidPerMt ?? l.pricePerMt : l.pricePerMt;
      if (filters.minPrice !== "" && price < filters.minPrice) return false;
      if (filters.maxPrice !== "" && price > filters.maxPrice) return false;

      if (filters.minWeight !== "" && l.stockAvailable < filters.minWeight) return false;
      if (filters.vendorRating && l.vendor.rating < filters.vendorRating) return false;
      if (filters.inStockOnly && l.stockAvailable <= 0) return false;

      if (query) {
        const haystack = `${l.title} ${l.grade} ${l.origin} ${l.vendor.name} ${l.processingType}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }

      return true;
    });
  }, [listings, filters, query, processingTypeOverride]);
}
