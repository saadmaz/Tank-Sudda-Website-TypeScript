import { AboutPageView, aboutMetadata } from "@/components/pages/AboutPageView";

export const metadata = aboutMetadata("en");

export default function AboutPage() {
  return <AboutPageView locale="en" />;
}
