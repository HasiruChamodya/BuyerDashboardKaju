import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, HelpCircle, ArrowLeftRight, Menu, Sprout } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { timeAgo } from "../../lib/format";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { notifications, unreadCount, markAllNotificationsRead } = useApp();
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-md text-text hover:bg-bg-soft lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link to="/marketplace" className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
          <Sprout className="h-4.5 w-4.5" />
        </div>
      </Link>

      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lots, grades, vendors (e.g. W240, Anuradhapura)…"
          className="w-full rounded-md border border-border bg-bg-soft py-2 pl-9 pr-3 text-sm text-text-h placeholder:text-text focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Help menu */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setHelpOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-text hover:bg-bg-soft"
            aria-label="Need help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          {helpOpen && (
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-card border border-border bg-white p-2 shadow-pop">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-text/60">Need help?</p>
              <a href="#" className="block rounded-md px-2 py-2 text-sm text-text hover:bg-bg-soft hover:text-text-h">Buyer guide & FAQs</a>
              <a href="#" className="block rounded-md px-2 py-2 text-sm text-text hover:bg-bg-soft hover:text-text-h">How bidding works</a>
              <a href="#" className="block rounded-md px-2 py-2 text-sm text-text hover:bg-bg-soft hover:text-text-h">Contact KajuMart support</a>
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-text hover:bg-bg-soft"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 z-20 mt-2 w-80 rounded-card border border-border bg-white shadow-pop">
              <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                <p className="text-sm font-semibold text-text-h">Notifications</p>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className={`flex gap-2 border-b border-border px-3 py-2.5 last:border-0 ${!n.read ? "bg-brand-50/40" : ""}`}>
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? "bg-border" : "bg-brand-600"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-h">{n.title}</p>
                      <p className="line-clamp-2 text-xs text-text">{n.message}</p>
                      <p className="mt-0.5 text-[11px] text-text/60">{timeAgo(n.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/notifications"
                onClick={() => setNotifOpen(false)}
                className="block px-3 py-2.5 text-center text-xs font-medium text-brand-600 hover:bg-bg-soft"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Switch to Seller */}
        <Link
          to="#"
          className="ml-1 hidden items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-text-h hover:border-brand-200 hover:bg-brand-50 sm:flex"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Switch to Seller
        </Link>
        <Link
          to="#"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-h hover:border-brand-200 hover:bg-brand-50 sm:hidden"
          aria-label="Switch to seller dashboard"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Link>

        {/* Profile */}
        <Link
          to="/account"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white"
        >
          NK
        </Link>
      </div>
    </header>
  );
}
