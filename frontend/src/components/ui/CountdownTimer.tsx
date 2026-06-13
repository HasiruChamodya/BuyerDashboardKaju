import { useEffect, useState } from "react";
import { getCountdownParts, pad2 } from "../../lib/format";

interface CountdownTimerProps {
  endsAt: string;
  size?: "sm" | "md";
}

export default function CountdownTimer({ endsAt, size = "md" }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, seconds, expired, totalMs } = getCountdownParts(endsAt, now);
  const urgent = !expired && totalMs < 1000 * 60 * 10; // under 10 minutes

  if (expired) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-text/10 px-2.5 py-1 font-medium text-text ${
          size === "sm" ? "text-[11px]" : "text-xs"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-text/40" />
        Lot closed
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
        urgent
          ? "bg-danger-50 text-danger-600"
          : "bg-amber-50 text-amber-600"
      } ${size === "sm" ? "text-[11px]" : "text-xs"}`}
      aria-live="polite"
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          urgent ? "bg-danger-500 animate-pulse" : "bg-amber-400"
        }`}
      />
      <span className="mono-num">
        {hours > 0 ? `${pad2(hours)}:` : ""}
        {pad2(minutes)}:{pad2(seconds)}
      </span>
      <span className="hidden sm:inline">{urgent ? "— closing now" : "remaining"}</span>
    </span>
  );
}
