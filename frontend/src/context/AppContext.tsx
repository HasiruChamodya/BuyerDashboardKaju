import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Listing, AppNotification } from "../types";
import { apiFetch } from "../lib/api";

export interface CartLine {
  listingId: string;
  quantityMt: number;
  packWeight: string;
  listing: Listing;
  pricePerMt: number;
  lineTotal: number;
}

interface CartResponse {
  items: CartLine[];
  cartTotal: number;
  cartCount: number;
}

interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

interface AppContextValue {
  // Listings (fetched once, used for client-side filtering across pages)
  listings: Listing[];
  listingsLoading: boolean;
  refreshListings: () => Promise<void>;

  // Cart
  cartItems: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (listingId: string, quantityMt?: number, packWeight?: string) => Promise<void>;
  updateCartQuantity: (listingId: string, quantityMt: number) => Promise<void>;
  removeFromCart: (listingId: string) => Promise<void>;
  refreshCart: () => Promise<void>;

  // Watchlist
  watchlist: string[];
  watchlistListings: Listing[];
  toggleWatchlist: (listingId: string) => Promise<void>;
  refreshWatchlist: () => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const [watchlistListings, setWatchlistListings] = useState<Listing[]>([]);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function refreshListings() {
    setListingsLoading(true);
    try {
      const data = await apiFetch<Listing[]>("/listings");
      setListings(data);
    } finally {
      setListingsLoading(false);
    }
  }

  async function refreshCart() {
    const data = await apiFetch<CartResponse>("/cart");
    setCartItems(data.items);
    setCartTotal(data.cartTotal);
    setCartCount(data.cartCount);
  }

  async function refreshWatchlist() {
    const data = await apiFetch<Listing[]>("/watchlist");
    setWatchlistListings(data);
  }

  async function refreshNotifications() {
    const data = await apiFetch<NotificationsResponse>("/notifications");
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }

  useEffect(() => {
    refreshListings();
    refreshCart();
    refreshWatchlist();
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addToCart(listingId: string, quantityMt = 1, packWeight = "1MT") {
    await apiFetch("/cart", {
      method: "POST",
      body: JSON.stringify({ listingId, quantityMt, packWeight }),
    });
    await refreshCart();
  }

  async function updateCartQuantity(listingId: string, quantityMt: number) {
    if (quantityMt <= 0) {
      await removeFromCart(listingId);
      return;
    }
    await apiFetch(`/cart/${listingId}`, {
      method: "PUT",
      body: JSON.stringify({ quantityMt }),
    });
    await refreshCart();
  }

  async function removeFromCart(listingId: string) {
    await apiFetch(`/cart/${listingId}`, { method: "DELETE" });
    await refreshCart();
  }

  async function toggleWatchlist(listingId: string) {
    const isWatched = watchlistListings.some((l) => l.id === listingId);
    if (isWatched) {
      await apiFetch(`/watchlist/${listingId}`, { method: "DELETE" });
    } else {
      await apiFetch(`/watchlist/${listingId}`, { method: "POST" });
    }
    await refreshWatchlist();
  }

  async function markAllNotificationsRead() {
    await apiFetch("/notifications/read-all", { method: "PATCH" });
    await refreshNotifications();
  }

  async function markNotificationRead(id: string) {
    await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
    await refreshNotifications();
  }

  const watchlist = watchlistListings.map((l) => l.id);

  return (
    <AppContext.Provider
      value={{
        listings,
        listingsLoading,
        refreshListings,

        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        refreshCart,

        watchlist,
        watchlistListings,
        toggleWatchlist,
        refreshWatchlist,

        notifications,
        unreadCount,
        markAllNotificationsRead,
        markNotificationRead,
        refreshNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}