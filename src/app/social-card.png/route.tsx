import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { business } from "@/data/business";

export const dynamic = "force-static";

/** Default 1200×630 Open Graph image: logo, brand colours and name. Built once at build time. */
export function GET() {
  const logo = fs.readFileSync(path.join(process.cwd(), "public", "brand", "logo-badge-512.png"));
  const logoDataUrl = `data:image/png;base64,${logo.toString("base64")}`;
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
            width: 96,
            height: 96,
            backgroundImage: `url(${logoDataUrl})`,
            backgroundSize: "96px 96px",
          }}
        />
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
