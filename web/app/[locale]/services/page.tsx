import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { ServicesPageContent } from '@/components/ServicesPageContent';
import { type SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';
import { loadServicesDynamic } from '@/lib/serviceLoader';

interface ServicesPageProps {
    params: Promise<{
        locale: SupportedLocale;
    }>;
}

export async function generateMetadata({ params }: ServicesPageProps) {
    const { locale } = await params;

  const title = locale === 'fr'
        ? 'Nos services | Agence web: Solutions Impact Web'
        : 'Our services | Web agency: Solutions Impact Web';

    const description = locale === 'fr'
        ? 'Découvrez notre gamme complète de services IA et web. Solutions personnalisées pour votre transformation numérique.'
        : 'Discover our complete range of AI and web services. Customized solutions for your digital transformation.';

    return generateSEOMetadata({
        title,
        description,
        locale
    });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
    const { locale } = await params;

    if (!['fr', 'en'].includes(locale)) {
        notFound();
    }

    const t = await getTranslations('nav');
    const services = await loadServicesDynamic(locale);

    const content = {
        fr: {
            title: 'Nos Services',
            subtitle: 'Solutions complètes pour votre transformation numérique',
            description: 'Nous offrons une gamme complète de services IA et web pour accompagner votre entreprise dans sa transformation numérique. De la stratégie à l\'implémentation, nous sommes votre partenaire de confiance.',
            process: {
                title: 'Notre Processus de Livraison',
                steps: [
                    {
                        title: 'Découverte & Analyse',
                        description: 'Nous analysons vos besoins et définissons la stratégie optimale.'
                    },
                    {
                        title: 'Planification & Design',
                        description: 'Conception détaillée et planification du projet avec votre équipe.'
                    },
                    {
                        title: 'Développement & Tests',
                        description: 'Implémentation avec tests rigoureux et assurance qualité.'
                    },
                    {
                        title: 'Déploiement & Support',
                        description: 'Mise en ligne et support continu pour assurer le succès.'
                    }
                ]
            },
            integration: {
                title: 'Services Intégrés',
                description: 'Nos services sont conçus pour fonctionner ensemble, créant un écosystème numérique cohérent et performant pour votre entreprise.',
                benefits: [
                    'Synergie entre les différents services',
                    'Données unifiées et insights partagés',
                    'Maintenance simplifiée',
                    'Évolutivité garantie'
                ]
            },
            caseStudies: {
                title: 'Exemples de Réussites',
                study1: {
                    title: 'E-commerce + IA',
                    description: 'Augmentation de 40% des conversions grâce à l\'intégration d\'IA personnalisée.'
                },
                study2: {
                    title: 'Automatisation Marketing',
                    description: 'Réduction de 60% du temps de gestion grâce à l\'automatisation intelligente.'
                },
                study3: {
                    title: 'Site Multilingue',
                    description: 'Expansion internationale réussie avec un site parfaitement localisé.'
                }
            },
            testimonials: {
                title: 'Témoignages Clients',
                quote: 'L\'équipe a su comprendre nos besoins et livrer des solutions qui dépassent nos attentes. Service exceptionnel.',
                author: 'Directeur Technique, Entreprise Québécoise'
            },
            cta: {
                title: 'Prêt à Transformer Votre Entreprise?',
                description: 'Discutons de vos besoins et découvrons comment nos services peuvent vous aider.',
                button: 'Demander une Consultation',
                pricing: 'Voir la Tarification'
            }
        },
        en: {
            title: 'Our Services',
            subtitle: 'Complete solutions for your digital transformation',
            description: 'We offer a comprehensive range of AI and web services to support your business in its digital transformation. From strategy to implementation, we are your trusted partner.',
            process: {
                title: 'Our Delivery Process',
                steps: [
                    {
                        title: 'Discovery & Analysis',
                        description: 'We analyze your needs and define the optimal strategy.'
                    },
                    {
                        title: 'Planning & Design',
                        description: 'Detailed design and project planning with your team.'
                    },
                    {
                        title: 'Development & Testing',
                        description: 'Implementation with rigorous testing and quality assurance.'
                    },
                    {
                        title: 'Deployment & Support',
                        description: 'Go-live and ongoing support to ensure success.'
                    }
                ]
            },
            integration: {
                title: 'Integrated Services',
                description: 'Our services are designed to work together, creating a cohesive and high-performing digital ecosystem for your business.',
                benefits: [
                    'Synergy between different services',
                    'Unified data and shared insights',
                    'Simplified maintenance',
                    'Guaranteed scalability'
                ]
            },
            caseStudies: {
                title: 'Success Stories',
                study1: {
                    title: 'E-commerce + AI',
                    description: '40% increase in conversions through personalized AI integration.'
                },
                study2: {
                    title: 'Marketing Automation',
                    description: '60% reduction in management time through intelligent automation.'
                },
                study3: {
                    title: 'Multilingual Website',
                    description: 'Successful international expansion with perfectly localized website.'
                }
            },
            testimonials: {
                title: 'Client Testimonials',
                quote: 'The team understood our needs and delivered solutions that exceed our expectations. Exceptional service.',
                author: 'Technical Director, Quebec Company'
            },
            cta: {
                title: 'Ready to Transform Your Business?',
                description: 'Let\'s discuss your needs and discover how our services can help you.',
                button: 'Request Consultation',
                pricing: 'View Pricing'
            }
        }
    };

    const pageContent = content[locale];

    return (
        <ServicesPageContent
            locale={locale}
            services={services}
            content={pageContent}
            homeText={t('home')}
        />
    );
}
