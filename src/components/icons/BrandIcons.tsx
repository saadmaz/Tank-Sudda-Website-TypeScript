import { cn } from "@/lib/utils";
import { brandPaths } from "./brand-paths";

export type BrandName = keyof typeof brandPaths | "linkedin";

/** Official brand colours, for use on brand-coloured accents. */
export const brandColors: Record<BrandName, string> = {
  instagram: brandPaths.instagram.hex,
  facebook: brandPaths.facebook.hex,
  tiktok: brandPaths.tiktok.hex,
  youtube: brandPaths.youtube.hex,
  whatsapp: brandPaths.whatsapp.hex,
  google: brandPaths.google.hex,
  linkedin: "#0A66C2",
};

/**
 * LinkedIn "in" mark, drawn from simple shapes (LinkedIn is not distributed
 * by Simple Icons). Even-odd fill cuts the letters out of the rounded square.
 */
const linkedinPath =
  "M3.5 0h17A3.5 3.5 0 0 1 24 3.5v17a3.5 3.5 0 0 1-3.5 3.5h-17A3.5 3.5 0 0 1 0 20.5v-17A3.5 3.5 0 0 1 3.5 0Z" +
  "M5.4 4.2a1.9 1.9 0 1 0 0 3.8a1.9 1.9 0 1 0 0-3.8Z" +
  "M3.8 9.3h3.2v10.5H3.8Z" +
  "M9.2 9.3h3.1v1.5c.6-1 1.8-1.8 3.6-1.8c3 0 3.9 1.9 3.9 4.9v5.9h-3.2v-5.3c0-1.4-.3-2.7-1.9-2.7c-1.6 0-2.3 1.1-2.3 2.8v5.2H9.2Z";

/**
 * Single-colour brand logo. Decorative by default (pair it with visible text
 * or an accessible label on the surrounding link).
 */
export function BrandIcon({ name, className }: { name: BrandName; className?: string }) {
  const isLinkedin = name === "linkedin";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5 shrink-0", className)}
    >
      <path
        d={isLinkedin ? linkedinPath : brandPaths[name].path}
        fillRule={isLinkedin ? "evenodd" : undefined}
      />
    </svg>
  );
}

/** WhatsApp logo in the official WhatsApp green. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return <BrandIcon name="whatsapp" className={cn("text-whatsapp", className)} />;
}

/** Google "G" in its four brand colours. */
export function GoogleColorIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5 shrink-0", className)}
    >
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.68-.22-2.47H12v4.67h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.37-2.29v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
