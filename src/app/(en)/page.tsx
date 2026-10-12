import { HomePageView, homeMetadata } from "@/components/pages/HomePageView";

export const metadata = homeMetadata("en");

export default function HomePage() {
  return <HomePageView locale="en" />;
}
