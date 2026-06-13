import { useMemo, useState } from "react";
import {
  Bell,
  Gavel,
  Timer,
  Package,
  MessageSquare,
  Info,
} from "lucide-react";
import type { NotificationType } from "../types";
import { timeAgo } from "../lib/format";
import { useApp } from "../context/AppContext";
import Button from "../components/ui/Button";
import { EmptyState } from "../components/ui/Misc";

const FILTERS: { label: string; value: "all" | NotificationType }[] = [
  { label: "All", value: "all" },
  { label: "Outbid alerts", value: "outbid" },
  { label: "Auctions ending", value: "auction-ending" },
  { label: "Order updates", value: "order-update" },
  { label: "Messages", value: "message" },
  { label: "System", value: "system" },
];

const typeMeta: Record<NotificationType, { icon: typeof Bell; classes: string }> = {
  outbid: { icon: Gavel, classes: "bg-danger-50 text-danger-500" },
  "auction-ending": { icon: Timer, classes: "bg-amber-50 text-amber-500" },
  "order-update": { icon: Package, classes: "bg-brand-50 text-brand-600" },
  message: { icon: MessageSquare, classes: "bg-brand-50 text-brand-600" },
  system: { icon: Info, classes: "bg-bg-soft text-text" },
};

export default function Notifications() {
  const { notifications, unreadCount, markAllNotificationsRead, markNotificationRead } = useApp();
  const [filter, setFilter] = useState<"all" | NotificationType>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-h">Alerts &amp; Notifications</h1>
          <p className="mt-1 text-sm text-text">
            Outbid alerts, auction countdowns, order status changes, and vendor messages — all in one place.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border bg-white text-text hover:border-brand-200 hover:bg-brand-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title="Nothing here"
          description="You're all caught up — there are no notifications matching this filter."
        />
      ) : (
        <div className="divide-y divide-border rounded-card border border-border bg-white shadow-card">
          {filtered.map((n) => {
            const meta = typeMeta[n.type];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-bg-soft ${
                  n.read ? "" : "bg-brand-50/40"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.classes}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text-h">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
                  </div>
                  <p className="mt-0.5 text-xs text-text">{n.message}</p>
                  <p className="mt-1 text-[11px] text-text">{timeAgo(n.timestamp)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
