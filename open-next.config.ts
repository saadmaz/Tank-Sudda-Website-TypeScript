import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Every page is generated at build time and never revalidated, so prebuilt
 * pages are served straight from Workers static assets (no R2 or KV needed).
 * Switch to the R2 cache if pages ever use `revalidate`.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
