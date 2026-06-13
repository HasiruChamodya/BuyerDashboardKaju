import { NavLink } from "react-router-dom";
import {
  Gavel,
  Truck,
  Heart,
  MessageSquare,
  UserCircle,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Sprout,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Gavel;
  badgeKey?: "watchlist" | "notifications" | "messages";
}

const primaryNav: NavItem[] = [
  { to: "/auctions", label: "My Auctions", icon: Gavel },
];

const activityNav: NavItem[] = [
  { to: "/orders", label: "Orders & Logistics", icon: Truck },
  { to: "/watchlist", label: "Watchlist / Saved Lots", icon: Heart, badgeKey: "watchlist" },
  { to: "/messages", label: "Messaging Desk", icon: MessageSquare, badgeKey: "messages" },
];

const accountNav: NavItem[] = [
  { to: "/account", label: "Account Profiles", icon: UserCircle },
  { to: "/notifications", label: "Alerts & Notifications", icon: Bell, badgeKey: "notifications" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export default function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const { watchlist, unreadCount, notifications } = useApp();
  const unreadMessages = notifications.filter((n) => n.type === "message" && !n.read).length;

  function badgeFor(key?: NavItem["badgeKey"]): number | null {
    switch (key) {
      case "watchlist":
        return watchlist.length > 0 ? watchlist.length : null;
      case "notifications":
        return unreadCount > 0 ? unreadCount : null;
      case "messages":
        return unreadMessages > 0 ? unreadMessages : null;
      default:
        return null;
    }
  }

  function renderGroup(title: string, items: NavItem[]) {
    return (
      <div className="px-2">
        {!collapsed && (
          <p className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-text/60">
            {title}
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const badge = badgeFor(item.badgeKey);
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-600"
                        : "text-text hover:bg-bg-soft hover:text-text-h"
                    } ${collapsed ? "justify-center" : ""}`
                  }
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {badge !== null && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white ${
                        collapsed ? "absolute right-1 top-1" : ""
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-white transition-all duration-200 ${
        collapsed ? "w-[68px]" : "w-64"
      }`}
    >
      <div className={`flex h-16 items-center gap-2 border-b border-border px-4 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white">
          <Sprout className="h-4.5 w-4.5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-bold text-text-h">KajuMart</p>
            <p className="text-[11px] text-text">Buyer Dashboard</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto pb-4">
        {renderGroup("Primary", primaryNav)}
        {renderGroup("Activity", activityNav)}
        {renderGroup("Account", accountNav)}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={onToggle}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text hover:bg-bg-soft hover:text-text-h ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? <ChevronsRight className="h-4.5 w-4.5" /> : <ChevronsLeft className="h-4.5 w-4.5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
