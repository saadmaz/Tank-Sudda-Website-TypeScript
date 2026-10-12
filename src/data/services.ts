/**
 * Core service catalogue. Each entry powers /services and /services/[slug].
 *
 * To add a service: append an entry, give it a unique slug, link the FAQs and
 * articles that genuinely relate to it, and add a pricing entry in pricing.ts.
 *
 * Process descriptions explain what the service generally involves. The owner
 * should confirm they match Tank Sudda's actual working method before launch
 * (see docs/OWNER-CHECKLIST.md).
 */

export type ServiceIllustration = "tank" | "vacuum" | "sump" | "commercial";

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceSection {
  heading: string;
  paragraphs: string[];
}

export interface Service {
  slug: string;
  name: string;
  /** Short label for navigation and cards. */
  shortName: string;
  /** One or two sentences used on cards and the overview page. */
  summary: string;
  /** Meta description (aim for 140–160 characters). */
  metaDescription: string;
  /** Opening paragraph on the service page. */
  intro: string;
  illustration: ServiceIllustration;
  suitableFor: string[];
  whatItInvolves: string[];
  process: ServiceStep[];
  sections: ServiceSection[];
  beforeYouBook: string[];
  faqIds: string[];
  relatedServiceSlugs: string[];
  relatedArticleSlugs: string[];
}

export const services: Service[] = [
  {
    slug: "water-tank-deep-cleaning",
    name: "Water Tank Deep Cleaning",
    shortName: "Deep cleaning",
    summary:
      "A full clean of an overhead or ground-level tank: drained, sediment removed, internal surfaces scrubbed and rinsed before refilling.",
    metaDescription:
      "Water tank deep cleaning in Sri Lanka. Tank drained, sediment removed, walls and floor scrubbed and rinsed. Request a quote from Tank Sudda.",
    intro:
      "Deep cleaning is the most thorough option for a domestic or building water tank. The tank is emptied, settled sediment and loose deposits are removed, and the internal walls, floor and lid area are cleaned and rinsed before the tank is returned to service.",
    illustration: "tank",
    suitableFor: [
      "Overhead tanks on houses and small buildings",
      "Tanks that have not been cleaned for a long time",
      "Tanks with visible sediment, staining or slime on internal surfaces",
      "Moving into a property where the tank's history is unknown",
    ],
    whatItInvolves: [
      "Inspection of the tank, lid and access before work begins",
      "Isolating the inlet and draining the stored water",
      "Removing settled sediment and debris from the floor",
      "Scrubbing internal walls, floor and the underside of the lid",
      "Rinsing and removing rinse water",
      "Reconnecting the supply and refilling",
    ],
    process: [
      {
        title: "Assessment",
        description:
          "We confirm the tank type, capacity, access route and the condition of the lid and fittings, and agree the plan with you.",
      },
      {
        title: "Isolate and drain",
        description:
          "The inlet is closed and the tank is drained. We agree beforehand where drained water will go and how long supply will be off.",
      },
      {
        title: "Sediment removal",
        description:
          "Settled silt, sand and debris are lifted out of the tank rather than flushed down the outlet into your plumbing.",
      },
      {
        title: "Surface cleaning",
        description:
          "Walls, floor, corners and the underside of the lid are scrubbed to remove deposits and biofilm.",
      },
      {
        title: "Rinse and refill",
        description:
          "The tank is rinsed, rinse water is removed, the supply is reconnected and the tank is refilled.",
      },
      {
        title: "Handover",
        description:
          "We tell you what we observed, such as damaged lids, cracks or gaps, so you can decide whether any repairs are needed.",
      },
    ],
    sections: [
      {
        heading: "Why sediment matters",
        paragraphs: [
          "Most tanks slowly collect fine particles carried in by the supply. Over time these settle into a layer on the floor of the tank. Sediment can be disturbed when the tank fills, which may cause cloudy water at the tap and can make it harder to keep the tank clean.",
          "Deep cleaning removes that layer completely and gives you a clean baseline. Regular inspection afterwards helps you judge how quickly sediment returns in your property.",
        ],
      },
      {
        heading: "Deep cleaning or vacuum cleaning?",
        paragraphs: [
          "Deep cleaning is usually the right choice for a first clean, a neglected tank, or when internal surfaces need scrubbing. Vacuum cleaning focuses on lifting settled sediment and is often used for maintenance between deep cleans.",
          "If you are unsure, describe the tank when you book and we will recommend the appropriate service after assessment.",
        ],
      },
    ],
    beforeYouBook: [
      "Know the approximate capacity of the tank (often printed on plastic tanks, for example 1,000 L).",
      "Check how the tank is reached: roof access, a ladder or an internal hatch.",
      "Plan for water supply being interrupted during the clean; store some water for essential use.",
      "Let us know if the lid, ladder or access area is damaged.",
    ],
    faqIds: ["how-often-clean", "water-off-duration", "what-tanks", "prepare-for-clean"],
    relatedServiceSlugs: ["water-tank-vacuum-cleaning", "sump-cleaning"],
    relatedArticleSlugs: [
      "how-often-should-you-clean-your-water-tank",
      "understanding-sediment-in-water-tanks",
      "how-to-prepare-for-water-tank-cleaning",
    ],
  },
  {
    slug: "water-tank-vacuum-cleaning",
    name: "Water Tank Vacuum Cleaning",
    shortName: "Vacuum cleaning",
    summary:
      "Suction equipment lifts settled sediment and loose debris from the tank floor. It is useful for routine maintenance between deep cleans.",
    metaDescription:
      "Water tank vacuum cleaning in Sri Lanka. Settled sediment and debris lifted from the tank floor with suction equipment. Request a quote.",
    intro:
      "Vacuum cleaning uses suction equipment to remove the sediment and loose debris that settle on the floor of a water tank. It targets the part of the tank where most material collects and is often used to maintain a tank that has previously been deep cleaned.",
    illustration: "vacuum",
    suitableFor: [
      "Tanks on a regular maintenance schedule",
      "Tanks where sediment is the main concern rather than surface deposits",
      "Larger tanks where removing sediment efficiently matters",
      "Properties that want to keep interruption to a minimum (confirmed at assessment)",
    ],
    whatItInvolves: [
      "Inspection of the tank and the amount of sediment present",
      "Agreeing the water level and supply arrangements for the work",
      "Lifting settled sediment and loose debris with suction equipment",
      "Checking the floor and corners once the sediment is removed",
      "Recommending a deep clean if surfaces also need attention",
    ],
    process: [
      {
        title: "Assessment",
        description:
          "We look at the tank, the depth of sediment and the access, then confirm whether vacuum cleaning is suitable or a deep clean is needed.",
      },
      {
        title: "Prepare the tank",
        description:
          "We agree how much water needs to be drawn down for the work and how long supply will be affected.",
      },
      {
        title: "Vacuum the floor",
        description:
          "Sediment and debris are lifted from the floor and corners with suction equipment and removed from the tank.",
      },
      {
        title: "Check and finish",
        description:
          "We check the result, restore the supply, and tell you if we noticed anything that needs attention.",
      },
    ],
    sections: [
      {
        heading: "When vacuum cleaning is a good fit",
        paragraphs: [
          "Vacuum cleaning is effective when the main issue is material that has settled on the tank floor. Because it focuses on sediment, it is well suited to maintenance between deeper cleans.",
          "It does not replace scrubbing where walls have staining, slime or deposits. In that case we will recommend a deep clean instead, and explain why.",
        ],
      },
      {
        heading: "Will my water be switched off?",
        paragraphs: [
          "That depends on the tank's size, design and condition. We confirm how much water must be drawn down, and for how long, during the assessment, before any work starts.",
        ],
      },
    ],
    beforeYouBook: [
      "Tell us when the tank was last cleaned, if you know.",
      "Note any cloudy water, grit or particles you have seen at the tap.",
      "Share the approximate tank capacity and how the tank is accessed.",
    ],
    faqIds: ["vacuum-vs-deep", "how-often-clean", "water-off-duration"],
    relatedServiceSlugs: ["water-tank-deep-cleaning", "commercial-tank-cleaning"],
    relatedArticleSlugs: [
      "understanding-sediment-in-water-tanks",
      "water-tank-maintenance-checklist",
    ],
  },
  {
    slug: "sump-cleaning",
    name: "Sump Cleaning",
    shortName: "Sump cleaning",
    summary:
      "Cleaning of underground or ground-level sumps that store water before it is pumped to an overhead tank.",
    metaDescription:
      "Sump cleaning in Sri Lanka for underground and ground-level water sumps. Sediment removed and surfaces cleaned. Request a quote from Tank Sudda.",
    intro:
      "Many Sri Lankan homes and buildings store water in an underground or ground-level sump and pump it up to an overhead tank. Because the sump feeds everything above it, sediment and debris in the sump can travel on into the rest of the system. Sump cleaning removes that material at the source.",
    illustration: "sump",
    suitableFor: [
      "Houses with an underground sump and overhead tank",
      "Apartment buildings and offices with a shared sump",
      "Sumps with sediment, debris or a damaged or poorly fitting cover",
      "Cleaning a sump together with the overhead tank it supplies",
    ],
    whatItInvolves: [
      "Checking the sump cover, access opening and surrounding area",
      "Coordinating with the pump so it is not run dry",
      "Draining or drawing down the sump",
      "Removing sediment, silt and debris from the floor",
      "Cleaning internal surfaces and rinsing",
      "Reconnecting, refilling and restoring the pump",
    ],
    process: [
      {
        title: "Assessment",
        description:
          "We check the sump's size, depth, access opening and cover, and identify the pump and valves that need to be isolated.",
      },
      {
        title: "Isolate the pump",
        description:
          "The pump is switched off before the water level drops, so it cannot run dry while work is under way.",
      },
      {
        title: "Drain and remove sediment",
        description:
          "The sump is drained or drawn down and settled material is removed from the floor and corners.",
      },
      {
        title: "Clean and rinse",
        description: "Internal surfaces are cleaned, rinsed and the rinse water removed.",
      },
      {
        title: "Restore",
        description:
          "The sump is refilled, the pump is restored, and we point out any issues with the cover, walls or fittings.",
      },
    ],
    sections: [
      {
        heading: "Why the sump deserves attention",
        paragraphs: [
          "A sump sits below ground level, which makes it more exposed to dust, debris and surface water if the cover or surrounding area is not well sealed. It is also out of sight, so problems can go unnoticed for a long time.",
          "Cleaning only the overhead tank while leaving a dirty sump underneath means sediment can be pumped straight back up. Where possible, it makes sense to clean the sump and the overhead tank together.",
        ],
      },
      {
        heading: "Working safely in a sump",
        paragraphs: [
          "Sumps are enclosed spaces with limited access and ventilation. Work inside them should only be done by people who are equipped and prepared for that environment. Please do not enter a sump yourself to clean it.",
        ],
      },
    ],
    beforeYouBook: [
      "Locate the sump cover and make sure the area around it can be reached.",
      "Know where the pump switch or controller is.",
      "Tell us if the sump also feeds an overhead tank you would like cleaned.",
      "Plan for water supply being interrupted while the sump is empty.",
    ],
    faqIds: ["sump-and-tank-together", "water-off-duration", "prepare-for-clean"],
    relatedServiceSlugs: ["water-tank-deep-cleaning", "commercial-tank-cleaning"],
    relatedArticleSlugs: [
      "how-to-prepare-for-water-tank-cleaning",
      "water-tank-maintenance-checklist",
    ],
  },
  {
    slug: "commercial-tank-cleaning",
    name: "Commercial & Institutional Tank Cleaning",
    shortName: "Commercial & institutional",
    summary:
      "Planned tank and sump cleaning for apartment buildings, offices, schools, hotels and other organisations with larger or multiple tanks.",
    metaDescription:
      "Commercial and institutional water tank and sump cleaning in Sri Lanka for apartments, offices, schools and hotels. Request a site assessment.",
    intro:
      "Buildings that serve many people usually have larger tanks, several tanks, or a sump-and-overhead system shared by many users. Cleaning them takes more planning: supply interruptions affect residents, staff or guests, and access may need to be arranged with building management.",
    illustration: "commercial",
    suitableFor: [
      "Apartment buildings and management corporations",
      "Offices and commercial buildings",
      "Schools, institutions and places of worship",
      "Hotels, guest houses and restaurants",
      "Factories and other sites with large storage tanks",
    ],
    whatItInvolves: [
      "A site assessment covering every tank and sump to be cleaned",
      "A written scope listing tanks, capacities and access arrangements",
      "Scheduling agreed with you to limit disruption to occupants",
      "Deep cleaning or vacuum cleaning as appropriate for each tank",
      "A summary of what was cleaned and any issues observed",
    ],
    process: [
      {
        title: "Site assessment",
        description:
          "We survey each tank and sump, note capacities, access and condition, and identify how supply can be managed during the work.",
      },
      {
        title: "Scope and quotation",
        description:
          "You receive a scope of work and a quotation based on what was found on site, so everyone is clear on what is included.",
      },
      {
        title: "Schedule",
        description:
          "We agree dates and times with you, including any notice that needs to be given to residents, staff or guests.",
      },
      {
        title: "Cleaning",
        description:
          "Tanks are cleaned in an agreed order, so that part of the supply can stay available where the system allows it.",
      },
      {
        title: "Close-out",
        description:
          "We confirm what was completed and report any defects we observed, such as damaged covers, leaks or corroded fittings.",
      },
    ],
    sections: [
      {
        heading: "Planning around the people who use the building",
        paragraphs: [
          "The biggest difference between domestic and commercial work is coordination. Turning off water in an apartment building or a hotel affects many people, so timing, notice and the order in which tanks are cleaned matter as much as the cleaning itself.",
          "Share any constraints when you enquire, such as operating hours, quiet periods, security procedures or access permissions, and we will plan around them where we can.",
        ],
      },
      {
        heading: "Ongoing maintenance",
        paragraphs: [
          "Many organisations prefer cleaning on a regular cycle rather than waiting for a problem. If you would like to discuss a recurring schedule, mention it in your enquiry and we will talk through the options.",
        ],
      },
    ],
    beforeYouBook: [
      "List the tanks and sumps on site, with approximate capacities if known.",
      "Identify who can authorise access to roofs, plant rooms and sump covers.",
      "Note any times when supply must not be interrupted.",
      "Have a contact person available on the day of the assessment.",
    ],
    faqIds: ["commercial-scheduling", "how-often-clean", "how-pricing-works"],
    relatedServiceSlugs: ["sump-cleaning", "water-tank-vacuum-cleaning"],
    relatedArticleSlugs: [
      "choosing-a-water-tank-cleaning-service",
      "how-often-should-you-clean-your-water-tank",
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServicesBySlugs(slugs: readonly string[]): Service[] {
  return slugs.flatMap((slug) => {
    const service = getServiceBySlug(slug);
    return service ? [service] : [];
  });
}
