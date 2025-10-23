import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootRedirect() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = cookieLocale === 'en' || cookieLocale === 'fr' ? cookieLocale : 'fr';
  redirect(`/${locale}`);
}

