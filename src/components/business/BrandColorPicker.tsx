import { Check } from "lucide-react";
import { BRAND_COLOR_PRESETS } from "@/lib/types";
import { contrastText } from "@/lib/format";

export function BrandColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {BRAND_COLOR_PRESETS.map((c) => {
        const active = c.hex.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={c.hex}
            type="button"
            title={c.name}
            aria-label={c.name}
            onClick={() => onChange(c.hex)}
            className={`grid h-8 w-8 place-items-center rounded-full border-2 transition-transform hover:scale-105 ${
              active ? "border-foreground" : "border-transparent"
            }`}
            style={{ backgroundColor: c.hex }}
          >
            {active && <Check className="h-4 w-4" style={{ color: contrastText(c.hex) }} />}
          </button>
        );
      })}
      <label className="ml-1 flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
          aria-label="Custom colour"
        />
        Custom
      </label>
    </div>
  );
}
