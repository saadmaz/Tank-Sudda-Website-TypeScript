import { ImageResponse } from "next/og";
import { business } from "@/data/business";

export const dynamic = "force-static";

/** Default 1200×630 Open Graph image: brand colours and name only, no imagery. */
export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: "#061c36",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 40, height: 6, borderRadius: 3, backgroundColor: "#1a89ca" }} />
        </div>
        <div style={{ fontSize: 44, fontWeight: 700, display: "flex" }}>
          Tank<span style={{ color: "#7fc1e6", marginLeft: 12 }}>Sudda</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 960 }}>
          Water tank &amp; sump cleaning
        </div>
        <div style={{ fontSize: 32, color: "#afd9f0" }}>{business.countryName}</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 2,
              height: i % 5 === 0 ? 28 : 14,
              backgroundColor: i % 5 === 0 ? "#1a89ca" : "#8d9299",
            }}
          />
        ))}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
