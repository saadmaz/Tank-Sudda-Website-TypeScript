import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hide the Next.js "N" badge shown in development (never shown in production).
  devIndicators: false,
  typedRoutes: true,
  // Pin the workspace root (a lockfile exists in a parent directory).
  turbopack: { root: process.cwd() },
  experimental: {
    // English and Sinhala/Tamil pages use separate root layouts (so <html lang>
    // is right), so unmatched URLs need app/global-not-found.tsx.
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Generated illustrations change rarely; let browsers reuse them for a week.
        source: "/illustrations/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Route used by the previous version of the site.
      { source: "/knowledge", destination: "/guides", permanent: true },
      // Vacuum cleaning is no longer offered.
      {
        source: "/services/water-tank-vacuum-cleaning",
        destination: "/services/water-tank-deep-cleaning",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
