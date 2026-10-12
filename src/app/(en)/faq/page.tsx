import { FaqPageView, faqMetadata } from "@/components/pages/FaqPageView";

export const metadata = faqMetadata("en");

export default function FaqPage() {
  return <FaqPageView locale="en" />;
}
