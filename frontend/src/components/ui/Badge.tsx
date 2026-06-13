import { CheckCircle2 } from "lucide-react";
import type { CashewGrade, ProcessingType } from "../../types";

/** Grade badge styled like a small ledger / weighbridge stamp. */
export function GradeStamp({ grade }: { grade: CashewGrade }) {
  return (
    <span className="mono-num inline-flex items-center justify-center rounded border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-brand-600">
      {grade}
    </span>
  );
}

const processingColors: Record<ProcessingType, string> = {
  Raw: "bg-bg-soft text-text border-border",
  Roasted: "bg-amber-50 text-amber-600 border-amber-100",
  Baked: "bg-amber-50 text-amber-600 border-amber-100",
  Flavoured: "bg-brand-50 text-brand-600 border-brand-100",
};

export function ProcessingPill({ type }: { type: ProcessingType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${processingColors[type]}`}
    >
      {type}
    </span>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600">
      <CheckCircle2 className="h-3 w-3" />
      Verified
    </span>
  );
}

export function ListingTypeTag({ type }: { type: "fixed" | "auction" }) {
  if (type === "auction") {
    return (
      <span className="inline-flex items-center rounded-full bg-text-h px-2.5 py-0.5 text-[11px] font-medium text-white">
        Live Auction
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-text">
      Fixed Price
    </span>
  );
}
