import { forwardRef } from "react";
import { contrastText } from "@/lib/format";

export type PosterTemplate = "bold" | "clean" | "split";

export type PosterFields = {
  headline: string;
  subheading: string;
  offer: string;
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
  { id: "bold", label: "Bold", blurb: "Big headline on your brand colour" },
  { id: "clean", label: "Clean", blurb: "Light, simple, photo on top" },
  { id: "split", label: "Split", blurb: "Photo on the left, details on the right" },
];

export const POSTER_W = 800;
export const POSTER_H = 1000;

type Props = { template: PosterTemplate; fields: PosterFields; colors: PosterColors };

export const PosterCanvas = forwardRef<HTMLDivElement, Props>(function PosterCanvas(
  { template, fields, colors },
  ref,
) {
  const onBrand = contrastText(colors.brand);
  const f = {
    headline: fields.headline || "Your headline here",
    subheading: fields.subheading,
    offer: fields.offer,
    businessName: fields.businessName || "Business name",
    contact: fields.contact,
    location: fields.location,
  };
  const base: React.CSSProperties = {
    width: POSTER_W,
    height: POSTER_H,
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  const Img = ({ style }: { style: React.CSSProperties }) =>
    fields.image ? (
      <img src={fields.image} alt="" style={{ objectFit: "cover", ...style }} />
    ) : (
      <div
        style={{
          ...style,
          display: "grid",
          placeItems: "center",
          background: "rgba(0,0,0,0.08)",
          color: "rgba(0,0,0,0.35)",
          fontSize: 22,
        }}
      >
        Add a photo
      </div>
    );

  const Footer = ({ color, border }: { color: string; border: string }) => (
    <div
      style={{
        marginTop: "auto",
        borderTop: `2px solid ${border}`,
        paddingTop: 20,
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        fontSize: 22,
        color,
      }}
    >
      <div style={{ fontWeight: 600 }}>{f.businessName}</div>
      <div style={{ textAlign: "right", lineHeight: 1.35 }}>
        {f.contact && <div>{f.contact}</div>}
        {f.location && <div style={{ opacity: 0.85 }}>{f.location}</div>}
      </div>
    </div>
  );

  if (template === "bold") {
    return (
      <div ref={ref} style={{ ...base, background: colors.brand, color: onBrand, padding: 56 }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", opacity: 0.85 }}>
          {f.businessName}
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: 28 }}>{f.headline}</div>
        {f.subheading && <div style={{ fontSize: 30, marginTop: 20, opacity: 0.92 }}>{f.subheading}</div>}
        {f.offer && (
          <div
            style={{
              alignSelf: "flex-start",
              marginTop: 32,
              background: onBrand,
              color: colors.brand,
              fontSize: 34,
              fontWeight: 700,
              padding: "12px 28px",
              borderRadius: 999,
            }}
          >
            {f.offer}
          </div>
        )}
        <Img style={{ width: "100%", height: 330, borderRadius: 20, marginTop: 36 }} />
        <Footer color={onBrand} border={`${onBrand}55`} />
      </div>
    );
  }

  if (template === "clean") {
    return (
      <div ref={ref} style={{ ...base, background: colors.background, color: colors.text }}>
        <Img style={{ width: "100%", height: 460 }} />
        <div style={{ padding: 48, display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ height: 8, width: 120, background: colors.brand, borderRadius: 4 }} />
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>{f.headline}</div>
          {f.subheading && <div style={{ fontSize: 28, marginTop: 14, opacity: 0.8 }}>{f.subheading}</div>}
          {f.offer && (
            <div style={{ fontSize: 40, fontWeight: 700, color: colors.brand, marginTop: 20 }}>{f.offer}</div>
          )}
          <Footer color={colors.text} border="rgba(0,0,0,0.1)" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ ...base, background: colors.background, color: colors.text, flexDirection: "row" }}>
      <Img style={{ width: 340, height: "100%" }} />
      <div
        style={{
          flex: 1,
          padding: 44,
          display: "flex",
          flexDirection: "column",
          borderLeft: `14px solid ${colors.brand}`,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 600, color: colors.brand, textTransform: "uppercase", letterSpacing: 2 }}>
          {f.businessName}
        </div>
        <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.08, marginTop: 20 }}>{f.headline}</div>
        {f.subheading && <div style={{ fontSize: 26, marginTop: 16, opacity: 0.8 }}>{f.subheading}</div>}
        {f.offer && (
          <div
            style={{
              alignSelf: "flex-start",
              marginTop: 28,
              background: colors.brand,
              color: onBrand,
              fontSize: 30,
              fontWeight: 700,
              padding: "12px 24px",
              borderRadius: 12,
            }}
          >
            {f.offer}
          </div>
        )}
        <div style={{ marginTop: "auto", fontSize: 22, lineHeight: 1.4 }}>
          {f.contact && <div style={{ fontWeight: 600 }}>{f.contact}</div>}
          {f.location && <div style={{ opacity: 0.8 }}>{f.location}</div>}
        </div>
      </div>
    </div>
  );
});
