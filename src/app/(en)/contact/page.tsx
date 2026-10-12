import { ContactPageView, contactMetadata } from "@/components/pages/ContactPageView";

export const metadata = contactMetadata("en");

export default function ContactPage() {
  return <ContactPageView locale="en" />;
}
