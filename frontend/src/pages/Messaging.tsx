import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, Tag } from "lucide-react";
import { conversations as initialConversations, listings } from "../data/mockData";
import type { Conversation } from "../types";
import { timeAgo, formatDateTime } from "../lib/format";
import Button from "../components/ui/Button";

export default function Messaging() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string>(initialConversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const relatedListing = active?.relatedLot ? listings.find((l) => l.id === active.relatedLot) : undefined;

  function selectConversation(id: string) {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  function handleSend() {
    if (!draft.trim() || !active) return;
    const text = draft.trim();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              lastMessage: text,
              lastTimestamp: new Date().toISOString(),
              messages: [
                ...c.messages,
                { id: `m-${Date.now()}`, from: "buyer", text, timestamp: new Date().toISOString() },
              ],
            }
          : c
      )
    );
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text-h">Messaging Desk</h1>
        <p className="mt-1 text-sm text-text">Communicate directly with vendors about lots, quotes, and dispatches.</p>
      </div>

      <div className="grid h-[calc(100vh-220px)] min-h-[480px] grid-cols-1 overflow-hidden rounded-card border border-border bg-white shadow-card md:grid-cols-[300px_1fr]">
        {/* Conversation list */}
        <div className="overflow-y-auto border-b border-border md:border-b-0 md:border-r">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConversation(c.id)}
              className={`flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors ${
                c.id === active?.id ? "bg-brand-50" : "hover:bg-bg-soft"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm font-medium text-text-h">
                  {c.vendorName}
                  {c.vendorVerified && <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" />}
                </span>
                <span className="text-[11px] text-text">{timeAgo(c.lastTimestamp)}</span>
              </div>
              <p className="truncate text-xs text-text">{c.lastMessage}</p>
              {c.unread > 0 && (
                <span className="mt-1 inline-flex w-fit items-center rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {c.unread} new
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active thread */}
        <div className="flex flex-col">
          {active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-text-h">{active.vendorName}</span>
                  {active.vendorVerified && <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" />}
                </div>
                {relatedListing && (
                  <Link
                    to={`/marketplace/${relatedListing.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-text hover:border-brand-200 hover:bg-brand-50"
                  >
                    <Tag className="h-3 w-3" />
                    {relatedListing.title}
                  </Link>
                )}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "buyer" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-card px-3 py-2 text-sm ${
                        m.from === "buyer"
                          ? "bg-brand-600 text-white"
                          : "border border-border bg-bg-soft text-text-h"
                      }`}
                    >
                      <p>{m.text}</p>
                      <p
                        className={`mt-1 text-[10px] ${
                          m.from === "buyer" ? "text-brand-100" : "text-text"
                        }`}
                      >
                        {formatDateTime(m.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message…"
                  className="flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm text-text-h placeholder:text-text focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
                <Button variant="primary" size="sm" icon={<Send className="h-3.5 w-3.5" />} onClick={handleSend}>
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-text">
              Select a conversation to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
