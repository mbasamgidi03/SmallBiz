import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Download, ImagePlus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { useAuth } from "@/hooks/useAuth";
import { latestPosterQuery, logActivity, useProfile } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, PageHeader, SectionCard } from "@/components/app/PageHeader";
import { BrandColorPicker } from "@/components/business/BrandColorPicker";
import {
  POSTER_H,
  POSTER_TEMPLATES,
  POSTER_W,
  PosterCanvas,
  type PosterColors,
  type PosterFields,
  type PosterTemplate,
} from "@/components/poster/PosterCanvas";

export const Route = createFileRoute("/_authenticated/poster")({
  head: () => ({
    meta: [
      { title: "Create Poster — SmallBiz" },
      { name: "description", content: "Design a professional advertising poster for your business and download it as an image." },
      { property: "og:title", content: "Create Poster — SmallBiz" },
      { property: "og:description", content: "Design and download a poster for your business." },
    ],
  }),
  component: PosterPage,
});

const emptyFields: PosterFields = {
  headline: "",
  subheading: "",
  offer: "",
  businessName: "",
  contact: "",
  location: "",
  image: null,
};

function PosterPage() {
  const { user } = useAuth();
  const profile = useProfile(user?.id);
  const saved = useQuery(latestPosterQuery(user?.id));
  const qc = useQueryClient();

  const [template, setTemplate] = useState<PosterTemplate>("bold");
  const [fields, setFields] = useState<PosterFields>(emptyFields);
  const [colors, setColors] = useState<PosterColors>({
    brand: "#1d6f5c",
    background: "#ffffff",
    text: "#1a1a1a",
  });
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  // Prefill from saved poster, otherwise from business profile
  useEffect(() => {
    if (hydrated || profile.isPending || saved.isPending) return;
    const p = profile.data;
    if (saved.data) {
      setTemplate(saved.data.template as PosterTemplate);
      setFields({ ...emptyFields, ...(saved.data.fields as Partial<PosterFields>), image: null });
      setColors({ ...colors, ...(saved.data.colors as Partial<PosterColors>) });
    } else if (p) {
      setFields((f) => ({
        ...f,
        businessName: p.business_name,
        contact: p.phone,
        location: p.location,
      }));
      setColors((c) => ({ ...c, brand: p.brand_color }));
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.isPending, saved.isPending, profile.data, saved.data, hydrated]);

  // Scale the fixed-size poster to fit its container
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / POSTER_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const patch = (p: Partial<PosterFields>) => setFields((f) => ({ ...f, ...p }));

  const onImage = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      toast.error("Please choose an image under 6 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const download = async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        width: POSTER_W,
        height: POSTER_H,
        pixelRatio: 2,
        cacheBust: true,
        style: { transform: "none" },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${(fields.businessName || "poster").replace(/\s+/g, "-").toLowerCase()}-poster.png`;
      a.click();
      if (user) {
        await logActivity(user.id, "poster", `Downloaded poster: ${fields.headline || "Untitled"}`);
        qc.invalidateQueries({ queryKey: ["activities", user.id] });
      }
      toast.success("Poster downloaded");
    } catch {
      toast.error("Could not export the poster. Try again or remove the photo.");
    } finally {
      setExporting(false);
    }
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { image: _img, ...rest } = fields;
      const payload = { user_id: user.id, template, fields: rest, colors };
      const q = saved.data
        ? supabase.from("posters").update(payload).eq("id", saved.data.id)
        : supabase.from("posters").insert(payload);
      const { error } = await q;
      if (error) throw error;
      await logActivity(user.id, "poster", `Saved poster: ${fields.headline || "Untitled"}`);
      qc.invalidateQueries({ queryKey: ["poster", user.id] });
      qc.invalidateQueries({ queryKey: ["activities", user.id] });
      toast.success("Poster saved (photo is not stored — re-add it next time)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save poster");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Create Poster"
        description="Fill in the details, pick a style and download a ready-to-print or share image."
        actions={
          <>
            <Button variant="outline" onClick={save} disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </Button>
            <Button onClick={download} disabled={exporting}>
              <Download className="h-4 w-4" /> {exporting ? "Preparing…" : "Download PNG"}
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-5">
          <SectionCard title="Style">
            <div className="grid grid-cols-3 gap-2">
              {POSTER_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`rounded-md border p-3 text-left transition-colors ${
                    template === t.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-accent"
                  }`}
                >
                  <span className="block text-sm font-semibold">{t.label}</span>
                  <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{t.blurb}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Poster colour</p>
              <BrandColorPicker value={colors.brand} onChange={(hex) => setColors((c) => ({ ...c, brand: hex }))} />
            </div>
          </SectionCard>

          <SectionCard title="Poster text">
            <div className="space-y-4">
              <Field label="Headline">
                <Input
                  value={fields.headline}
                  onChange={(e) => patch({ headline: e.target.value })}
                  placeholder="e.g. Fresh Cakes Baked Daily"
                  maxLength={60}
                />
              </Field>
              <Field label="Subheading" optional>
                <Input
                  value={fields.subheading}
                  onChange={(e) => patch({ subheading: e.target.value })}
                  placeholder="e.g. Order today, collect tomorrow"
                  maxLength={90}
                />
              </Field>
              <Field label="Price or offer" optional>
                <Input
                  value={fields.offer}
                  onChange={(e) => patch({ offer: e.target.value })}
                  placeholder="e.g. From R150 · 10% off this week"
                  maxLength={50}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name">
                  <Input value={fields.businessName} onChange={(e) => patch({ businessName: e.target.value })} />
                </Field>
                <Field label="Contact details">
                  <Input value={fields.contact} onChange={(e) => patch({ contact: e.target.value })} />
                </Field>
              </div>
              <Field label="Location" optional>
                <Input value={fields.location} onChange={(e) => patch({ location: e.target.value })} />
              </Field>
              <div>
                <p className="mb-1.5 text-sm font-medium">Photo</p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
                    <ImagePlus className="h-4 w-4" />
                    {fields.image ? "Change photo" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => onImage(e.target.files?.[0])}
                    />
                  </label>
                  {fields.image && (
                    <Button variant="ghost" size="sm" onClick={() => patch({ image: null })}>
                      <X className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  A photo of your product, shop or team works best.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Preview" description="This is exactly what you'll download." className="lg:sticky lg:top-6 lg:self-start">
          <div ref={frameRef} className="w-full">
            <div
              className="mx-auto overflow-hidden rounded-md border shadow-card"
              style={{ width: POSTER_W * scale, height: POSTER_H * scale }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
                <PosterCanvas ref={canvasRef} template={template} fields={fields} colors={colors} />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
