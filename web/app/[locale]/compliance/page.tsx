import Link from 'next/link';

import CanonicalLink from '@/components/CanonicalLink';
import HrefLangLinks from '@/components/HrefLangLinks';
import StructuredData from '@/components/StructuredData';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { getCategoryContent } from '@/lib/mdx';
import { generateMetadata as generateBaseMetadata } from '@/lib/metadata';
import {
  buildServices,
  generateBreadcrumbsFromPath,
  getComplianceFaq,
} from '@/lib/seo/structuredData';

interface CompliancePageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export async function generateMetadata({ params }: CompliancePageProps) {
  const { locale } = await params;

  const titles = {
    fr: 'Expertise en Confidentialité et Conformité',
    en: 'Data Privacy & Compliance Expertise',
  };

  const descriptions = {
    fr: 'Expertise mondiale en protection des données : GDPR, PIPEDA et Loi 25 du Québec. Nous appliquons les normes les plus strictes pour protéger vos clients.',
    en: 'Global data protection expertise: GDPR, PIPEDA, and Quebec Law 25. We apply the highest privacy standards to protect your customers.',
  };

  return generateBaseMetadata({
    title: titles[locale],
    description: descriptions[locale],
    locale,
    canonical: '/compliance',
    alternateLocales: SUPPORTED_LOCALES,
  });
}

export default async function CompliancePage({ params }: CompliancePageProps) {
  const { locale } = await params;

  const complianceContent = getCategoryContent('compliance').filter((item) =>
    item.metadata.localeAvail.includes(locale)
  );

  // Group by slug to get unique content
  const contentBySlug = complianceContent.reduce(
    (acc, item) => {
      if (!acc[item.slug]) {
        acc[item.slug] = item;
      }
      return acc;
    },
    {} as Record<string, (typeof complianceContent)[0]>
  );

  const uniqueContent = Object.values(contentBySlug);

  const content = {
    fr: {
      title: 'Expertise en Confidentialité et Conformité',
      subtitle:
        'Des normes mondiales de protection des données, appliquées avec rigueur',
      description:
        'Nous maîtrisons les réglementations les plus strictes en matière de protection des données : GDPR, PIPEDA et Loi 25 du Québec. Cette expertise globale nous permet de vous accompagner dans tous vos marchés.',
      globalStandards: {
        title: 'Normes Mondiales de Confidentialité',
        items: [
          {
            name: 'GDPR',
            region: 'Europe',
            description: 'Règlement européen sur la protection des données',
          },
          {
            name: 'PIPEDA',
            region: 'Canada',
            description:
              'Loi fédérale canadienne sur la protection des renseignements personnels',
          },
          {
            name: 'Loi 25',
            region: 'Québec',
            description:
              'La référence en matière de protection de la vie privée au Canada',
          },
        ],
      },
      features: {
        law25: {
          title: 'Loi 25 (Projet de loi 64)',
          description:
            'Guide complet sur les exigences de résidence des données et de protection de la vie privée.',
        },
        dataResidency: {
          title: 'Résidence des Données',
          description:
            "Solutions techniques pour respecter les exigences d'hébergement au Canada.",
        },
        privacy: {
          title: 'Protection de la Vie Privée',
          description:
            'Politiques et procédures conformes aux standards québécois.',
        },
        audit: {
          title: 'Audit de Conformité',
          description:
            'Évaluation complète de votre infrastructure et processus.',
        },
      },
      cta: {
        primary: 'Évaluation gratuite',
        secondary: 'Voir nos guides',
      },
      benefits: {
        title: 'Pourquoi la Conformité est Essentielle',
        items: [
          "Éviter les amendes de la CAI pouvant atteindre 25M$ ou 4% du chiffre d'affaires",
          'Protéger la réputation et la confiance de vos clients',
          'Accéder aux marchés publics et contrats gouvernementaux',
          'Démontrer votre professionnalisme et expertise',
        ],
      },
      quebecSection: {
        title: 'Expertise Québec : Loi 25 en Profondeur',
        subtitle: 'Notre spécialité locale pour les entreprises québécoises',
      },
    },
    en: {
      title: 'Data Privacy & Compliance Expertise',
      subtitle: 'Global data protection standards, rigorously applied',
      description:
        'We master the strictest data protection regulations: GDPR, PIPEDA, and Quebec Law 25. This global expertise enables us to support you across all your markets.',
      globalStandards: {
        title: 'Global Privacy Standards',
        items: [
          {
            name: 'GDPR',
            region: 'Europe',
            description: 'European data protection regulation',
          },
          {
            name: 'PIPEDA',
            region: 'Canada',
            description: 'Canadian federal privacy law for the private sector',
          },
          {
            name: 'Law 25',
            region: 'Quebec',
            description: "Canada's gold standard for privacy protection",
          },
        ],
      },
      features: {
        law25: {
          title: 'Law 25 (Bill 64)',
          description:
            'Comprehensive guide on data residency and privacy protection requirements.',
        },
        dataResidency: {
          title: 'Data Residency',
          description:
            'Technical solutions to meet Canada hosting requirements.',
        },
        privacy: {
          title: 'Privacy Protection',
          description:
            'Policies and procedures compliant with Quebec standards.',
        },
        audit: {
          title: 'Compliance Audit',
          description:
            'Complete assessment of your infrastructure and processes.',
        },
      },
      cta: {
        primary: 'Free assessment',
        secondary: 'View our guides',
      },
      benefits: {
        title: 'Why Compliance is Essential',
        items: [
          'Avoid CAI fines up to $25M or 4% of revenue',
          'Protect reputation and customer trust',
          'Access public markets and government contracts',
          'Demonstrate professionalism and expertise',
        ],
      },
      quebecSection: {
        title: 'Quebec Expertise: Law 25 Deep Dive',
        subtitle: 'Our local specialty for Quebec businesses',
      },
    },
  };

  const t = content[locale];
  const contactHref = buildLocalePath(locale, '/contact');
  const complianceHubHref = buildLocalePath(locale, '/content/compliance');
  const heatmapHref = buildLocalePath(locale, '/compliance/heatmap');
  const aiRoadmapHref = buildLocalePath(locale, '/ai-roadmap');

  const breadcrumbs = generateBreadcrumbsFromPath('/compliance', locale);
  const servicesForSchema = buildServices(locale);
  const complianceService = servicesForSchema.find(
    (service) => service.serviceType === 'Compliance Consulting'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <CanonicalLink locale={locale} path="/compliance" />
      <HrefLangLinks currentLocale={locale} path="/compliance" />
      <StructuredData
        locale={locale}
        {...(complianceService && { services: [complianceService] })}
        breadcrumbs={breadcrumbs}
        faq={getComplianceFaq(locale)}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {t.subtitle}
            </p>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto">
              {t.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={contactHref}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-gradient-to-r from-[#2563eb] to-[#38bdf8] hover:from-[#1e40af] hover:to-[#0ea5e9] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {t.cta.primary}
            </Link>
            <Link
              href={complianceHubHref}
              className="inline-flex items-center px-8 py-4 border border-white/30 text-lg font-medium rounded-md text-slate-200 bg-black/20 hover:bg-black/30 hover:border-white/50 transition-colors"
            >
              {t.cta.secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Tier 1: Global Privacy Standards */}
      <section className="py-16 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-center mb-4">
            {t.globalStandards.title}
          </h2>
          <p className="text-center text-slate-300 mb-12 max-w-2xl mx-auto">
            {locale === 'fr'
              ? 'Les réglementations que nous maîtrisons pour protéger vos clients dans tous vos marchés'
              : 'The regulations we master to protect your customers across all your markets'}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {t.globalStandards.items.map((standard) => (
              <div
                key={standard.name}
                className="rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20 p-6 text-center transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400/20 to-cyan-500/20 rounded-full ring-1 ring-sky-400/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300 mb-2">
                  {standard.region}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {standard.name}
                </h3>
                <p className="text-slate-300 text-sm">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier 2: Quebec Specifics Header */}
      <section className="py-8 bg-gradient-to-r from-[#1e40af]/20 via-[#2563eb]/20 to-[#0ea5e9]/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {t.quebecSection.title}
          </h2>
          <p className="text-slate-300">{t.quebecSection.subtitle}</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gradient-to-br from-slate-900/40 via-slate-950 to-slate-900/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(t.features).map(([key, feature]) => (
              <div key={key} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400/20 to-cyan-500/20 rounded-lg ring-1 ring-sky-400/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Tools */}
      <section className="py-16 bg-gradient-to-br from-slate-900/60 via-slate-950 to-slate-900/60 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-center mb-12">
            {locale === 'fr' ? 'Outils de Conformité' : 'Compliance Tools'}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Compliance Heatmap Tool */}
            <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20 p-6 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400/20 to-cyan-500/20 rounded-lg ring-1 ring-sky-400/20 flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {locale === 'fr'
                    ? 'Carte de Chaleur de Conformité'
                    : 'Compliance Heatmap'}
                </h3>
              </div>

              <p className="text-slate-300 mb-6">
                {locale === 'fr'
                  ? "Identifiez vos priorités de conformité selon votre secteur, taille d'organisation et types de données. Outil interactif optimisé pour la Loi 25 du Québec."
                  : 'Identify your compliance priorities based on your sector, organization size and data types. Interactive tool optimized for Quebec Law 25.'}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {locale === 'fr' ? 'Loi 25' : 'Law 25'}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  {locale === 'fr' ? 'Interactif' : 'Interactive'}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {locale === 'fr' ? 'Priorisé' : 'Prioritized'}
                </span>
              </div>

              <Link
                href={heatmapHref}
                className="inline-flex items-center bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white px-6 py-3 rounded-lg font-medium hover:from-[#1e40af] hover:to-[#0ea5e9] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {locale === 'fr' ? "Utiliser l'outil" : 'Use Tool'}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* AI Roadmap Generator Tool */}
            <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20 p-6 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400/20 to-cyan-500/20 rounded-lg ring-1 ring-sky-400/20 flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {locale === 'fr'
                    ? 'Générateur de Feuille de Route IA'
                    : 'AI Roadmap Generator'}
                </h3>
              </div>

              <p className="text-slate-300 mb-6">
                {locale === 'fr'
                  ? 'Créez une feuille de route personnalisée pour votre transformation IA en respectant les exigences de conformité. Planification chronologique avec budget et délais.'
                  : 'Create a personalized roadmap for your AI transformation while meeting compliance requirements. Chronological planning with budget and timelines.'}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  {locale === 'fr' ? 'Disponible' : 'Available'}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {locale === 'fr' ? 'Loi 25' : 'Law 25'}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {locale === 'fr' ? 'Planification' : 'Planning'}
                </span>
              </div>

              <Link
                href={aiRoadmapHref}
                className="inline-flex items-center bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white px-6 py-3 rounded-lg font-medium hover:from-[#1e40af] hover:to-[#0ea5e9] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {locale === 'fr'
                  ? 'Créer ma feuille de route'
                  : 'Create My Roadmap'}
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Resources */}
      <section className="py-16 bg-gradient-to-br from-slate-900/40 via-slate-950 to-slate-900/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-center mb-12">
            {locale === 'fr'
              ? 'Nos Ressources de Conformité'
              : 'Our Compliance Resources'}
          </h2>

          {uniqueContent.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {uniqueContent.map((item) => (
                <article
                  key={item.slug}
                  className="rounded-2xl border border-white/15 bg-gradient-to-br from-black/40 via-black/30 to-black/20 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {item.metadata.title}
                    </h3>
                    <p className="text-slate-300 mb-4">
                      {item.metadata.description}
                    </p>

                    {item.metadata.tags && item.metadata.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {item.metadata.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={buildLocalePath(
                        locale,
                        `/content/compliance/${item.slug}`
                      )}
                      className="inline-flex items-center text-sky-400 hover:text-sky-300 font-medium"
                    >
                      {locale === 'fr' ? 'Lire le guide' : 'Read guide'}
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                {locale === 'fr'
                  ? 'Nos guides de conformité sont en cours de préparation.'
                  : 'Our compliance guides are being prepared.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent text-center mb-12">
            {t.benefits.title}
          </h2>

          <div className="space-y-6">
            {t.benefits.items.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-4 text-slate-300 text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#0ea5e9] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {locale === 'fr'
              ? 'Prêt à Assurer votre Conformité ?'
              : 'Ready to Ensure Your Compliance?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {locale === 'fr'
              ? 'Contactez-nous pour une évaluation gratuite de votre conformité à la Loi 25.'
              : 'Contact us for a free Law 25 compliance assessment.'}
          </p>
          <Link
            href={contactHref}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-slate-900 bg-white hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
          >
            {locale === 'fr' ? "Démarrer l'évaluation" : 'Start assessment'}
          </Link>
        </div>
      </section>
    </div>
  );
}
