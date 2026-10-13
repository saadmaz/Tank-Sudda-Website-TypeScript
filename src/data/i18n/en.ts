/**
 * English interface text and the shape every translation must follow.
 *
 * Content that already lives in src/data (services, FAQs, commitments…) is
 * reused here, so English has a single source of truth. Sinhala and Tamil
 * provide the same keys in si.ts and ta.ts; TypeScript rejects a translation
 * with a missing key.
 */
import { business } from "@/data/business";
import { faqCategories, faqs } from "@/data/faqs";
import { pricingFactors } from "@/data/pricing";
import { services, type ServiceSection, type ServiceStep } from "@/data/services";
import { commitments, customerJourney } from "@/data/site-content";
import { serviceEnquiryMessage } from "@/lib/whatsapp";

export interface ServiceText {
  name: string;
  shortName: string;
  summary: string;
  metaDescription: string;
  intro: string;
  suitableFor: string[];
  whatItInvolves: string[];
  process: ServiceStep[];
  sections: ServiceSection[];
  beforeYouBook: string[];
}

export interface TitledText {
  title: string;
  description: string;
}

export interface PageMeta {
  title: string;
  description: string;
}

const serviceText = Object.fromEntries(
  services.map((service): [string, ServiceText] => [
    service.slug,
    {
      name: service.name,
      shortName: service.shortName,
      summary: service.summary,
      metaDescription: service.metaDescription,
      intro: service.intro,
      suitableFor: service.suitableFor,
      whatItInvolves: service.whatItInvolves,
      process: service.process,
      sections: service.sections,
      beforeYouBook: service.beforeYouBook,
    },
  ]),
);

const faqText = Object.fromEntries(
  faqs.map((faq): [string, { question: string; answer: string }] => [
    faq.id,
    { question: faq.question, answer: faq.answer },
  ]),
);

export const en = {
  content: {
    services: serviceText,
    faqs: faqText,
    faqCategories: { ...faqCategories },
    customerJourney: customerJourney,
    commitments: commitments,
    pricingFactors: pricingFactors,
    quotationSteps: [
      {
        title: "Send your details",
        description: "Use the booking form to describe your property, tanks and preferred timing.",
      },
      {
        title: "Receive a quotation",
        description:
          "We review the details and contact you with a quotation, or arrange a site assessment for larger jobs.",
      },
      {
        title: "Confirm the booking",
        description:
          "Once you accept the quotation, we agree a date. Your booking is only confirmed at this point.",
      },
    ],
  },

  common: {
    skipLink: "Skip to main content",
    home: "Home",
    breadcrumb: "Breadcrumb",
    requestBooking: "Request a booking",
    requestQuotation: "Request a quotation",
    howPricingWorks: "How pricing works",
    bookCleaning: "Book a cleaning",
    bookShort: "Book",
    chatOnWhatsApp: "Chat on WhatsApp",
    askOnWhatsApp: "Ask on WhatsApp",
    opensWhatsApp: " (opens WhatsApp)",
    opensNewTab: " (opens in a new tab)",
    call: "Call",
    orCall: "Or call",
    callNumber: (number: string) => `Call ${number}`,
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    quotedAfterAssessment: "Quoted after assessment",
    priceFrom: (amount: string) => `From ${amount}`,
    /** Appended to links that lead to pages only available in English. */
    inEnglish: "",
    logoHome: `${business.name} home`,
    socialProfile: (platform: string) => `${business.name} on ${platform}`,
    language: "Language",
    reviewNotice: "",
  },

  nav: {
    "/": "Home",
    "/services": "Services",
    "/pricing": "Pricing",
    "/guides": "Guides",
    "/blog": "Blog",
    "/about": "About",
    "/contact": "Contact",
    "/faq": "FAQ",
    "/services/water-tank-deep-cleaning": "Deep cleaning",
    "/services/sump-cleaning": "Sump cleaning",
    "/services/commercial-tank-cleaning": "Commercial cleaning",
    "/areas": "Service areas",
    "/gallery": "Gallery",
    "/testimonials": "Testimonials",
    "/book": "Book a cleaning",
    "/privacy": "Privacy",
    "/terms": "Terms",
    "/cookies": "Cookies",
  },

  chrome: {
    tagline: "Clean water for anyone and everyone.",
    contactDetails: "Contact details",
    mainNav: "Main",
    mobileNav: "Mobile",
    siteMenu: "Site menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    footerGroups: { services: "Services", learn: "Learn", company: "Company" },
    footerGroupLinks: (title: string) => `${title} links`,
    followUs: "Follow us",
    legal: "Legal",
    description: business.description,
  },

  whatsapp: {
    general: serviceEnquiryMessage(),
    service: (serviceName: string) => serviceEnquiryMessage(serviceName),
  },

  cta: {
    title: "Ready to have your tank cleaned?",
    body: "Tell us about your property and tanks. We will review your request and contact you to confirm the details, the quotation and a date.",
  },

  faqSection: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    seeAll: "See all questions",
  },

  hero: {
    kicker: "Water tank & sump cleaning in Sri Lanka",
    line1: "Clean tanks.",
    line2: "Done properly.",
    intro:
      "Professional water tank and sump cleaning for homes, apartment buildings and organisations in Sri Lanka. We remove the sediment and build-up you can’t see.",
    assurances: [
      { title: "Quotation first", description: "You know the cost before any work starts." },
      {
        title: "Sediment removed",
        description: "Lifted out of the tank, never flushed into your pipes.",
      },
      {
        title: "Homes to large sites",
        description: "Houses, apartment buildings and organisations.",
      },
    ],
  },

  home: {
    meta: {
      title: "Tank Sudda | Water Tank & Sump Cleaning in Sri Lanka",
      description:
        "Water tank deep cleaning and sump cleaning for homes, apartments and organisations in Sri Lanka. Request a booking with Tank Sudda.",
    },
    servicesEyebrow: "Our services",
    servicesTitle: "The right clean for every tank",
    servicesIntro:
      "From a single rooftop tank to every tank and sump in a building, we drain, clean and restore water storage properly.",
    compareAll: "Compare all services",
    processEyebrow: "How it works",
    processTitle: "From request to a clean tank",
    processIntro: "Booking is simple, and nothing is confirmed until we have spoken with you.",
    articlesEyebrow: "Guides",
    articlesTitle: "Learn about tank care",
    articlesIntro:
      "Practical, plain-language advice on keeping water tanks and sumps in good condition.",
    browseGuides: "Browse all guides",
  },

  why: {
    eyebrow: "Why it matters",
    title: "What collects in your tank doesn’t stay there",
    intro:
      "Most homes and buildings store water in a sump and an overhead tank. Both are out of sight, so sediment and build-up can go unnoticed for years.",
    points: [
      {
        title: "It builds up gradually",
        description:
          "Fine particles carried in by the supply settle on the tank floor every time it refills.",
      },
      {
        title: "It can be stirred up",
        description:
          "Incoming water can disturb the layer, which is one reason for cloudy water or grit at the tap.",
      },
      {
        title: "It hides the tank floor",
        description: "A thick layer makes cracks, damage and other problems harder to spot.",
      },
    ],
    readMore: "Read: understanding sediment in water tanks",
  },

  commitments: {
    eyebrow: `Why ${business.name}`,
    title: "How we work",
    intro:
      "Straightforward commitments that apply to every job, from a single home tank to a whole building.",
    aboutUs: "About us",
  },

  pricingTeaser: {
    eyebrow: "Pricing",
    title: "A clear quotation before any work starts",
    intro:
      "Every tank is different, so we quote based on your tank rather than a one-size price. You will know the cost before you agree to anything.",
    factorsHeading: "What affects the price",
  },

  areas: {
    eyebrow: "Service areas",
    title: "Where we work",
    introWithAreas:
      "We currently serve the areas below. If your location isn't listed, ask us and we will tell you honestly whether we can help.",
    introNoAreas:
      "We work in Sri Lanka. Include your town and address when you request a booking and we will confirm whether we can serve your location before arranging anything.",
    coverageLink: "About our service coverage",
  },

  proof: {
    galleryEyebrow: "Our work",
    galleryTitle: "Recent projects",
    viewGallery: "View the gallery",
    beforeAfterEyebrow: "Before and after",
    beforeAfterTitle: "The difference a clean makes",
    beforeAfterIntro: "Photographs taken before and after cleaning on the same job.",
    testimonialsEyebrow: "Customer feedback",
    testimonialsTitle: "What customers say",
    readMoreFeedback: "Read more feedback",
    googleTitle: "Reviews on Google",
    googleBody: `Read what customers say about ${business.name} on Google, or share your own experience.`,
    readReviews: "Read our reviews",
    leaveReview: "Leave a review",
    opensGoogle: " (opens Google in a new tab)",
  },

  serviceCard: {
    viewService: "View service",
  },

  servicesPage: {
    meta: {
      title: "Water Tank & Sump Cleaning Services",
      description:
        "Compare Tank Sudda's services: water tank deep cleaning, sump cleaning, and commercial and institutional tank cleaning in Sri Lanka.",
    },
    breadcrumb: "Services",
    eyebrow: "Services",
    title: "Cleaning services for tanks and sumps",
    intro:
      "Three services covering domestic tanks, underground sumps and larger buildings. Not sure which you need? Describe your tank when you book and we will recommend the right option.",
    allServices: "All services",
    compareTitle: "Which service is right for you?",
    compareIntro:
      "A quick comparison. Final recommendations are made after we understand your tank.",
    tableCaption: "Comparison of Tank Sudda services",
    service: "Service",
    bestFor: "Best for",
    price: "Price",
    journeyEyebrow: "How booking works",
    journeyTitle: "What happens after you request a booking",
  },

  servicePage: {
    eyebrow: "Service",
    bookThis: "Book this service",
    involves: "What the service involves",
    process: "Our process",
    beforeYouBook: "Before you book",
    prepBefore: "Read our ",
    prepLink: "preparation guide",
    prepAfter: " for more detail.",
    faqHeading: (shortName: string) => `Questions about ${shortName.toLowerCase()}`,
    summaryLabel: "Service summary",
    price: "Price",
    priceNote: "Depends on capacity, access and condition.",
    suitableFor: "Suitable for",
    relatedServices: "Related services",
    helpfulGuides: "Helpful guides",
    ctaTitle: (shortName: string) => `Book ${shortName.toLowerCase()}`,
  },

  pricingPage: {
    meta: {
      title: "Pricing & Quotations",
      description:
        "How Tank Sudda prices water tank and sump cleaning in Sri Lanka: what affects the cost, how quotations work, and how to request one.",
    },
    breadcrumb: "Pricing",
    eyebrow: "Pricing",
    title: "Clear quotations, agreed before work begins",
    intro:
      "Tanks vary widely in size, access and condition, so we price each job on what it actually involves. You receive a quotation before anything is booked, and nothing is charged that you have not agreed.",
    pricesTitle: "Prices by service",
    noticeTitle: "All services are currently quoted individually",
    noticeBody:
      "Send us your tank details through the booking form and we will reply with a quotation. For larger or multi-tank sites, we may need to assess the site first.",
    factorsTitle: "What affects the price",
    factorsIntro:
      "Giving us accurate details in your booking request helps us quote quickly and accurately.",
    quoteTitle: "How quotations work",
    ctaTitle: "Get a quotation for your tank",
  },

  aboutPage: {
    meta: {
      title: "About Tank Sudda",
      description:
        "Tank Sudda is a water tank and sump cleaning service in Sri Lanka. Learn what we do, how we work and what you can expect from us.",
    },
    breadcrumb: "About",
    eyebrow: "About us",
    title: "Looking after the water you store",
    intro: `${business.name} is a water tank and sump cleaning service in ${business.countryName}. We clean the tanks that homes, apartment buildings and organisations depend on every day.`,
    storyTitle: "Why tank cleaning matters",
    storyParagraphs: [
      "In many Sri Lankan homes and buildings, water passes through an underground sump and an overhead tank before it reaches the tap. Both quietly collect sediment and debris over time, and because they are out of sight, they are easy to overlook.",
      "Our work is simple to describe: we remove what has built up, clean the surfaces, and return the tank to service, keeping you informed about how long your water will be off and anything we notice along the way.",
    ],
    servicesLead: "Our services cover ",
    listSeparator: ", ",
    listAnd: " and ",
    listEnd: ".",
    lowercaseServiceNames: true,
    learnTitle: "Sharing what we know",
    learnBefore:
      "We publish practical guides to help property owners understand their tanks: how sediment builds up, how often to clean, and how to prepare. Start with our ",
    learnGuides: "guides",
    learnMiddle: " or browse the ",
    learnBlog: "blog",
    learnAfter: ".",
  },

  contactPage: {
    meta: {
      title: "Contact Tank Sudda",
      description:
        "Contact Tank Sudda about water tank and sump cleaning in Sri Lanka. Call, WhatsApp or email us, or request a booking online.",
    },
    breadcrumb: "Contact",
    eyebrow: "Contact",
    title: "Talk to Tank Sudda",
    introBefore:
      "Questions about tank or sump cleaning? Call, WhatsApp or email us. If you already know what you need, the ",
    introLink: "booking form",
    introAfter: " is the quickest way to request a cleaning.",
    contactDetails: "Contact details",
    socialLabel: "Social media and reviews",
    followTitle: `Follow ${business.name}`,
    followBody: "See our latest work and tank care tips.",
    sendMessage: "Send a message",
    needCleaning: "Need a cleaning?",
    needCleaningBody:
      "Tell us about your property and tanks in a few short steps. We will contact you to confirm the details, the quotation and a date.",
    enquiryLabel: "About your enquiry",
    openingHours: "Opening hours",
    detailsTitle: "How we use your details",
    detailsBefore:
      "We use your details only to reply to you and arrange any cleaning you request. Read our ",
    detailsLink: "privacy policy",
    detailsAfter: " for more information.",
  },

  faqPage: {
    meta: {
      title: "Frequently Asked Questions",
      description:
        "Answers to common questions about water tank and sump cleaning: how often to clean, how long water is off, how to prepare, and how pricing works.",
    },
    breadcrumb: "FAQ",
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    intro: "Can’t find what you need? Call, WhatsApp or email us and we will get back to you.",
    topics: "FAQ topics",
  },
};

export type Dictionary = typeof en;
