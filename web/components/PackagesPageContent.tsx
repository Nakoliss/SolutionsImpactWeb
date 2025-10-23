'use client';

import { useTranslations } from 'next-intl';

import PageViewTracker from '@/components/PageViewTracker';
import { type SupportedLocale } from '@/content';
import { useThemeStyles } from '@/lib/designContext';

interface PackagesPageContentProps {
    locale: SupportedLocale;
}

export default function PackagesPageContent({ locale }: PackagesPageContentProps) {
    const { themeStyles, cardStyle, buttonPrimaryStyle, buttonSecondaryStyle } = useThemeStyles();
    const t = useTranslations('packages');

    const packages = [
        {
            id: 'diagnostic',
            name: t('diagnostic.name'),
            price: t('diagnostic.price'),
            description: t('diagnostic.description'),
            features: t('diagnostic.features').split('|'),
            popular: false
        },
        {
            id: 'bilingual',
            name: t('bilingual.name'),
            price: t('bilingual.price'),
            description: t('bilingual.description'),
            features: t('bilingual.features').split('|'),
            popular: true
        },
        {
            id: 'growth',
            name: t('growth.name'),
            price: t('growth.price'),
            description: t('growth.description'),
            features: t('growth.features').split('|'),
            popular: false
        },
        {
            id: 'enterprise',
            name: t('enterprise.name'),
            price: t('enterprise.price'),
            description: t('enterprise.description'),
            features: t('enterprise.features').split('|'),
            popular: false
        }
    ];

    const content = {
        fr: {
            title: 'Forfaits Signature',
            subtitle: 'Solutions complètes adaptées à vos besoins',
            description: 'Nos forfaits signature combinent plusieurs services pour offrir des solutions complètes et cohérentes. Chaque forfait est conçu pour répondre aux besoins spécifiques des entreprises à différentes étapes de leur transformation numérique.',
            comparison: {
                title: 'Comparaison des Forfaits',
                description: 'Trouvez le forfait qui correspond le mieux à vos besoins et à votre budget.'
            },
            upgrade: {
                title: 'Évolution et Combinaisons',
                description: 'Nos forfaits sont conçus pour évoluer avec votre entreprise. Vous pouvez commencer par un forfait de base et l\'étendre ou le combiner avec d\'autres selon vos besoins.',
                benefits: [
                    'Passage fluide d\'un forfait à l\'autre',
                    'Combinaisons personnalisées possibles',
                    'Tarifs préférentiels pour les forfaits multiples',
                    'Support continu pendant la transition'
                ]
            },
            success: {
                title: 'Histoires de Succès',
                story1: {
                    title: 'Diagnostic & Roadmap',
                    description: 'Une PME a économisé 50% sur ses coûts IT grâce à notre diagnostic approfondi.'
                },
                story2: {
                    title: 'Site Bilingue + IA',
                    description: 'Expansion réussie au marché anglophone avec 200% d\'augmentation du trafic.'
                },
                story3: {
                    title: 'Sprints de Croissance',
                    description: 'Lancement de 3 nouvelles fonctionnalités en 6 mois avec des résultats mesurables.'
                }
            },
            faq: {
                title: 'Questions Fréquentes',
                q1: 'Puis-je personnaliser un forfait?',
                a1: 'Oui, tous nos forfaits peuvent être adaptés selon vos besoins spécifiques.',
                q2: 'Que se passe-t-il si mes besoins changent?',
                a2: 'Vous pouvez ajuster ou changer de forfait à tout moment avec notre équipe.',
                q3: 'Y a-t-il des engagements à long terme?',
                a3: 'Les engagements varient selon le forfait. Nous offrons des options flexibles.'
            },
            cta: {
                title: 'Besoin d\'Aide pour Choisir?',
                description: 'Notre équipe peut vous aider à sélectionner le forfait idéal pour votre entreprise.',
                button: 'Consultation Gratuite'
            }
        },
        en: {
            title: 'Signature Packages',
            subtitle: 'Complete solutions tailored to your needs',
            description: 'Our signature packages combine multiple services to offer complete and coherent solutions. Each package is designed to meet the specific needs of businesses at different stages of their digital transformation.',
            comparison: {
                title: 'Package Comparison',
                description: 'Find the package that best fits your needs and budget.'
            },
            upgrade: {
                title: 'Evolution and Combinations',
                description: 'Our packages are designed to evolve with your business. You can start with a basic package and extend or combine it with others according to your needs.',
                benefits: [
                    'Smooth transition between packages',
                    'Custom combinations possible',
                    'Preferential rates for multiple packages',
                    'Ongoing support during transition'
                ]
            },
            success: {
                title: 'Success Stories',
                story1: {
                    title: 'Diagnostic & Roadmap',
                    description: 'An SME saved 50% on IT costs thanks to our comprehensive diagnostic.'
                },
                story2: {
                    title: 'Bilingual Site + AI',
                    description: 'Successful expansion to English market with 200% traffic increase.'
                },
                story3: {
                    title: 'Growth Sprints',
                    description: 'Launched 3 new features in 6 months with measurable results.'
                }
            },
            faq: {
                title: 'Frequently Asked Questions',
                q1: 'Can I customize a package?',
                a1: 'Yes, all our packages can be adapted according to your specific needs.',
                q2: 'What happens if my needs change?',
                a2: 'You can adjust or change packages at any time with our team.',
                q3: 'Are there long-term commitments?',
                a3: 'Commitments vary by package. We offer flexible options.'
            },
            cta: {
                title: 'Need Help Choosing?',
                description: 'Our team can help you select the ideal package for your business.',
                button: 'Free Consultation'
            }
        }
    };

    const pageContent = content[locale];

    return (
        <div
            className="min-h-screen"
            style={{
                background: `var(--theme-background)`,
                color: `var(--theme-text)`,
                ...themeStyles
            }}
        >
            <PageViewTracker
                locale={locale}
                title={pageContent.title}
                category="packages"
                properties={{ page_type: 'packages_overview' }}
            />

            {/* Breadcrumb */}
            <div
                className="border-b"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <a
                                    href={`/${locale}`}
                                    className="transition-colors duration-300"
                                    style={{
                                        color: `var(--theme-muted)`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = `var(--theme-accent)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = `var(--theme-muted)`;
                                    }}
                                >
                                    {locale === 'fr' ? 'Accueil' : 'Home'}
                                </a>
                            </li>
                            <li>
                                <svg
                                    className="flex-shrink-0 h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    style={{ color: `var(--theme-muted)` }}
                                >
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </li>
                            <li>
                                <span
                                    className="font-medium"
                                    style={{ color: `var(--theme-text)` }}
                                >
                                    {pageContent.title}
                                </span>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <div
                className="border-b"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1
                            className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {pageContent.title}
                        </h1>
                        <p
                            className="mt-6 text-xl max-w-3xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {pageContent.subtitle}
                        </p>
                        <p
                            className="mt-4 text-lg max-w-2xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {pageContent.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Packages Grid */}
            <div
                className="py-16 border-b"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`relative rounded-lg shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 ${pkg.popular ? 'ring-2' : ''
                                    }`}
                                style={{
                                    ...cardStyle,
                                    border: pkg.popular
                                        ? `2px solid var(--theme-accent)`
                                        : `2px solid var(--theme-card-border)`,
                                    ...(pkg.popular && {
                                        '--tw-ring-color': `var(--theme-accent)`,
                                        '--tw-ring-opacity': '0.5'
                                    })
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                                    e.currentTarget.style.borderColor = `var(--theme-border-hover)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '';
                                    e.currentTarget.style.borderColor = pkg.popular
                                        ? `var(--theme-accent)`
                                        : `var(--theme-card-border)`;
                                }}
                            >
                                {pkg.popular && (
                                    <div
                                        className="absolute top-0 right-0 px-3 py-1 text-sm font-medium"
                                        style={{
                                            background: `var(--theme-accent)`,
                                            color: `var(--theme-contrast-text)`,
                                        }}
                                    >
                                        {locale === 'fr' ? 'Populaire' : 'Popular'}
                                    </div>
                                )}

                                <div className="p-6">
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{ color: `var(--theme-text)` }}
                                    >
                                        {pkg.name}
                                    </h3>
                                    <div
                                        className="text-3xl font-bold mb-4"
                                        style={{ color: `var(--theme-accent)` }}
                                    >
                                        {pkg.price}
                                    </div>
                                    <p
                                        className="mb-6"
                                        style={{ color: `var(--theme-muted)` }}
                                    >
                                        {pkg.description}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        {pkg.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <svg
                                                    className="w-5 h-5 mt-1 mr-3 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    style={{ color: `var(--theme-accent)` }}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span
                                                    className="text-sm"
                                                    style={{ color: `var(--theme-text)` }}
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                                        style={pkg.popular ? buttonPrimaryStyle : buttonSecondaryStyle}
                                        onClick={() => {
                                            // Scroll to contact section
                                            const contactSection = document.getElementById('contact');
                                            if (contactSection) {
                                                contactSection.scrollIntoView({ behavior: 'smooth' });
                                            } else {
                                                // If no contact section on current page, navigate to home with contact anchor
                                                window.location.href = `/${locale}#contact`;
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '';
                                        }}
                                    >
                                        {locale === 'fr' ? 'Choisir ce forfait' : 'Choose Package'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Package Evolution */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {pageContent.upgrade.title}
                        </h2>
                        <p
                            className="mt-4 text-lg max-w-2xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {pageContent.upgrade.description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <ul className="space-y-4">
                                {pageContent.upgrade.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg
                                            className="w-6 h-6 mt-1 mr-3 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: `var(--theme-accent)` }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span style={{ color: `var(--theme-text)` }}>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div
                            className="rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                            style={{
                                ...cardStyle,
                                border: `1px solid var(--theme-card-border)`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-4"
                                style={{ color: `var(--theme-text)` }}
                            >
                                {locale === 'fr' ? 'Parcours Typique' : 'Typical Journey'}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                        style={{
                                            background: `var(--theme-accent)20`,
                                            border: `1px solid var(--theme-accent)30`,
                                        }}
                                    >
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ color: `var(--theme-accent)` }}
                                        >
                                            1
                                        </span>
                                    </div>
                                    <span style={{ color: `var(--theme-text)` }}>
                                        {locale === 'fr' ? 'Diagnostic & Roadmap' : 'Diagnostic & Roadmap'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                        style={{
                                            background: `var(--theme-accent)20`,
                                            border: `1px solid var(--theme-accent)30`,
                                        }}
                                    >
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ color: `var(--theme-accent)` }}
                                        >
                                            2
                                        </span>
                                    </div>
                                    <span style={{ color: `var(--theme-text)` }}>
                                        {locale === 'fr' ? 'Site Bilingue + IA' : 'Bilingual Site + AI'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                        style={{
                                            background: `var(--theme-accent)20`,
                                            border: `1px solid var(--theme-accent)30`,
                                        }}
                                    >
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ color: `var(--theme-accent)` }}
                                        >
                                            3
                                        </span>
                                    </div>
                                    <span style={{ color: `var(--theme-text)` }}>
                                        {locale === 'fr' ? 'Sprints de Croissance' : 'Growth Sprints'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                                        style={{
                                            background: `var(--theme-accent)20`,
                                            border: `1px solid var(--theme-accent)30`,
                                        }}
                                    >
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ color: `var(--theme-accent)` }}
                                        >
                                            4
                                        </span>
                                    </div>
                                    <span style={{ color: `var(--theme-text)` }}>
                                        {locale === 'fr' ? 'Partenariat Entreprise' : 'Enterprise Partnership'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Stories */}
            <div
                className="py-16 border-t"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {pageContent.success.title}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div
                            className="rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                            style={{
                                ...cardStyle,
                                border: `1px solid var(--theme-card-border)`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <h3
                                className="text-xl font-semibold mb-3"
                                style={{ color: `var(--theme-text)` }}
                            >
                                {pageContent.success.story1.title}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{pageContent.success.story1.description}</p>
                        </div>
                        <div
                            className="rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                            style={{
                                ...cardStyle,
                                border: `1px solid var(--theme-card-border)`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <h3
                                className="text-xl font-semibold mb-3"
                                style={{ color: `var(--theme-text)` }}
                            >
                                {pageContent.success.story2.title}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{pageContent.success.story2.description}</p>
                        </div>
                        <div
                            className="rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                            style={{
                                ...cardStyle,
                                border: `1px solid var(--theme-card-border)`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <h3
                                className="text-xl font-semibold mb-3"
                                style={{ color: `var(--theme-text)` }}
                            >
                                {pageContent.success.story3.title}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{pageContent.success.story3.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {pageContent.faq.title}
                        </h2>
                    </div>
                    <div className="space-y-8">
                        <div
                            className="rounded-lg p-6 shadow-sm"
                            style={{
                                ...cardStyle,
                                border: `1px solid var(--theme-card-border)`,
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-3"
                                style={{ color: `var(--theme-text)` }}
                            >
                                {pageContent.faq.q1}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{pageContent.faq.a1}</p>
                        </div>
                        <div
                            className="rounded-lg p-6 shadow-sm"
                            style={{
                                ...cardStyle,
                                border: `1px solid var(--theme-card-border)`,
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-3"
                                style={{ color: `var(--theme-text)` }}
                            >
                                {pageContent.faq.q2}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{pageContent.faq.a2}</p>
                        </div>
                        <div
                            className="rounded-lg p-6 shadow-sm"
                            style={{
                                ...cardStyle,
                                border: `1px solid var(--theme-card-border)`,
                            }}
                        >
                            <h3
                                className="text-lg font-semibold mb-3"
                                style={{ color: `var(--theme-text)` }}
                            >
                                {pageContent.faq.q3}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{pageContent.faq.a3}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div
                className="py-16 border-t"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2
                        className="text-3xl font-bold bg-clip-text text-transparent mb-4"
                        style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                    >
                        {pageContent.cta.title}
                    </h2>
                    <p
                        className="text-lg mb-8"
                        style={{ color: `var(--theme-muted)` }}
                    >
                        {pageContent.cta.description}
                    </p>
                    <button
                        className="px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                        style={buttonPrimaryStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        {pageContent.cta.button}
                    </button>
                </div>
            </div>
        </div>
    );
}