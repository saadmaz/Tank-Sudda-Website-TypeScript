import type { ReactNode } from "react";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "./PageHeader";

export function LegalPage({
  title,
  path,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  path: string;
  lastUpdated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: title, path }]}
        title={title}
        intro={
          <>
            <p>{intro}</p>
            <p className="mt-3 text-sm">
              Last updated <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
            </p>
          </>
        }
      />
      <div className="container-site section-y">
        <div className="prose-article prose max-w-3xl">{children}</div>
      </div>
    </>
  );
}
