import { forwardRef } from "react";
import { contrastText, hexToRgb, isDarkColor } from "@/lib/format";

export type PosterTemplate = "image-focus" | "promotion" | "clean";

export type PosterFields = {
  headline: string;
  subheading: string;
  offer: string;
  cta: string;
  businessName: string;
  contact: string;
  location: string;
  image: string | null; // data URL
};

export type PosterColors = {
  brand: string;
  background: string;
  text: string;
};

export const POSTER_TEMPLATES: { id: PosterTemplate; label: string; blurb: string }[] = [
  { id: "image-focus", label: "Image Focus", blurb: "Large photo, headline and call to action" },
  { id: "promotion", label: "Promotion", blurb: "Big discount or price with a supporting photo" },
  { id: "clean", label: "Clean Business", blurb: "Business name, photo and service details" },
];

export const POSTER_SIZE = 1080;

const FONT = "'IBM Plex Sans', system-ui, sans-serif";

function shade(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c: number) =>
    Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Props = {
  template: PosterTemplate;
  fields: PosterFields;
  colors: PosterColors;
  /** While editing we show a designed photo placeholder; it is hidden on export. */
  editing?: boolean;
};

export const PosterCanvas = forwardRef<HTMLDivElement, Props>(function PosterCanvas(
  { template, fields, colors, editing = false },
  ref,
) {
  const brand = colors.brand;
  const onBrand = contrastText(brand);
  const deep = isDarkColor(brand) ? shade(brand, -0.35) : shade(brand, -0.55);
  const ink = colors.text || "#111827";

  const f = {
    headline: fields.headline.trim() || "Your headline here",
    subheading: fields.subheading.trim(),
    offer: fields.offer.trim(),
    cta: fields.cta.trim(),
    businessName: fields.businessName.trim() || "Your business",
    contact: fields.contact.trim(),
    location: fields.location.trim(),
  };

  const base: React.CSSProperties = {
    width: POSTER_SIZE,
    height: POSTER_SIZE,
    fontFamily: FONT,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background || "#ffffff",
    color: ink,
  };

  /** Photo area. Uses cover so the image keeps its aspect ratio and never stretches. */
  const Photo = ({ style, radius = 0 }: { style: React.CSSProperties; radius?: number }) => {
    if (fields.image) {
      return (
        <div style={{ ...style, borderRadius: radius, overflow: "hidden", backgroundColor: shade(brand, -0.2) }}>
          <img
            src={fields.image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      );
    }
    if (!editing) {
      // Downloaded poster: a clean branded panel instead of an editor placeholder.
      return (
        <div
          style={{
            ...style,
            borderRadius: radius,
            background: shade(brand, isDarkColor(brand) ? 0.12 : -0.12),
          }}
        />
      );
    }
    return (
      <div
        style={{
          ...style,
          borderRadius: radius,
          display: "grid",
          placeItems: "center",
          background: rgba(brand, 0.1),
          border: `3px dashed ${rgba(brand, 0.45)}`,
          color: rgba(ink, 0.6),
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        Add a photo
      </div>
    );
  };

  const OfferBadge = ({
    background,
    color,
    style,
  }: {
    background: string;
    color: string;
    style?: React.CSSProperties;
  }) =>
    f.offer ? (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background,
          color,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: 0.5,
          padding: "16px 32px",
          borderRadius: 10,
          ...style,
        }}
      >
        {f.offer}
      </div>
    ) : null;

  const Cta = ({ background, color }: { background: string; color: string }) =>
    f.cta ? (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background,
          color,
          fontSize: 34,
          fontWeight: 700,
          padding: "20px 40px",
          borderRadius: 8,
        }}
      >
        {f.cta}
      </div>
    ) : null;

  const ContactLine = ({ color, opacity = 0.85 }: { color: string; opacity?: number }) =>
    f.contact || f.location ? (
      <div style={{ color, opacity, fontSize: 28, display: "flex", gap: 28, flexWrap: "wrap" }}>
        {f.contact && <span style={{ fontWeight: 600 }}>{f.contact}</span>}
        {f.location && <span>{f.location}</span>}
      </div>
    ) : null;

  /* ---------------- 1. Image focus ---------------- */
  if (template === "image-focus") {
    return (
      <div ref={ref} style={base}>
        <Photo style={{ width: "100%", height: 620, position: "relative" }} />
        {/* Brand bar tucked under the photo */}
        <div style={{ height: 10, width: "100%", backgroundColor: brand }} />

        <div
          style={{
            flex: 1,
            padding: "44px 64px 56px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Decorative accent */}
          <div
            style={{
              position: "absolute",
              right: -110,
              bottom: -110,
              width: 300,
              height: 300,
              borderRadius: "50%",
              backgroundColor: rgba(brand, 0.1),
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: brand,
              }}
            >
              {f.businessName}
            </div>
            <OfferBadge background={brand} color={onBrand} style={{ fontSize: 30, padding: "10px 22px" }} />
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 22,
              position: "relative",
              letterSpacing: -1,
            }}
          >
            {f.headline}
          </div>
          {f.subheading && (
            <div style={{ fontSize: 30, marginTop: 16, opacity: 0.72, lineHeight: 1.35, position: "relative" }}>
              {f.subheading}
            </div>
          )}

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 28,
              position: "relative",
            }}
          >
            <Cta background={brand} color={onBrand} />
            <div style={{ textAlign: "right" }}>
              <ContactLine color={ink} opacity={0.75} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- 2. Promotion ---------------- */
  if (template === "promotion") {
    return (
      <div ref={ref} style={{ ...base, backgroundColor: deep, color: onBrand }}>
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: "50%",
            backgroundColor: rgba(brand, 0.4),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 300,
            right: -120,
            width: 300,
            height: 300,
            borderRadius: 60,
            transform: "rotate(24deg)",
            backgroundColor: rgba(brand, 0.28),
          }}
        />

        <div style={{ position: "relative", padding: "64px 64px 0", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#ffffff",
              opacity: 0.85,
            }}
          >
            {f.businessName}
          </div>

          <div
            style={{
              marginTop: 34,
              fontSize: f.offer.length > 12 ? 96 : 132,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: -3,
              color: "#ffffff",
            }}
          >
            {f.offer || f.headline}
          </div>

          {f.offer && (
            <div style={{ marginTop: 20, fontSize: 48, fontWeight: 600, lineHeight: 1.15, color: "#ffffff", opacity: 0.95 }}>
              {f.headline}
            </div>
          )}
          {f.subheading && (
            <div style={{ marginTop: 16, fontSize: 30, lineHeight: 1.35, color: "#ffffff", opacity: 0.78, maxWidth: 720 }}>
              {f.subheading}
            </div>
          )}
        </div>

        <div style={{ position: "relative", marginTop: "auto", display: "flex", alignItems: "flex-end", gap: 0 }}>
          <Photo style={{ width: 560, height: 430, margin: "0 0 0 64px" }} radius={24} />
          <div
            style={{
              flex: 1,
              padding: "0 64px 64px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 22,
              alignItems: "flex-start",
            }}
          >
            <Cta background="#ffffff" color={deep} />
            <ContactLine color="#ffffff" opacity={0.85} />
          </div>
        </div>
        <div style={{ height: 0 }} />
      </div>
    );
  }

  /* ---------------- 3. Clean business ---------------- */
  return (
    <div ref={ref} style={{ ...base, flexDirection: "row" }}>
      <div style={{ width: 470, height: "100%", position: "relative", flexShrink: 0 }}>
        <Photo style={{ width: "100%", height: "100%" }} />
        <div
          style={{
            position: "absolute",
            right: -70,
            top: "50%",
            marginTop: -70,
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: brand,
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          padding: "72px 64px 64px 108px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 46, height: 6, backgroundColor: brand, borderRadius: 3 }} />
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: brand,
            }}
          >
            {f.businessName}
          </span>
        </div>

        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.08, marginTop: 30, letterSpacing: -1 }}>
          {f.headline}
        </div>
        {f.subheading && (
          <div style={{ fontSize: 28, marginTop: 20, lineHeight: 1.45, opacity: 0.7 }}>{f.subheading}</div>
        )}

        <OfferBadge
          background={rgba(brand, 0.12)}
          color={isDarkColor(brand) ? brand : shade(brand, -0.4)}
          style={{ marginTop: 34, alignSelf: "flex-start" }}
        />

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
          <Cta background={brand} color={onBrand} />
          <div style={{ width: "100%", height: 2, backgroundColor: rgba(ink, 0.12) }} />
          <ContactLine color={ink} opacity={0.75} />
        </div>
      </div>
    </div>
  );
});
