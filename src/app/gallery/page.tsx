import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBand } from "@/components/sections/CtaBand";
import { GalleryGrid } from "@/components/sections/ProofSections";
import { gallery } from "@/data/gallery";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Project Gallery",
  description:
    "Photographs of water tank and sump cleaning work completed by Tank Sudda in Sri Lanka.",
  path: "/gallery",
  // Kept out of search results until real project photographs are published.
  noIndex: gallery.length === 0,
});

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Gallery", path: "/gallery" }]}
        eyebrow="Gallery"
        title="Our work"
        intro="Photographs from real Tank Sudda jobs: tanks, sumps and the equipment we use."
      />
      <section aria-label="Photographs" className="container-site section-y">
        {gallery.length > 0 ? (
          <GalleryGrid items={gallery} />
        ) : (
          <div className="max-w-2xl rounded-lg border border-dashed border-grey-300 bg-mist p-8">
            <h2 className="text-h3">Photographs coming soon</h2>
            <p className="mt-3 leading-relaxed text-muted">
              We only publish photographs from our own jobs. We are preparing our first set of
              project photos and will add them here.
            </p>
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
