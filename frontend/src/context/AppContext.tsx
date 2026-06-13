import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import type { CartItem, AppNotification } from "../types";
import { notifications as initialNotifications, listings } from "../data/mockData";

interface AppContextValue {
  cart: CartItem[];
  addToCart: (listingId: string, quantityMt?: number, packWeight?: string) => void;
  updateCartQuantity: (listingId: string, quantityMt: number) => void;
  removeFromCart: (listingId: string) => void;
  cartCount: number;
  cartTotal: number;

  watchlist: string[];
  toggleWatchlist: (listingId: string) => void;

  notifications: AppNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    { listingId: "L-1001", quantityMt: 1, packWeight: "1MT" },
    { listingId: "L-1004", quantityMt: 2, packWeight: "1MT" },
  ]);
  const [watchlist, setWatchlist] = useState<string[]>(["L-1002", "L-1003"]);
  const [notificationsState, setNotificationsState] = useState<AppNotification[]>(initialNotifications);

  function addToCart(listingId: string, quantityMt = 1, packWeight = "1MT") {
    setCart((prev) => {
      const existing = prev.find((item) => item.listingId === listingId);
      if (existing) {
        return prev.map((item) =>
          item.listingId === listingId ? { ...item, quantityMt: item.quantityMt + quantityMt } : item
        );
      }
      return [...prev, { listingId, quantityMt, packWeight }];
    });
  }

  function updateCartQuantity(listingId: string, quantityMt: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.listingId === listingId ? { ...item, quantityMt } : item))
        .filter((item) => item.quantityMt > 0)
    );
  }

  function removeFromCart(listingId: string) {
    setCart((prev) => prev.filter((item) => item.listingId !== listingId));
  }

  function toggleWatchlist(listingId: string) {
    setWatchlist((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  }

  function markAllNotificationsRead() {
    setNotificationsState((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markNotificationRead(id: string) {
    setNotificationsState((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantityMt, 0);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const listing = listings.find((l) => l.id === item.listingId);
      if (!listing) return sum;
      const price = listing.listingType === "auction" ? listing.currentHighBidPerMt ?? listing.pricePerMt : listing.pricePerMt;
      return sum + price * item.quantityMt;
    }, 0);
  }, [cart]);

  const unreadCount = notificationsState.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        cartCount,
        cartTotal,
        watchlist,
        toggleWatchlist,
        notifications: notificationsState,
        unreadCount,
        markAllNotificationsRead,
        markNotificationRead,
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
