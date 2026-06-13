import { useState, useMemo } from "react";
import { Gavel, TrendingUp, Trophy, XCircle, Clock } from "lucide-react";
import { userBids } from "../data/mockData";
import type { UserBid } from "../types";
import CountdownTimer from "../components/ui/CountdownTimer";
import { GradeStamp, ProcessingPill } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { formatLkrPerMt, timeAgo } from "../lib/format";

function statusConfig(status: UserBid["status"]) {
  switch (status) {
    case "winning":
      return { label: "Winning", color: "bg-emerald-100 text-emerald-700" };
    case "outbid":
      return { label: "Outbid", color: "bg-amber-100 text-amber-700" };
    case "won":
      return { label: "Won", color: "bg-brand-100 text-brand-700" };
    case "lost":
      return { label: "Lost", color: "bg-danger-100 text-danger-600" };
  }
}

interface BidCardProps {
  bid: UserBid;
  onRebid?: (bid: UserBid, amount: number) => void;
}

function ActiveBidCard({ bid, onRebid }: BidCardProps) {
  const cfg = statusConfig(bid.status);
  const minNext = bid.currentHighBidPerMt + bid.minIncrementPerMt;
  const [rebidAmount, setRebidAmount] = useState(minNext);
  const [rebidPlaced, setRebidPlaced] = useState(false);
  const isOutbid = bid.status === "outbid";

  function handleRebid() {
    if (rebidAmount < minNext) return;
    setRebidPlaced(true);
    onRebid?.(bid, rebidAmount);
    setTimeout(() => setRebidPlaced(false), 2500);
  }

  return (
    <div className="rounded-card border border-border bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <GradeStamp grade={bid.grade} />
          <ProcessingPill type={bid.processingType} />
          <p className="truncate text-sm font-semibold text-text-h">{bid.listingTitle}</p>
        </div>
        <span className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-text">{bid.vendorName} · {bid.vendorLocation}</p>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-text">My Bid</p>
              <p className="mono-num font-bold text-text-h">{formatLkrPerMt(bid.myBidPerMt)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-text">Current High</p>
              <p className={`mono-num font-bold ${isOutbid ? "text-danger-500" : "text-emerald-600"}`}>
                {formatLkrPerMt(bid.currentHighBidPerMt)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-text">Total Bids</p>
              <p className="mono-num font-bold text-text-h">{bid.bidCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <CountdownTimer endsAt={bid.auctionEndsAt} />
          </div>
          <p className="text-[11px] text-text/60">Bid placed {timeAgo(bid.placedAt)}</p>
        </div>

        {isOutbid && (
          <div className="flex flex-col gap-2 rounded-card border border-amber-200 bg-amber-50 p-3 sm:w-56">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Place a new bid</p>
            <input
              type="number"
              value={rebidAmount}
              step={bid.minIncrementPerMt}
              onChange={(e) => setRebidAmount(Number(e.target.value))}
              className="mono-num w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-sm font-semibold text-text-h focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <p className="text-[11px] text-text">
              Min: <span className="mono-num font-medium text-text-h">{formatLkrPerMt(minNext)}</span>
            </p>
            <Button size="sm" onClick={handleRebid} icon={<TrendingUp className="h-3.5 w-3.5" />}>
              {rebidPlaced ? "Bid placed!" : "Rebid"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PastBidCard({ bid }: { bid: UserBid }) {
  const cfg = statusConfig(bid.status);
  const won = bid.status === "won";

  return (
    <div className={`rounded-card border bg-white shadow-card ${won ? "border-brand-200" : "border-border"}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <GradeStamp grade={bid.grade} />
          <ProcessingPill type={bid.processingType} />
          <p className="truncate text-sm font-semibold text-text-h">{bid.listingTitle}</p>
        </div>
        <span className={`ml-3 shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.color}`}>
          {won ? <Trophy className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-text">My Bid</p>
          <p className="mono-num font-bold text-text-h">{formatLkrPerMt(bid.myBidPerMt)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-text">Winning Bid</p>
          <p className={`mono-num font-bold ${won ? "text-brand-600" : "text-text-h"}`}>
            {formatLkrPerMt(bid.currentHighBidPerMt)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-text">Vendor</p>
          <p className="truncate text-text-h">{bid.vendorName}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-text">Closed</p>
          <p className="text-text-h">{timeAgo(bid.auctionEndsAt)}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuctionDesk() {
  const activeBids = useMemo(
    () =>
      userBids
        .filter((b) => b.status === "winning" || b.status === "outbid")
        .sort((a, b) => new Date(a.auctionEndsAt).getTime() - new Date(b.auctionEndsAt).getTime()),
    []
  );

  const pastBids = useMemo(
    () =>
      userBids
        .filter((b) => b.status === "won" || b.status === "lost")
        .sort((a, b) => new Date(b.auctionEndsAt).getTime() - new Date(a.auctionEndsAt).getTime()),
    []
  );

  const outbidCount = activeBids.filter((b) => b.status === "outbid").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-text-h">My Auctions</h1>
        <p className="mt-1 text-sm text-text">
          Track your active bids and review past auction results.
        </p>
      </div>

      {outbidCount > 0 && (
        <div className="flex items-center gap-3 rounded-card border border-amber-200 bg-amber-50 px-4 py-3">
          <Gavel className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            You've been outbid on <strong>{outbidCount}</strong> active auction{outbidCount > 1 ? "s" : ""}.
            Place a new bid to stay in the running.
          </p>
        </div>
      )}

      {/* Active bids */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-text-h">
          Active Bids{" "}
          <span className="text-sm font-normal text-text">({activeBids.length})</span>
        </h2>
        {activeBids.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-border py-12 text-center">
            <Gavel className="h-8 w-8 text-text/30" />
            <p className="text-sm font-medium text-text-h">No active bids</p>
            <p className="text-xs text-text">You haven't placed any bids on live auctions yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeBids.map((bid) => (
              <ActiveBidCard key={bid.id} bid={bid} />
            ))}
          </div>
        )}
      </section>

      {/* Past bids */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-text-h">
          Past Auctions{" "}
          <span className="text-sm font-normal text-text">({pastBids.length})</span>
        </h2>
        {pastBids.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-border py-12 text-center">
            <p className="text-sm text-text">No past auction history.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pastBids.map((bid) => (
              <PastBidCard key={bid.id} bid={bid} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
