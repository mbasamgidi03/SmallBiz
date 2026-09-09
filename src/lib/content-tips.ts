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
  return DASHBOARD_TIPS[day % DASHBOARD_TIPS.length];
}
