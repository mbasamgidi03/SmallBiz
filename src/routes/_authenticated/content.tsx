import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { contentQuery, logActivity, useProfile } from "@/lib/queries";
import { generateContent } from "@/lib/content.functions";
import { PLATFORMS, PLATFORM_TIPS } from "@/lib/content-tips";
import type { GeneratedContent, Platform } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, SectionCard } from "@/components/app/PageHeader";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/content")({
  head: () => ({
    meta: [
      { title: "Create Content — SmallBiz" },
      { name: "description", content: "Learn what works on Facebook, Instagram and TikTok, then generate ready-to-post content." },
      { property: "og:title", content: "Create Content — SmallBiz" },
      { property: "og:description", content: "Generate social media content for your small business." },
    ],
  }),
  component: ContentPage,
});

function ContentPage() {
  const { user } = useAuth();
  const profile = useProfile(user?.id);
  const history = useQuery(contentQuery(user?.id));
  const qc = useQueryClient();
  const generate = useServerFn(generateContent);

  const [platform, setPlatform] = useState<Platform>("facebook");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState("");
  const [extra, setExtra] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);

  const platformLabel = PLATFORMS.find((p) => p.id === platform)!.label;

  const run = async () => {
    if (!topic.trim() || !message.trim()) {
      toast.error("Please add a topic and the main message.");
      return;
    }
    const p = profile.data;
    setBusy(true);
    try {
      const out = await generate({
        data: {
          platform,
          topic,
          message,
          offer,
          extra,
          business: {
            name: p?.business_name ?? "",
            category: p?.category ?? "",
            description: p?.description ?? "",
            products: p?.products_services ?? "",
            audience: p?.target_audience ?? "",
            location: p?.location ?? "",
            phone: p?.phone ?? "",
          },
        },
      });
      setResult(out);
      if (user) {
        await supabase.from("content_pieces").insert({
          user_id: user.id,
          platform,
          topic,
          message,
          offer,
          extra,
          result: out as unknown as Record<string, unknown>,
        });
        await logActivity(user.id, "content", `Created ${platformLabel} content: ${topic}`);
        qc.invalidateQueries({ queryKey: ["content", user.id] });
        qc.invalidateQueries({ queryKey: ["activities", user.id] });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate content");
    } finally {
      setBusy(false);
    }
  };

  const loadPrevious = (row: NonNullable<typeof history.data>[number]) => {
    setPlatform(row.platform as Platform);
    setTopic(row.topic);
    setMessage(row.message);
    setOffer(row.offer);
    setExtra(row.extra);
    setResult(row.result as unknown as GeneratedContent);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader
        title="Create Content"
        description="Pick a platform, tell us what you want to say, and get a ready-to-post draft."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <SectionCard title="1. Choose a platform">
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`rounded-md border p-3 text-left transition-colors ${
                    platform === p.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  <span className="block text-sm font-semibold">{p.label}</span>
                  <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{p.blurb}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-md bg-muted/60 p-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What works on {platformLabel}
              </p>
              <ul className="space-y-1 text-sm">
                {PLATFORM_TIPS[platform].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="2. What do you want to post about?">
            <div className="space-y-4">
              <Field label="Topic or product">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Weekend special on birthday cakes"
                />
              </Field>
              <Field label="Main message">
                <Textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. We bake fresh every morning and deliver in the area."
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Offer or promotion" optional>
                  <Input
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="e.g. 10% off orders before Friday"
                  />
                </Field>
                <Field label="Anything else to include" optional>
                  <Input
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                    placeholder="e.g. Mention we take card payments"
                  />
                </Field>
              </div>
              <Button onClick={run} disabled={busy} className="w-full sm:w-auto">
                <Sparkles className="h-4 w-4" />
                {busy ? "Writing your content…" : `Generate ${platformLabel} content`}
              </Button>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard
            title="3. Your content"
            description={result ? "Copy what you need and post it on your page." : undefined}
          >
            {!result ? (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                {busy ? "Working on it…" : "Your draft will appear here."}
              </div>
            ) : (
              <div className="space-y-4">
                <ResultBlock label="Post idea" text={result.idea} />
                {result.videoConcept && <ResultBlock label="Video concept" text={result.videoConcept} />}
                <ResultBlock label="Caption" text={result.caption} multiline />
                <ResultBlock label="Call to action" text={result.callToAction} />
                <ResultBlock label="Hashtags" text={result.hashtags.join(" ")} />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    copy(
                      [result.caption, result.callToAction, result.hashtags.join(" ")].join("\n\n"),
                      "Full post copied",
                    )
                  }
                >
                  <Copy className="h-4 w-4" /> Copy full post
                </Button>
              </div>
            )}
          </SectionCard>

          {history.data && history.data.length > 0 && (
            <SectionCard title="Recent content">
              <ul className="divide-y">
                {history.data.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => loadPrevious(row)}
                      className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 py-2 text-left hover:text-primary"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{row.topic}</span>
                        <span className="block text-xs capitalize text-muted-foreground">{row.platform}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{timeAgo(row.created_at)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

async function copy(text: string, msg = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(msg);
  } catch {
    toast.error("Could not copy. Please select the text manually.");
  }
}

function ResultBlock({ label, text, multiline }: { label: string; text: string; multiline?: boolean }) {
  return (
    <div className="rounded-md border bg-muted/40 p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={() => copy(text)}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Copy className="h-3 w-3" /> Copy
        </button>
      </div>
      <p className={`text-sm ${multiline ? "whitespace-pre-wrap" : ""}`}>{text}</p>
    </div>
  );
}
