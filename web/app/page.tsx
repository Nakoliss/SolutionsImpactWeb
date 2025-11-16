import type { Metadata } from 'next';

import LocaleLayout from './[locale]/layout';
import { buildHomeMetadata, renderHomePage, revalidate as localizedRevalidate } from './[locale]/page';

export const revalidate = localizedRevalidate;

export default async function RootHomePage() {
  const locale = 'fr';
  const pageChildren = await renderHomePage(locale);

  return (
    <LocaleLayout params={{ locale }}>
      {pageChildren}
    </LocaleLayout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeMetadata('fr');
}

