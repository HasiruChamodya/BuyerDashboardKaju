import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Marketplace from "./pages/Marketplace";
import SearchBrowse from "./pages/SearchBrowse";
import AuctionDesk from "./pages/AuctionDesk";
import ProductProfile from "./pages/ProductProfile";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Watchlist from "./pages/Watchlist";
import Messaging from "./pages/Messaging";
import Account from "./pages/Account";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ProductProfile />} />
          <Route path="/search" element={<SearchBrowse />} />
          <Route path="/auctions" element={<AuctionDesk />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/account" element={<Account />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/marketplace" replace />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
