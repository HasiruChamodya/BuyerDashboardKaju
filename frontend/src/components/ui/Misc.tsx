import { Star, Image as ImageIcon, Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function RatingStars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-text">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-text-h">{rating.toFixed(1)}</span>
      {reviews !== undefined && <span>({reviews})</span>}
    </span>
  );
}

/** Placeholder for product imagery — keeps layout proportions without external assets. */
export function ImagePlaceholder({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 bg-brand-50 text-brand-300 ${className}`}
    >
      <ImageIcon className="h-6 w-6" />
      {label && <span className="text-[11px] font-medium text-brand-400">{label}</span>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-soft text-text">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text-h">{title}</h3>
        <p className="max-w-sm text-sm text-text">{description}</p>
      </div>
      {action}
    </div>
  );
}
