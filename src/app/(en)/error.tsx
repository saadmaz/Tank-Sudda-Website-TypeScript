"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-site section-y">
      <div className="max-w-2xl" role="alert">
        <p className="mb-3 eyebrow">Something went wrong</p>
        <h1 className="text-h1">This page could not be loaded</h1>
        <p className="mt-5 text-lead text-muted">
          Please try again. If the problem continues, return to the{" "}
          <Link href="/" className="text-water-700 underline underline-offset-4">
            homepage
          </Link>
          .
        </p>
        <Button className="mt-8" onClick={reset}>
          Try again
        </Button>
      </div>
    </section>
  );
}
