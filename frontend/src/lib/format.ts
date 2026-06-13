export function formatLkr(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

export function formatLkrPerMt(amount: number): string {
  return `${formatLkr(amount)} / MT`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-LK", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export interface CountdownParts {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export function getCountdownParts(endIso: string, now: number): CountdownParts {
  const totalMs = new Date(endIso).getTime() - now;
  if (totalMs <= 0) {
    return { totalMs: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { totalMs, hours, minutes, seconds, expired: false };
}

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}
