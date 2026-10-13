import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client identifier for rate limiting. Behind Cloudflare the
 * visitor's address is in CF-Connecting-IP; elsewhere the first forwarded IP.
 */
export async function getClientKey(scope: string): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = h.get("cf-connecting-ip") || forwarded || h.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
