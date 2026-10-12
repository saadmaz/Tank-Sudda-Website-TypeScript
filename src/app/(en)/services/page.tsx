import { ServicesPageView, servicesMetadata } from "@/components/pages/ServicesPageView";

export const metadata = servicesMetadata("en");

export default function ServicesPage() {
  return <ServicesPageView locale="en" />;
}
