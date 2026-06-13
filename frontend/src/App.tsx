import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import AuctionDesk from "./pages/AuctionDesk";
import Orders from "./pages/Orders";
import Watchlist from "./pages/Watchlist";
import Messaging from "./pages/Messaging";
import Account from "./pages/Account";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={
            <AppProvider>
              <DashboardLayout />
            </AppProvider>
          }>
            <Route path="/" element={<Navigate to="/auctions" replace />} />
            <Route path="/auctions" element={<AuctionDesk />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/messages" element={<Messaging />} />
            <Route path="/account" element={<Account />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/auctions" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}