import type { GoalCategory, ValueType } from "./types";

export function formatValue(value: number, type: ValueType | string): string {
  const n = Number(value) || 0;
  const formatted = n.toLocaleString("en-ZA", { maximumFractionDigits: 0 });
  return type === "currency" ? `R${formatted}` : formatted;
}

export function goalPercent(current: number, target: number): number {
  const t = Number(target) || 0;
  if (t <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((Number(current) / t) * 100)));
}

export function defaultValueType(category: GoalCategory | string): ValueType {
  return category === "Sales" || category === "Revenue" || category === "Savings"
    ? "currency"
    : "number";
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "No date";
  const d = new Date(date);
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}

/* ---------- Brand colour helpers ---------- */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function isDarkColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.6;
}

export function contrastText(hex: string): string {
  return isDarkColor(hex) ? "#ffffff" : "#1a1a1a";
}

