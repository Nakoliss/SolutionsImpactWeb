'use client';

import { useTranslations } from 'next-intl';

import type { SupportedLocale } from '@/content';
import { buildLocalePath } from '@/lib/localeRouting';
import { useThemeStyles } from '@/lib/designContext';

interface HomePackagesSectionProps {
  locale: SupportedLocale;
}

export function HomePackagesSection({ locale }: HomePackagesSectionProps) {
  const { themeStyles, cardStyle, buttonPrimaryStyle, buttonSecondaryStyle } = useThemeStyles();
  const t = useTranslations('packages');
  const homeHref = buildLocalePath(locale);

  const packages = [
    {
      id: 'diagnostic',
      name: t('diagnostic.name'),
      price: t('diagnostic.price'),
      description: t('diagnostic.description'),
      features: t('diagnostic.features').split('|'),
      popular: false,
    },
    {
      id: 'bilingual',
      name: t('bilingual.name'),
      price: t('bilingual.price'),
      description: t('bilingual.description'),
      features: t('bilingual.features').split('|'),
      popular: true,
    },
    {
      id: 'growth',
      name: t('growth.name'),
      price: t('growth.price'),
      description: t('growth.description'),
      features: t('growth.features').split('|'),
      popular: false,
    },
    {
      id: 'enterprise',
      name: t('enterprise.name'),
      price: t('enterprise.price'),
      description: t('enterprise.description'),
      features: t('enterprise.features').split('|'),
      popular: false,
    },
  ];

  const content = {
    fr: {
      title: 'Forfaits Signature',
      subtitle: 'Solutions complètes adaptées à vos besoins',
      description:
        'Nos forfaits signature combinent plusieurs services pour offrir des solutions complètes et cohérentes. Chaque forfait est conçu pour répondre aux besoins spécifiques des entreprises à différentes étapes de leur transformation numérique.',
      upgrade: {
        title: 'Évolution et Combinaisons',
        description:
          'Nos forfaits sont conçus pour évoluer avec votre entreprise. Vous pouvez commencer par un forfait de base et l’étendre ou le combiner avec d’autres selon vos besoins.',
        benefits: [
          'Passage fluide d’un forfait à l’autre',
          'Combinaisons personnalisées possibles',
          'Tarifs préférentiels pour les forfaits multiples',
          'Support continu pendant la transition',
        ],
      },
      faq: {
        title: 'Questions Fréquentes',
        q1: 'Puis-je personnaliser un forfait?',
        a1: 'Oui, tous nos forfaits peuvent être adaptés selon vos besoins spécifiques.',
        q2: 'Que se passe-t-il si mes besoins changent?',
        a2: 'Vous pouvez ajuster ou changer de forfait à tout moment avec notre équipe.',
        q3: 'Y a-t-il des engagements à long terme?',
        a3: 'Les engagements varient selon le forfait. Nous offrons des options flexibles.',
      },
      cta: {
        title: 'Besoin d’Aide pour Choisir?',
        description: 'Notre équipe peut vous aider à sélectionner le forfait idéal pour votre entreprise.',
        button: 'Consultation Gratuite',
      },
    },
    en: {
      title: 'Signature Packages',
      subtitle: 'Complete solutions tailored to your needs',
      description:
        'Our signature packages combine multiple services to offer complete and coherent solutions. Each package is designed to meet the specific needs of businesses at different stages of their digital transformation.',
      upgrade: {
        title: 'Evolution & Combinations',
        description:
          'Our packages are built to evolve with your business. Start with a core package and expand or combine with others as your needs grow.',
        benefits: [
          'Seamless transition between packages',
          'Custom combinations available',
          'Preferential rates for multiple packages',
          'Ongoing support throughout the transition',
        ],
      },
      faq: {
        title: 'Frequently Asked Questions',
        q1: 'Can I customize a package?',
        a1: 'Yes, all of our packages can be tailored to your specific needs.',
        q2: 'What if my needs change?',
        a2: 'You can adjust or change packages at any time with our team.',
        q3: 'Are there long-term commitments?',
        a3: 'Commitments vary by package. We offer flexible options.',
      },
      cta: {
        title: 'Need Help Choosing?',
        description: 'Our team can help you select the ideal package for your business.',
        button: 'Free Consultation',
      },
    },
  };

  const pageContent = content[locale];

  return (
    <section
      id="home-packages"
      className="border-t border-white/10 bg-slate-950"
      style={themeStyles}
    >
      {/* Hero */}
      <div
        className="border-b"
        style={{
          background: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent"
              style={{ background: 'var(--theme-gradient)', WebkitBackgroundClip: 'text' }}
            >
              {pageContent.title}
            </h2>
            <p
              className="mt-6 text-xl"
              style={{ color: 'var(--theme-muted)' }}
            >
              {pageContent.subtitle}
            </p>
            <p
              className="mt-4 text-lg max-w-3xl mx-auto"
              style={{ color: 'var(--theme-muted)' }}
            >
              {pageContent.description}
            </p>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div
        className="border-b py-16"
        style={{
          background: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-lg border-2 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl ${
                  pkg.popular ? 'ring-2' : ''
                }`}
                style={{
                  ...cardStyle,
                  border: pkg.popular ? '2px solid var(--theme-accent)' : '2px solid var(--theme-card-border)',
                  ...(pkg.popular && {
                    '--tw-ring-color': 'var(--theme-accent)',
                    '--tw-ring-opacity': '0.5',
                  }),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--theme-hover-shadow)';
                  e.currentTarget.style.borderColor = 'var(--theme-border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = pkg.popular
                    ? 'var(--theme-accent)'
                    : 'var(--theme-card-border)';
                }}
              >
                {pkg.popular && (
                  <div
                    className="absolute right-0 top-0 px-3 py-1 text-sm font-medium"
                    style={{
                      background: 'var(--theme-accent)',
                      color: 'var(--theme-contrast-text)',
                    }}
                  >
                    {locale === 'fr' ? 'Solution clé en main' : 'Popular'}
                  </div>
                )}

                <div className="flex h-full flex-col p-6">
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {pkg.name}
                  </h3>
                  <div className="mt-3 text-3xl font-bold" style={{ color: 'var(--theme-accent)' }}>
                    {pkg.price}
                  </div>
                  <p className="mt-4 text-sm" style={{ color: 'var(--theme-muted)' }}>
                    {pkg.description}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="mr-3 mt-1 h-5 w-5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: 'var(--theme-accent)' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: 'var(--theme-text)' }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <button
                      className="w-full rounded-lg px-4 py-3 font-medium transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
                      style={pkg.popular ? buttonPrimaryStyle : buttonSecondaryStyle}
                      onClick={() => {
                        const contactSection = document.getElementById('contact');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.location.href = `${homeHref}#contact`;
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'var(--theme-hover-shadow)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
                      {locale === 'fr' ? 'Choisir ce forfait' : 'Choose Package'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      <div className="py-16" style={{ background: 'var(--theme-surface)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{ background: 'var(--theme-gradient)', WebkitBackgroundClip: 'text' }}
            >
              {pageContent.upgrade.title}
            </h3>
            <p className="mt-4 text-lg text-slate-200" style={{ color: 'var(--theme-muted)' }}>
              {pageContent.upgrade.description}
            </p>
          </div>

          <div className="mt-12 grid items-center gap-12 md:grid-cols-2">
            <div>
              <ul className="space-y-4">
                {pageContent.upgrade.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: 'var(--theme-accent)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span style={{ color: 'var(--theme-text)' }}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
              style={{
                ...cardStyle,
                border: '1px solid var(--theme-card-border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--theme-hover-shadow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <h4 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
                {locale === 'fr' ? 'Parcours Typique' : 'Typical Journey'}
              </h4>
              <div className="mt-6 space-y-4">
                {(
                  locale === 'fr'
                    ? ['Diagnostic & Roadmap', 'Site bilingue + IA', 'Cycles de croissance', 'Partenariat entreprise']
                    : ['Diagnostic & Roadmap', 'Bilingual site + AI', 'Growth sprints', 'Enterprise partnership']
                ).map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className="mr-3 flex h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        background: 'var(--theme-accent)20',
                        border: '1px solid var(--theme-accent)30',
                      }}
                    >
                      <span className="font-semibold text-sm" style={{ color: 'var(--theme-accent)' }}>
                        {index + 1}
                      </span>
                    </div>
                    <span style={{ color: 'var(--theme-text)' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div
        className="border-t py-16"
        style={{
          background: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3
              className="text-3xl font-bold bg-clip-text text-transparent"
              style={{ background: 'var(--theme-gradient)', WebkitBackgroundClip: 'text' }}
            >
              {pageContent.faq.title}
            </h3>
          </div>

          <div className="mt-10 space-y-8">
            {[
              { question: pageContent.faq.q1, answer: pageContent.faq.a1 },
              { question: pageContent.faq.q2, answer: pageContent.faq.a2 },
              { question: pageContent.faq.q3, answer: pageContent.faq.a3 },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                style={{
                  ...cardStyle,
                  border: '1px solid var(--theme-card-border)',
                }}
              >
                <h4 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
                  {item.question}
                </h4>
                <p className="mt-2 text-sm" style={{ color: 'var(--theme-muted)' }}>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="border-t py-16"
        style={{
          background: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3
            className="text-3xl font-bold bg-clip-text text-transparent"
            style={{ background: 'var(--theme-gradient)', WebkitBackgroundClip: 'text' }}
          >
            {pageContent.cta.title}
          </h3>
          <p className="mt-4 text-lg" style={{ color: 'var(--theme-muted)' }}>
            {pageContent.cta.description}
          </p>
          <button
            className="mt-8 inline-flex items-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
            style={buttonPrimaryStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--theme-hover-shadow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '';
            }}
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = `${homeHref}#contact`;
              }
            }}
          >
            {pageContent.cta.button}
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomePackagesSection;
