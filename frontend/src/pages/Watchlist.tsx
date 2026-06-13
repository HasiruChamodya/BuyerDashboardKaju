import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { listings } from "../data/mockData";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ui/ListingCard";
import { EmptyState } from "../components/ui/Misc";
import Button from "../components/ui/Button";

export default function Watchlist() {
  const { watchlist, toggleWatchlist, addToCart } = useApp();

  const savedListings = listings.filter((l) => watchlist.includes(l.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text-h">Watchlist / Saved Lots</h1>
        <p className="mt-1 text-sm text-text">
          Lots you're tracking — keep an eye on auctions before they close, or revisit fixed-price
          listings when you're ready to order.
        </p>
      </div>

      {savedListings.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="No saved lots yet"
          description="Tap the heart icon on any listing in the marketplace or auction desk to save it here for quick access."
          action={
            <Link to="/marketplace">
              <Button variant="primary" size="sm">
                Browse marketplace
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              watchlisted
              onToggleWatchlist={toggleWatchlist}
              onAddToCart={(id) => addToCart(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
