'use client';

import Link from 'next/link';

import PageViewTracker from '@/components/PageViewTracker';
import { type SupportedLocale } from '@/content';
import { useThemeStyles } from '@/lib/designContext';

interface ProcessPageContentProps {
    locale: SupportedLocale;
}

function ProcessPageContentInner({ locale }: ProcessPageContentProps) {
    const { themeStyles, cardStyle, buttonPrimaryStyle } = useThemeStyles();

    const content = {
        fr: {
            title: 'Notre Processus',
            subtitle: 'Une méthodologie éprouvée pour des résultats exceptionnels',
            description: 'Notre processus structuré garantit la livraison de projets de qualité, dans les délais et le budget. Chaque étape est conçue pour maximiser la valeur et minimiser les risques.',
            phases: [
                {
                    id: 'discovery',
                    title: 'Découverte & Évaluation',
                    duration: '1-2 semaines',
                    description: 'Analyse approfondie de vos besoins, objectifs et contraintes techniques.',
                    activities: [
                        'Audit technique et fonctionnel',
                        'Analyse des parties prenantes',
                        'Définition des objectifs SMART',
                        'Évaluation des risques et opportunités',
                        'Recommandations stratégiques'
                    ],
                    deliverables: [
                        'Rapport d\'audit complet',
                        'Roadmap stratégique',
                        'Estimation détaillée',
                        'Plan de projet'
                    ]
                },
                {
                    id: 'strategy',
                    title: 'Stratégie & Planification',
                    duration: '1-3 semaines',
                    description: 'Conception détaillée de la solution et planification précise du projet.',
                    activities: [
                        'Architecture technique détaillée',
                        'Design UX/UI et wireframes',
                        'Planification des sprints',
                        'Définition des critères d\'acceptation',
                        'Configuration des environnements'
                    ],
                    deliverables: [
                        'Spécifications techniques',
                        'Maquettes et prototypes',
                        'Plan de développement',
                        'Stratégie de tests'
                    ]
                },
                {
                    id: 'development',
                    title: 'Développement & Tests',
                    duration: '4-12 semaines',
                    description: 'Implémentation avec méthodologie agile et tests rigoureux.',
                    activities: [
                        'Développement par sprints',
                        'Tests automatisés et manuels',
                        'Revues de code régulières',
                        'Intégration continue',
                        'Validation utilisateur'
                    ],
                    deliverables: [
                        'Code source documenté',
                        'Application fonctionnelle',
                        'Rapports de tests',
                        'Documentation technique'
                    ]
                },
                {
                    id: 'launch',
                    title: 'Déploiement & Lancement',
                    duration: '1-2 semaines',
                    description: 'Mise en production sécurisée et accompagnement au lancement.',
                    activities: [
                        'Déploiement en production',
                        'Tests de performance',
                        'Formation des utilisateurs',
                        'Monitoring et surveillance',
                        'Support au lancement'
                    ],
                    deliverables: [
                        'Application en production',
                        'Documentation utilisateur',
                        'Plan de maintenance',
                        'Rapport de lancement'
                    ]
                },
                {
                    id: 'optimization',
                    title: 'Optimisation & Croissance',
                    duration: 'Continu',
                    description: 'Amélioration continue basée sur les données et les retours utilisateurs.',
                    activities: [
                        'Analyse des performances',
                        'Optimisation SEO et conversion',
                        'Nouvelles fonctionnalités',
                        'Maintenance préventive',
                        'Support technique'
                    ],
                    deliverables: [
                        'Rapports d\'analyse',
                        'Recommandations d\'amélioration',
                        'Mises à jour régulières',
                        'Support continu'
                    ]
                }
            ],
            methodology: {
                title: 'Notre Méthodologie',
                description: 'Nous combinons les meilleures pratiques agiles avec notre expertise technique pour garantir le succès de vos projets.',
                principles: [
                    {
                        title: 'Agilité',
                        description: 'Sprints courts, feedback régulier et adaptation continue aux besoins changeants.'
                    },
                    {
                        title: 'Transparence',
                        description: 'Communication ouverte, rapports réguliers et accès aux outils de suivi.'
                    },
                    {
                        title: 'Qualité',
                        description: 'Tests rigoureux, revues de code et respect des standards industriels.'
                    },
                    {
                        title: 'Collaboration',
                        description: 'Travail en équipe intégrée avec vos parties prenantes internes.'
                    }
                ]
            },
            cta: {
                title: 'Prêt à Commencer Votre Projet?',
                description: 'Discutons de vos besoins et voyons comment notre processus peut vous aider à atteindre vos objectifs.',
                button: 'Démarrer un Projet'
            }
        },
        en: {
            title: 'Our Process',
            subtitle: 'A proven methodology for exceptional results',
            description: 'Our structured process ensures quality project delivery, on time and on budget. Each step is designed to maximize value and minimize risks.',
            phases: [
                {
                    id: 'discovery',
                    title: 'Discovery & Assessment',
                    duration: '1-2 weeks',
                    description: 'Thorough analysis of your needs, objectives, and technical constraints.',
                    activities: [
                        'Technical and functional audit',
                        'Stakeholder analysis',
                        'SMART objectives definition',
                        'Risk and opportunity assessment',
                        'Strategic recommendations'
                    ],
                    deliverables: [
                        'Complete audit report',
                        'Strategic roadmap',
                        'Detailed estimate',
                        'Project plan'
                    ]
                },
                {
                    id: 'strategy',
                    title: 'Strategy & Planning',
                    duration: '1-3 weeks',
                    description: 'Detailed solution design and precise project planning.',
                    activities: [
                        'Detailed technical architecture',
                        'UX/UI design and wireframes',
                        'Sprint planning',
                        'Acceptance criteria definition',
                        'Environment configuration'
                    ],
                    deliverables: [
                        'Technical specifications',
                        'Mockups and prototypes',
                        'Development plan',
                        'Testing strategy'
                    ]
                },
                {
                    id: 'development',
                    title: 'Development & Testing',
                    duration: '4-12 weeks',
                    description: 'Implementation with agile methodology and rigorous testing.',
                    activities: [
                        'Sprint-based development',
                        'Automated and manual testing',
                        'Regular code reviews',
                        'Continuous integration',
                        'User validation'
                    ],
                    deliverables: [
                        'Documented source code',
                        'Functional application',
                        'Test reports',
                        'Technical documentation'
                    ]
                },
                {
                    id: 'launch',
                    title: 'Deployment & Launch',
                    duration: '1-2 weeks',
                    description: 'Secure production deployment and launch support.',
                    activities: [
                        'Production deployment',
                        'Performance testing',
                        'User training',
                        'Monitoring and surveillance',
                        'Launch support'
                    ],
                    deliverables: [
                        'Production application',
                        'User documentation',
                        'Maintenance plan',
                        'Launch report'
                    ]
                },
                {
                    id: 'optimization',
                    title: 'Optimization & Growth',
                    duration: 'Ongoing',
                    description: 'Continuous improvement based on data and user feedback.',
                    activities: [
                        'Performance analysis',
                        'SEO and conversion optimization',
                        'New features',
                        'Preventive maintenance',
                        'Technical support'
                    ],
                    deliverables: [
                        'Analysis reports',
                        'Improvement recommendations',
                        'Regular updates',
                        'Ongoing support'
                    ]
                }
            ],
            methodology: {
                title: 'Our Methodology',
                description: 'We combine agile best practices with our technical expertise to guarantee your project success.',
                principles: [
                    {
                        title: 'Agility',
                        description: 'Short sprints, regular feedback, and continuous adaptation to changing needs.'
                    },
                    {
                        title: 'Transparency',
                        description: 'Open communication, regular reports, and access to tracking tools.'
                    },
                    {
                        title: 'Quality',
                        description: 'Rigorous testing, code reviews, and adherence to industry standards.'
                    },
                    {
                        title: 'Collaboration',
                        description: 'Integrated teamwork with your internal stakeholders.'
                    }
                ]
            },
            cta: {
                title: 'Ready to Start Your Project?',
                description: 'Let\'s discuss your needs and see how our process can help you achieve your goals.',
                button: 'Start a Project'
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
                category="process"
                properties={{ page_type: 'process_overview' }}
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

            {/* Process Phases */}
            <div
                className="py-16 border-b"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-16">
                        {pageContent.phases.map((phase, index) => (
                            <div key={phase.id} className={`flex flex-col lg:flex-row items-start gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                <div className="lg:w-1/2">
                                    <div className="flex items-center mb-4">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                            style={{ background: `var(--theme-accent)` }}
                                        >
                                            <span
                                                className="font-bold text-lg"
                                                style={{ color: `var(--theme-contrast-text)` }}
                                            >
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <h2
                                                className="text-2xl font-bold"
                                                style={{ color: `var(--theme-text)` }}
                                            >
                                                {phase.title}
                                            </h2>
                                            <p
                                                className="font-medium"
                                                style={{ color: `var(--theme-accent)` }}
                                            >
                                                {phase.duration}
                                            </p>
                                        </div>
                                    </div>
                                    <p
                                        className="text-lg mb-6"
                                        style={{ color: `var(--theme-muted)` }}
                                    >
                                        {phase.description}
                                    </p>

                                    <div className="mb-6">
                                        <h3
                                            className="text-lg font-semibold mb-3"
                                            style={{ color: `var(--theme-text)` }}
                                        >
                                            {locale === 'fr' ? 'Activités Clés' : 'Key Activities'}
                                        </h3>
                                        <ul className="space-y-2">
                                            {phase.activities.map((activity, actIndex) => (
                                                <li key={actIndex} className="flex items-start">
                                                    <svg
                                                        className="w-5 h-5 mt-1 mr-3 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        style={{ color: `var(--theme-accent)` }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span style={{ color: `var(--theme-text)` }}>{activity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="lg:w-1/2">
                                    <div
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
                                        <h3
                                            className="text-lg font-semibold mb-4"
                                            style={{ color: `var(--theme-text)` }}
                                        >
                                            {locale === 'fr' ? 'Livrables' : 'Deliverables'}
                                        </h3>
                                        <ul className="space-y-3">
                                            {phase.deliverables.map((deliverable, delIndex) => (
                                                <li key={delIndex} className="flex items-center">
                                                    <svg
                                                        className="w-5 h-5 mr-3 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        style={{ color: `var(--theme-accent)` }}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5l-7-7 7 7z" />
                                                    </svg>
                                                    <span style={{ color: `var(--theme-text)` }}>{deliverable}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Methodology */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {pageContent.methodology.title}
                        </h2>
                        <p
                            className="mt-4 text-lg max-w-2xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {pageContent.methodology.description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pageContent.methodology.principles.map((principle, index) => (
                            <div
                                key={index}
                                className="text-center rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
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
                                    className="text-lg font-semibold mb-3"
                                    style={{ color: `var(--theme-text)` }}
                                >
                                    {principle.title}
                                </h3>
                                <p style={{ color: `var(--theme-muted)` }}>{principle.description}</p>
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

export function ProcessPageContent(props: ProcessPageContentProps) {
    return <ProcessPageContentInner {...props} />;
}