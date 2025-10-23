'use client';

import Link from 'next/link';

import PageViewTracker from '@/components/PageViewTracker';
import { ServiceGrid } from '@/components/ServiceGrid';
import { type SupportedLocale } from '@/content';
import { type ServiceCatalog } from '@/lib/serviceLoader';
import { useThemeStyles } from '@/lib/designContext';

interface ServicesPageContentProps {
    locale: SupportedLocale;
    services: ServiceCatalog;
    homeText: string;
    content: {
        title: string;
        subtitle: string;
        description: string;
        process: {
            title: string;
            steps: Array<{
                title: string;
                description: string;
            }>;
        };
        integration: {
            title: string;
            description: string;
            benefits: string[];
        };
        caseStudies: {
            title: string;
            study1: { title: string; description: string };
            study2: { title: string; description: string };
            study3: { title: string; description: string };
        };
        testimonials: {
            title: string;
            quote: string;
            author: string;
        };
        cta: {
            title: string;
            description: string;
            button: string;
            pricing: string;
        };
    };
}

function ServicesPageContentInner({ locale, services, homeText, content }: ServicesPageContentProps) {
    const { themeStyles, cardStyle, buttonPrimaryStyle } = useThemeStyles();

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
                title={content.title}
                category="services"
                properties={{ page_type: 'services_overview' }}
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
                                    {homeText}
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
                                    {content.title}
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
                            {content.title}
                        </h1>
                        <p
                            className="mt-6 text-xl max-w-3xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {content.subtitle}
                        </p>
                        <p
                            className="mt-4 text-lg max-w-2xl mx-auto"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            {content.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div
                className="py-16 border-b"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ServiceGrid
                        services={services.services}
                        messages={{
                            loading: locale === 'fr' ? 'Chargement des services...' : 'Loading services...',
                            empty: locale === 'fr' ? 'Aucun service disponible pour le moment.' : 'No services available at the moment.',
                            tiersAria: locale === 'fr' ? 'Paliers du service' : 'Service tiers',
                            detailsSoon: locale === 'fr' ? 'Les détails de ce service arrivent bientôt.' : 'Details for this service are coming soon.',
                            priceAria: locale === 'fr' ? 'Prix' : 'Price',
                            setupCostAria: locale === 'fr' ? "Frais de configuration" : 'Setup cost',
                            closeButton: locale === 'fr' ? 'Fermer' : 'Close',
                            clickForDetails: locale === 'fr' ? 'Cliquez pour voir les détails' : 'Click for details'
                        }}
                    />
                </div>
            </div>

            {/* Process Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {content.process.title}
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.process.steps.map((step, index) => (
                            <div key={index} className="text-center transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ background: `var(--theme-accent)` }}
                                >
                                    <span
                                        className="font-bold text-xl"
                                        style={{ color: `var(--theme-contrast-text)` }}
                                    >
                                        {index + 1}
                                    </span>
                                </div>
                                <h3
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: `var(--theme-text)` }}
                                >
                                    {step.title}
                                </h3>
                                <p style={{ color: `var(--theme-muted)` }}>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Integration Section */}
            <div
                className="py-16 border-t"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2
                                className="text-3xl font-bold mb-6 bg-clip-text text-transparent"
                                style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                            >
                                {content.integration.title}
                            </h2>
                            <p
                                className="text-lg mb-8"
                                style={{ color: `var(--theme-muted)` }}
                            >
                                {content.integration.description}
                            </p>
                            <ul className="space-y-4">
                                {content.integration.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg
                                            className="w-6 h-6 mt-1 mr-3 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: `var(--theme-accent)` }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span style={{ color: `var(--theme-text)` }}>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div
                            className="rounded-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
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
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className="rounded-lg p-4 text-center"
                                    style={{
                                        background: `var(--theme-accent)20`,
                                        border: `1px solid var(--theme-accent)30`,
                                    }}
                                >
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: `var(--theme-accent)` }}
                                    >
                                        7
                                    </div>
                                    <div
                                        className="text-sm"
                                        style={{ color: `var(--theme-muted)` }}
                                    >
                                        {locale === 'fr' ? 'Catégories' : 'Categories'}
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-4 text-center"
                                    style={{
                                        background: `var(--theme-accent)20`,
                                        border: `1px solid var(--theme-accent)30`,
                                    }}
                                >
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: `var(--theme-accent)` }}
                                    >
                                        50+
                                    </div>
                                    <div
                                        className="text-sm"
                                        style={{ color: `var(--theme-muted)` }}
                                    >
                                        {locale === 'fr' ? 'Services' : 'Services'}
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-4 text-center"
                                    style={{
                                        background: `var(--theme-accent)20`,
                                        border: `1px solid var(--theme-accent)30`,
                                    }}
                                >
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: `var(--theme-accent)` }}
                                    >
                                        24/7
                                    </div>
                                    <div
                                        className="text-sm"
                                        style={{ color: `var(--theme-muted)` }}
                                    >
                                        {locale === 'fr' ? 'Support' : 'Support'}
                                    </div>
                                </div>
                                <div
                                    className="rounded-lg p-4 text-center"
                                    style={{
                                        background: `var(--theme-accent)20`,
                                        border: `1px solid var(--theme-accent)30`,
                                    }}
                                >
                                    <div
                                        className="text-2xl font-bold"
                                        style={{ color: `var(--theme-accent)` }}
                                    >
                                        100%
                                    </div>
                                    <div
                                        className="text-sm"
                                        style={{ color: `var(--theme-muted)` }}
                                    >
                                        {locale === 'fr' ? 'Satisfaction' : 'Satisfaction'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Case Studies */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                        >
                            {content.caseStudies.title}
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
                                {content.caseStudies.study1.title}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{content.caseStudies.study1.description}</p>
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
                                {content.caseStudies.study2.title}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{content.caseStudies.study2.description}</p>
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
                                {content.caseStudies.study3.title}
                            </h3>
                            <p style={{ color: `var(--theme-muted)` }}>{content.caseStudies.study3.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div
                className="py-16 border-t"
                style={{
                    background: `var(--theme-surface)`,
                    borderColor: `var(--theme-border)`,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent"
                        style={{ background: `var(--theme-gradient)`, WebkitBackgroundClip: 'text' }}
                    >
                        {content.testimonials.title}
                    </h2>
                    <div className="max-w-3xl mx-auto text-center">
                        <blockquote
                            className="text-xl italic mb-6"
                            style={{ color: `var(--theme-muted)` }}
                        >
                            "{content.testimonials.quote}"
                        </blockquote>
                        <cite
                            className="font-medium"
                            style={{ color: `var(--theme-text)` }}
                        >
                            — {content.testimonials.author}
                        </cite>
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
                        {content.cta.title}
                    </h2>
                    <p
                        className="text-xl mb-8 max-w-2xl mx-auto"
                        style={{ color: `var(--theme-muted)` }}
                    >
                        {content.cta.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                            style={{
                                background: `var(--theme-button-primary)`,
                                color: `var(--theme-contrast-text)`,
                                border: `1px solid var(--theme-accent)`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            {content.cta.button}
                        </button>
                        <Link
                            href={`/${locale}/pricing`}
                            className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                            style={{
                                background: `var(--theme-button-secondary)`,
                                color: `var(--theme-accent)`,
                                border: `1px solid var(--theme-border-hover)`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `var(--theme-hover-shadow)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            {content.cta.pricing}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ServicesPageContent(props: ServicesPageContentProps) {
    return <ServicesPageContentInner {...props} />;
}