import { BlogIndex, blogIntro } from "@/components/blog/BlogIndex";
import { getPublishedArticles } from "@/lib/content/blog.server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Tank Care Blog",
  description: blogIntro,
  path: "/blog",
});

export default function BlogPage() {
  return <BlogIndex articles={getPublishedArticles()} page={1} />;
}
