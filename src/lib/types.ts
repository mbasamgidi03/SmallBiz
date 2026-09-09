import type { Tables } from "@/integrations/supabase/types";

export type BusinessProfile = Tables<"business_profiles">;
export type Goal = Tables<"goals">;
export type Activity = Tables<"activities">;
export type ContentPiece = Tables<"content_pieces">;
export type PosterRow = Tables<"posters">;

export type GoalStatus = "active" | "completed";
export type ValueType = "currency" | "number";

export const GOAL_CATEGORIES = [
  "Sales",
  "Revenue",
  "Customers",
  "Social Media Growth",
  "Orders",
  "Savings",
  "Custom Goal",
] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const BUSINESS_CATEGORIES = [
  "Food & Beverage",
  "Retail / Shop",
  "Beauty & Hair",
  "Fashion & Clothing",
  "Home Services",
  "Health & Fitness",
  "Professional Services",
  "Arts & Crafts",
  "Events",
  "Education & Tutoring",
  "Transport & Logistics",
  "Other",
] as const;

export type Platform = "facebook" | "instagram" | "tiktok";

export interface GeneratedContent {
  idea: string;
  caption: string;
  callToAction: string;
  hashtags: string[];
  videoConcept?: string | undefined;
}

export const BRAND_COLOR_PRESETS = [
  { name: "Forest", hex: "#1d6f5c" },
  { name: "Ocean", hex: "#1f5fa8" },
  { name: "Navy", hex: "#243b6b" },
  { name: "Terracotta", hex: "#c2552f" },
  { name: "Plum", hex: "#7a3b69" },
  { name: "Mustard", hex: "#b7791f" },
  { name: "Slate", hex: "#3f4a5a" },
  { name: "Crimson", hex: "#b3283f" },
] as const;
