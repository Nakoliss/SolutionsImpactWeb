import type { SupportedLocale } from '@/content';
import type {
  BreadcrumbList,
  FAQPage,
  LocalBusiness,
  Organization,
  Service,
} from '@/lib/seo/structuredData';
import { generatePageStructuredData } from '@/lib/seo/structuredData';

interface StructuredDataProps {
  locale?: SupportedLocale;
  organization?: boolean | Organization;
  localBusiness?: boolean | LocalBusiness;
  services?: Service[];
  breadcrumbs?: BreadcrumbList;
  faq?: FAQPage;
}

export default function StructuredData({
  locale = 'fr',
  organization = false,
  localBusiness = false,
  services,
  breadcrumbs,
  faq,
}: StructuredDataProps) {
  const schemas = generatePageStructuredData({
    locale,
    organization,
    localBusiness,
    ...(services && { services }),
    ...(breadcrumbs && { breadcrumbs }),
    ...(faq && { faq }),
  });

  if (schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      ))}
    </>
  );
}
