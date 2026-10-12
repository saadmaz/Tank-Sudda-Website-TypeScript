import { PricingPageView, pricingMetadata } from "@/components/pages/PricingPageView";

export const metadata = pricingMetadata("en");

export default function PricingPage() {
  return <PricingPageView locale="en" />;
}
