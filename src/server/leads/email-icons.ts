/**
 * Round icons shown at the bottom of customer emails. PNG files are generated
 * into public/email/icons by `bun run email-icons`.
 */
import type { SocialPlatform } from "@/data/business";

export type EmailIconId = "phone" | "whatsapp" | "email" | "website" | SocialPlatform;

export const EMAIL_ICONS: { id: EmailIconId; label: string; background: string }[] = [
  { id: "phone", label: "Call", background: "#1a89ca" },
  { id: "whatsapp", label: "WhatsApp", background: "#25d366" },
  { id: "email", label: "Email", background: "#061c36" },
  { id: "website", label: "Website", background: "#11679b" },
  { id: "facebook", label: "Facebook", background: "#0866ff" },
  { id: "instagram", label: "Instagram", background: "#e1306c" },
  { id: "linkedin", label: "LinkedIn", background: "#0a66c2" },
  { id: "tiktok", label: "TikTok", background: "#000000" },
  { id: "youtube", label: "YouTube", background: "#ff0000" },
  { id: "x", label: "X", background: "#000000" },
  { id: "threads", label: "Threads", background: "#000000" },
];

export const EMAIL_ICON_PATH = "/email/icons";
