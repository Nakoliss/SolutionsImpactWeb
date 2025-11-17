import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";

import StructuredData from "@/components/StructuredData";
import { brandConfig } from "@/lib/brand";
import { buildServices } from "@/lib/seo/structuredData";
// Root layout without i18n server hooks; per-locale pages will provide Intl context.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webimpactsolutions.ca";
const normalizedSiteUrl = rawSiteUrl.startsWith("http")
  ? rawSiteUrl
  : `https://${rawSiteUrl.replace(new RegExp("^/+"), "")}`;
const metadataBase = new URL(normalizedSiteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: brandConfig.meta.defaultTitle.fr,
    template: brandConfig.meta.titleTemplate.fr,
  },
  description: brandConfig.meta.description.fr,
  applicationName: brandConfig.name,
  keywords: brandConfig.keywords.fr,
  authors: [{ name: brandConfig.name }],
  openGraph: {
    title: brandConfig.meta.defaultTitle.fr,
    description: brandConfig.meta.description.fr,
    url: normalizedSiteUrl,
    siteName: brandConfig.name,
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: brandConfig.meta.defaultTitle.fr,
    description: brandConfig.meta.description.fr,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale().catch(() => 'fr');

  return (
    <html lang={locale ?? 'fr'} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <StructuredData locale={locale ?? 'fr'} organization localBusiness services={buildServices(locale ?? 'fr')} />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
