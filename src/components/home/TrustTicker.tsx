"use client";

import { TRUST_ITEMS } from "@/lib/constants";

export function TrustTicker() {
  // Duplicate array for seamless loop
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <div className="border-y border-border py-4 overflow-hidden w-full">
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: "marquee 30s linear infinite",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState =
            "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState =
            "running";
        }}
      >
        {items.map((item, index) => (
          <span key={index} className="inline-flex items-center gap-3 px-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-foreground/70">
              {item}
            </span>
            {index < items.length - 1 && (
              <span className="text-muted-foreground/40 select-none">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
