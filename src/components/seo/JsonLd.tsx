import { serializeJsonLd, type JsonLdObject } from "@/lib/seo/schema";

/** Renders one or more JSON-LD objects; null entries are skipped. */
export function JsonLd({ data }: { data: (JsonLdObject | null)[] | JsonLdObject | null }) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is JsonLdObject => item !== null,
  );
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(items.length === 1 ? items[0]! : items) }}
    />
  );
}
