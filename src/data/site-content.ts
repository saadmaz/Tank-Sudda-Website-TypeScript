/**
 * Shared marketing copy: the general customer journey and the working
 * commitments shown on the homepage and About page. These describe how Tank
 * Sudda intends to work; the owner should confirm each one before launch.
 */
import type { ServiceStep } from "./services";

export const customerJourney: ServiceStep[] = [
  {
    title: "Send a request",
    description:
      "Tell us about your property, your tanks and when suits you, using the booking form.",
  },
  {
    title: "We confirm the details",
    description:
      "Our team contacts you to check the details, discuss access and give you a quotation.",
  },
  {
    title: "Prepare",
    description:
      "Store water for essential use and make sure the tank or sump can be reached safely.",
  },
  {
    title: "Cleaning",
    description:
      "The tank is cleaned using the agreed service: deep cleaning, sump cleaning, or both.",
  },
  {
    title: "Handover",
    description:
      "We restore your supply and tell you about anything we noticed that may need attention.",
  },
];

export const commitments: { title: string; description: string }[] = [
  {
    title: "A clear quotation first",
    description:
      "You know what is included and what it costs before any work begins. No surprises on the day.",
  },
  {
    title: "Sediment removed, not flushed",
    description:
      "Settled material is taken out of the tank instead of being washed down the outlet into your pipes.",
  },
  {
    title: "Planned around your supply",
    description: "We tell you in advance how long your water will be off, so you can prepare.",
  },
  {
    title: "Honest observations",
    description:
      "If we see a cracked lid, a gap or a damaged fitting, we tell you and leave the decision to you.",
  },
];
