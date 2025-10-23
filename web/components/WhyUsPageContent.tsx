'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import PageViewTracker from '@/components/PageViewTracker';
import { type SupportedLocale } from '@/content';
import { useThemeStyles } from '@/lib/designContext';

interface WhyUsPageContentProps {
    locale: SupportedLocale;
}

function WhyUsPageContentInner({ locale }: WhyUsPageContentProps) {
    const { themeStyles, cardStyle, buttonPrimaryStyle } = useThemeStyles();
    const t = useTranslations('why');

    const differentiators = [
        {
            id: 'bilingual',
            title: t('bilingual.title'),
            description: t('bilingual.description'),
            icon: '🌐'
        },
        {
            id: 'technology',
            title: t('technology.title'),
            description: t('technology.description'),
            icon: '🤖'
        },
        {
            id: 'results',
            title: t('results.title'),
            description: t('results.description'),
            icon: '📈'
        },
        {
            id: 'support',
            title: t('support.title'),
            description: t('support.description'),
            icon: '🍁'
        }
    ];

    const content = {
        fr: {
            title: 'Pourquoi Nous Choisir',
            subtitle: 'Ce qui nous distingue dans l\'écosystème numérique',
            description: 'Nous ne sommes pas une agence comme les autres. Notre approche unique combine expertise technique, compréhension culturelle et engagement envers l\'excellence pour livrer des résultats exceptionnels.',
            team: {
                title: 'Notre Équipe Québécoise',
                description: 'Basée au cœur du Québec, notre équipe comprend les nuances culturelles et linguistiques qui font la différence dans vos projets.',
                members: [
                    {
                        name: 'Équipe Technique',
                        role: 'Développeurs et architectes expérimentés',
                        expertise: 'React, Next.js, IA, Cloud'
                    },
                    {
                        name: 'Équipe Stratégique',
                        role: 'Consultants en transformation numérique',
                        expertise: 'Stratégie, UX/UI, Marketing'
                    },
                    {
                        name: 'Équipe Linguistique',
                        role: 'Spécialistes bilingues natifs',
                        expertise: 'Localisation, Traduction, SEO'
                    }
                ]
            },
            strengths: {
                title: 'Nos Forces Distinctives',
                description: 'Ce qui fait notre succès et celui de nos clients',
                points: [
                    {
                        icon: '🌐',
                        title: 'Bilingue natif (FR/EN)',
                        description: 'Équipe qui pense et crée naturellement dans les deux langues'
                    },
                    {
                        icon: '🤖',
                        title: 'IA éthique et responsable',
                        description: 'Automatisations alignées avec vos valeurs et objectifs'
                    },
                    {
                        icon: '📊',
                        title: 'Métriques et ROI mesurables',
                        description: 'Résultats concrets et transparents à chaque étape'
                    },
                    {
                        icon: '🍁',
                        title: 'Équipe locale au Québec',
                        description: 'Compréhension profonde du marché et de la culture'
                    },
                    {
                        icon: '🚀',
                        title: 'Support continu et proactif',
                        description: 'Accompagnement personnalisé pour votre croissance'
                    }
                ]
            },
            testimonials: {
                title: 'Ce que Disent Nos Clients',
                subtitle: '(Bientôt de vrais témoignages, promis !)',
                quotes: [
                    {
                        text: 'Ils ont transformé notre site web... et aussi notre café de bureau. Maintenant il goûte le succès !',
                        author: 'PDG Très Satisfait',
                        company: 'Entreprise Qui Cartonne'
                    },
                    {
                        text: 'Grâce à eux, notre site est si beau que même ma belle-mère a dit "c\'est pas pire". Un miracle !',
                        author: 'Directrice Marketing Émue',
                        company: 'Commerce en Ligne'
                    },
                    {
                        text: 'Leur IA est tellement intelligente qu\'elle a fini mes mots croisés. Maintenant je n\'ai plus d\'excuses.',
                        author: 'CTO Impressionné',
                        company: 'Startup Révolutionnaire'
                    }
                ]
            },
            cta: {
                title: 'Prêt à Faire la Différence?',
                description: 'Découvrez comment notre approche unique peut transformer votre entreprise.',
                button: 'Commencer Maintenant'
            }
        },
        en: {
            title: 'Why Choose Us',
            subtitle: 'What sets us apart in the digital ecosystem',
            description: 'We\'re not just another agency. Our unique approach combines technical expertise, cultural understanding, and commitment to excellence to deliver exceptional results.',
            team: {
                title: 'Our Quebec Team',
                description: 'Based in the heart of Quebec, our team understands the cultural and linguistic nuances that make the difference in your projects.',
                members: [
                    {
                        name: 'Technical Team',
                        role: 'Experienced developers and architects',
                        expertise: 'React, Next.js, AI, Cloud'
                    },
                    {
                        name: 'Strategic Team',
                        role: 'Digital transformation consultants',
                        expertise: 'Strategy, UX/UI, Marketing'
                    },
                    {
                        name: 'Linguistic Team',
                        role: 'Native bilingual specialists',
                        expertise: 'Localization, Translation, SEO'
                    }
                ]
            },
            strengths: {
                title: 'Our Distinctive Strengths',
                description: 'What drives our success and that of our clients',
                points: [
                    {
                        icon: '🌐',
                        title: 'Native bilingual (FR/EN)',
                        description: 'Team that naturally thinks and creates in both languages'
                    },
                    {
                        icon: '🤖',
                        title: 'Ethical and responsible AI',
                        description: 'Automations aligned with your values and objectives'
                    },
                    {
                        icon: '📊',
                        title: 'Measurable metrics and ROI',
                        description: 'Concrete and transparent results at every step'
                    },
                    {
                        icon: '🍁',
                        title: 'Local Quebec team',
                        description: 'Deep understanding of the market and culture'
                    },
                    {
                        icon: '🚀',
                        title: 'Continuous and proactive support',
                        description: 'Personalized support for your growth'
                    }
                ]
            },
            testimonials: {
                title: 'What Our Clients Say',
                subtitle: '(Real testimonials coming soon, we promise!)',
                quotes: [
                    {
                        text: 'They transformed our website... and also our office coffee. Now it tastes like success!',
                        author: 'Very Satisfied CEO',
                        company: 'Company That Rocks'
                    },
                    {
                        text: 'Thanks to them, our site is so beautiful that even my mother-in-law said "it\'s not bad". A miracle!',
                        author: 'Moved Marketing Director',
                        company: 'Online Commerce'
                    },
                    {
                        text: 'Their AI is so smart it finished my crossword puzzle. Now I have no more excuses.',
                        author: 'Impressed CTO',
                        company: 'Revolutionary Startup'
                    }
                ]
            },
            cta: {
                title: 'Ready to Make a Difference?',
                description: 'Discover how our unique approach can transform your business.',
                button: 'Get Started Now'
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
                category="why-us"
                properties={{ page_type: 'why_us_overview' }}
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
                                <Link
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
                                </Link>
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

            {/* Key Differentiators */}
            <div
                className="py-16 border-b"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {differentiators.map((item) => (
                            <div
                                key={item.id}
                                className="text-center transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3
                                    className="text-xl font-semibold mb-3"
                                    style={{ color: `var(--theme-text)` }}
                                >
                                    {item.title}
                                </h3>
                                <p style={{ color: `var(--theme-muted)` }}>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {pageContent.team.title}
                        </h2>
                        <p
                            className="mt-4 text-lg max-w-2xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {pageContent.team.description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pageContent.team.members.map((member, index) => (
                            <div
                                key={index}
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
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: `var(--theme-text)` }}
                                >
                                    {member.name}
                                </h3>
                                <p
                                    className="font-medium mb-3"
                                    style={{ color: `var(--theme-accent)` }}
                                >
                                    {member.role}
                                </p>
                                <p
                                    className="text-sm"
                                    style={{ color: `var(--theme-muted)` }}
                                >
                                    {member.expertise}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Distinctive Strengths */}
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
                            {pageContent.strengths.title}
                        </h2>
                        <p
                            className="mt-4 text-lg max-w-2xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {pageContent.strengths.description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pageContent.strengths.points.map((strength, index) => (
                            <div
                                key={index}
                                className="rounded-lg p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
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
                                <div className="text-4xl mb-4">{strength.icon}</div>
                                <h3
                                    className="text-lg font-semibold mb-3"
                                    style={{ color: `var(--theme-text)` }}
                                >
                                    {strength.title}
                                </h3>
                                <p
                                    className="text-sm"
                                    style={{ color: `var(--theme-muted)` }}
                                >
                                    {strength.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {pageContent.testimonials.title}
                        </h2>
                        <p
                            className="mt-2 text-lg italic"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {pageContent.testimonials.subtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pageContent.testimonials.quotes.map((testimonial, index) => (
                            <div
                                key={index}
                                className="rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
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
                                <blockquote
                                    className="italic mb-4"
                                    style={{ color: `var(--theme-muted)` }}
                                >
                                    "{testimonial.text}"
                                </blockquote>
                                <cite className="text-sm">
                                    <div
                                        className="font-medium"
                                        style={{ color: `var(--theme-text)` }}
                                    >
                                        {testimonial.author}
                                    </div>
                                    <div style={{ color: `var(--theme-muted)` }}>{testimonial.company}</div>
                                </cite>
                            </div>
                        ))}
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2
                        className="text-3xl font-bold mb-4 bg-clip-text text-transparent"
                        style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                    >
                        {pageContent.cta.title}
                    </h2>
                    <p
                        className="text-xl mb-8 max-w-2xl mx-auto"
                        style={{ color: `var(--theme-muted)` }}
                    >
                        {pageContent.cta.description}
                    </p>
                    <button
                        className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                        style={{
                            ...buttonPrimaryStyle,
                            background: `var(--theme-button-primary)`,
                            color: `var(--theme-contrast-text)`,
                            border: `1px solid var(--theme-accent)`,
                        }}
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
                        {pageContent.cta.button}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function WhyUsPageContent(props: WhyUsPageContentProps) {
    return <WhyUsPageContentInner {...props} />;
}