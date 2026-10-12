/**
 * Service areas. Only areas with `status: "confirmed"` are published, listed
 * in the sitemap and given a page at /areas/[slug].
 *
 * Draft entries below are written so the owner can review and confirm them.
 * Change `status` to "confirmed" only after verifying that Tank Sudda serves
 * the area. Never add response times or same-day promises unless confirmed.
 */

export type AreaStatus = "confirmed" | "unverified";

export interface ServiceArea {
  slug: string;
  name: string;
  district: string;
  province: string;
  status: AreaStatus;
  metaDescription: string;
  intro: string;
  /** Location-specific notes that make the page genuinely useful. */
  localNotes: { heading: string; body: string }[];
  /** Neighbourhoods or towns. Only list places the owner confirms. */
  placesCovered: string[];
  serviceSlugs: string[];
}

export const areas: ServiceArea[] = [
  {
    slug: "colombo",
    name: "Colombo",
    district: "Colombo",
    province: "Western",
    status: "unverified",
    metaDescription:
      "Water tank and sump cleaning in Colombo for homes, apartments and offices. Request a quote from Tank Sudda.",
    intro:
      "Colombo has a mix of houses, apartment buildings and offices, and many properties rely on a sump and overhead tank to keep water available throughout the day.",
    localNotes: [
      {
        heading: "Apartments and shared tanks",
        body: "In apartment buildings, tanks and sumps are usually shared, so cleaning has to be coordinated with management and residents. Our commercial and institutional service is designed for that kind of planning.",
      },
      {
        heading: "Access in dense neighbourhoods",
        body: "Narrow lanes, limited parking and rooftop tanks reached by internal stairs are common. Mention access details in your booking so we can plan equipment and timing.",
      },
    ],
    placesCovered: [],
    serviceSlugs: [
      "water-tank-deep-cleaning",
      "water-tank-vacuum-cleaning",
      "sump-cleaning",
      "commercial-tank-cleaning",
    ],
  },
  {
    slug: "gampaha",
    name: "Gampaha",
    district: "Gampaha",
    province: "Western",
    status: "unverified",
    metaDescription:
      "Water tank and sump cleaning in Gampaha District for homes and organisations. Request a quote from Tank Sudda.",
    intro:
      "Gampaha District includes busy suburbs, growing towns and industrial areas, with properties ranging from family homes with a single overhead tank to sites with large storage tanks.",
    localNotes: [
      {
        heading: "Homes with wells and mixed supplies",
        body: "Some properties combine mains water with other sources. If your tank is filled from more than one source, tell us in your booking, as it can affect how quickly sediment builds up.",
      },
      {
        heading: "Industrial and commercial sites",
        body: "Larger storage tanks at factories and commercial premises usually need a site assessment before a quotation can be given.",
      },
    ],
    placesCovered: [],
    serviceSlugs: [
      "water-tank-deep-cleaning",
      "water-tank-vacuum-cleaning",
      "sump-cleaning",
      "commercial-tank-cleaning",
    ],
  },
];

export function isPublishedArea(area: ServiceArea, preview = false): boolean {
  return area.status === "confirmed" || preview;
}

export function getPublishedAreas(preview = false): ServiceArea[] {
  return areas.filter((area) => isPublishedArea(area, preview));
}

export function getAreaBySlug(slug: string, preview = false): ServiceArea | undefined {
  return getPublishedAreas(preview).find((area) => area.slug === slug);
}
