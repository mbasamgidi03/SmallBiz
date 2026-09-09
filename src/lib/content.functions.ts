import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { GeneratedContent } from "./types";

const inputSchema = z.object({
  platform: z.enum(["facebook", "instagram", "tiktok"]),
  topic: z.string().min(1).max(300),
  message: z.string().min(1).max(600),
  offer: z.string().max(300).optional().default(""),
  extra: z.string().max(600).optional().default(""),
  business: z.object({
    name: z.string().max(120),
    category: z.string().max(120),
    description: z.string().max(600),
    products: z.string().max(600),
    audience: z.string().max(300),
    location: z.string().max(200),
    phone: z.string().max(60),
  }),
});

const PLATFORM_GUIDE: Record<string, string> = {
  facebook:
    "Facebook post. Clearly explain value, mention price/location/availability when relevant, plain language, clear call to action. Hashtags: 2-4 at most.",
  instagram:
    "Instagram post. Engaging, easy-to-read caption with short lines, strong visual suggestion, 8-12 relevant hashtags, clear call to action (DM / link in bio).",
  tiktok:
    "TikTok video. Provide a strong opening hook for the first 2 seconds, a short video concept showing the product/service in action or a behind-the-scenes moment, a short on-screen caption, 4-6 hashtags and a clear call to action at the end.",
};

export const generateContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<GeneratedContent> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Content generation is not configured yet.");

    const b = data.business;
    const system = `You help South African small-business owners write simple, effective social media content. Write in plain, friendly English. Currency is Rand (R). Never invent prices, addresses or phone numbers that were not provided. Keep it practical and free of marketing jargon.`;

    const user = `Business context:
- Name: ${b.name || "Not provided"}
- Type: ${b.category || "Not provided"}
- About: ${b.description || "Not provided"}
- Products/services: ${b.products || "Not provided"}
- Target audience: ${b.audience || "Not provided"}
- Location: ${b.location || "Not provided"}
- Contact: ${b.phone || "Not provided"}

Platform guidance: ${PLATFORM_GUIDE[data.platform]}

What to promote: ${data.topic}
Main message: ${data.message}
Special offer: ${data.offer || "None"}
Additional information: ${data.extra || "None"}

Return ONLY a JSON object with these keys:
{"idea": "one or two sentences describing the content idea (what to show/post)", "caption": "the ready-to-use caption text", "callToAction": "one short call-to-action sentence", "hashtags": ["#tag", ...]${data.platform === "tiktok" ? ', "videoConcept": "hook for the first 2 seconds, then 3-5 short numbered shots/steps for the video"' : ""}}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Too many requests right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI usage limit reached. Please add credits to continue.");
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      throw new Error("Could not generate content. Please try again.");
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as Partial<GeneratedContent>;

    return {
      idea: parsed.idea ?? "",
      caption: parsed.caption ?? "",
      callToAction: parsed.callToAction ?? "",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : [],
      videoConcept: parsed.videoConcept,
    };
  });
