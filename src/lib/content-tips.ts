import type { Platform } from "./types";

export const PLATFORMS: { id: Platform; label: string; blurb: string }[] = [
  { id: "facebook", label: "Facebook", blurb: "Clear, informative posts for your community" },
  { id: "instagram", label: "Instagram", blurb: "Visual posts with engaging captions" },
  { id: "tiktok", label: "TikTok", blurb: "Short videos that show your business in action" },
];

export const PLATFORM_TIPS: Record<Platform, string[]> = {
  facebook: [
    "Clearly explain the value of the product or service.",
    "Use images that show the product or business.",
    "Include important information such as price, location or availability when relevant.",
    "Use a clear call to action, e.g. \"Message us to order\".",
    "Keep promotional posts easy to understand.",
  ],
  instagram: [
    "Use strong, visually appealing images.",
    "Keep captions engaging and easy to read.",
    "Use relevant hashtags so new people can find you.",
    "Show products, services or behind-the-scenes business content.",
    "Include a clear call to action, e.g. \"Link in bio\" or \"DM to order\".",
  ],
  tiktok: [
    "Capture attention within the first few seconds.",
    "Keep videos focused and engaging.",
    "Show the product or service in action.",
    "Use relevant trends when they make sense for the business.",
    "Demonstrate processes, transformations or behind-the-scenes moments.",
    "Finish with a clear call to action.",
  ],
};

export const DASHBOARD_TIPS = [
  "Posts showing your product in use can help customers understand its value.",
  "Keep promotional captions simple and include a clear call to action.",
  "Post consistently — two or three good posts a week beats ten rushed ones.",
  "Reply to comments and messages quickly. It builds trust with new customers.",
  "Show the people behind the business. Customers connect with faces, not logos.",
  "Add your location and contact details to any post announcing an offer.",
  "Before-and-after photos work well for services like cleaning, beauty and repairs.",
  "Review your goals weekly so small wins stay visible.",
];

export function tipOfTheDay(): string {
  const day = Math.floor(Date.now() / 86_400_000);
  return DASHBOARD_TIPS[day % DASHBOARD_TIPS.length] ?? "";
}

const CATEGORY_TIPS: Record<string, string[]> = {
  "Food & Beverage": [
    "Include the price and ordering deadline when you post a daily or weekly special.",
    "Photograph your best-selling item in natural light and add a clear order method.",
  ],
  "Retail / Shop": [
    "Show one product at a time with its price, key benefit and availability.",
    "Mention stock levels when they are limited so customers know when to act.",
  ],
  "Beauty & Hair": [
    "Before-and-after photos work best when the lighting and camera angle stay consistent.",
    "Add your location, booking method and available appointment times to service posts.",
  ],
  "Fashion & Clothing": [
    "Show the same item styled in two ways and include available sizes in the caption.",
    "Add size, price and delivery details to every product post.",
  ],
  "Home Services": [
    "Show the result of a completed job and state which areas you serve.",
    "Ask satisfied customers for permission to share a short review with a job photo.",
  ],
  "Professional Services": [
    "Turn one common customer question into a short, practical post each week.",
    "Describe the outcome of your service in plain language before listing its features.",
  ],
};

export function businessTip(category: string | null | undefined): string {
  const day = Math.floor(Date.now() / 86_400_000);
  const relevant = category ? CATEGORY_TIPS[category] : undefined;
  if (relevant?.length) return relevant[day % relevant.length] ?? relevant[0] ?? tipOfTheDay();
  return tipOfTheDay();
}
