import "server-only";
import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { Route } from "next";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Notice } from "@/components/ui/primitives";

/**
 * MDX is executed at build time, so articles must only come from trusted
 * authors (the repository or a CMS with restricted editor access).
 */

function MdxLink({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href as Route} {...rest}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#"))
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "success";
  title?: string;
  children: ReactNode;
}) {
  return (
    <Notice tone={tone} title={title} className="not-prose my-6">
      {children}
    </Notice>
  );
}

const components: MDXComponents = {
  a: MdxLink,
  // Articles start at h2; demote stray h1s so each page keeps a single h1.
  h1: (props) => <h2 {...props} />,
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  Callout,
};

export async function renderMdx(source: string): Promise<ReactNode> {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  return <Content components={components} />;
}
