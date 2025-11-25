export type BundleSlug = "essentials" | "growth" | "pro";

export interface Bundle {
  slug: BundleSlug;
  title: string;
  otLabel: string;   // One-Time
  mLabel: string;    // Mensuel
  otPrice: number;   // 2999, 3999, 5999
  mPrice: number;    // 299, 849, 1599
  features: string[];
  ctaBook: string;   // Planifier un diagnostic
  ctaBuy?: string;   // Commander en ligne (Stripe)
}

export const BUNDLES: Bundle[] = [
  {
    slug: "essentials",
    title: "Essentials",
    otLabel: "Mise en place (OT)",
    mLabel: "Mensuel (M)",
    otPrice: 2999,
    mPrice: 299,
    features: [
      "Site de base 1–5 pages",
      "Maintenance Basic",
      "Google Business Profile (setup)",
      "Conformité Loi 25 (politique/cookies, FR)",
    ],
    ctaBook: "Planifier un diagnostic",
    ctaBuy: "Commander (OT ou Mensuel)"
  },
  {
    slug: "growth",
    title: "Growth",
    otLabel: "Mise en place (OT)",
    mLabel: "Mensuel (M)",
    otPrice: 3999,
    mPrice: 849,
    features: [
      "Site Premium",
      "Maintenance Standard",
      "SEO Lite (1–2 articles/mo)",
      "GBP management + Social Starter (8 posts/mo)"
    ],
    ctaBook: "Planifier un diagnostic",
    ctaBuy: "Commander (OT ou Mensuel)"
  },
  {
    slug: "pro",
    title: "Pro / AI Visibility",
    otLabel: "Mise en place (OT)",
    mLabel: "Mensuel (M)",
    otPrice: 5999,
    mPrice: 1599,
    features: [
      "Site Premium ou E‑commerce",
      "Maintenance Plus (support prioritaire)",
      "SEO Premium + AEO/GEO",
      "GBP mgmt + Social Growth (12 posts/mo)"
    ],
    ctaBook: "Planifier un diagnostic",
    ctaBuy: "Commander (OT ou Mensuel)"
  }
];


