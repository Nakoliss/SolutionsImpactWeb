import { redirect } from 'next/navigation';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';

interface Loi25PageProps {
  params: {
    locale: SupportedLocale;
  };
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default function Loi25Page({ params }: Loi25PageProps) {
  const { locale } = params;
  // Redirect to the main compliance page which has comprehensive Law 25 content
  redirect(buildLocalePath(locale, '/compliance'));
}
