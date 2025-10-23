import { notFound } from 'next/navigation';

import AIRoadmapGenerator from '@/components/AIRoadmapGenerator';
import PageViewTracker from '@/components/PageViewTracker';
import ProgressiveEnhancement from '@/components/ProgressiveEnhancement';
import { type SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface AIRoadmapPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export async function generateMetadata({ params }: AIRoadmapPageProps) {
  const { locale } = await params;
  
  const title = locale === 'fr' 
    ? 'Générateur de Feuille de Route IA | AI Web Agency'
    : 'AI Roadmap Generator | AI Web Agency';
  
  const description = locale === 'fr'
    ? 'Créez votre plan de transformation numérique personnalisé. Sélectionnez vos besoins et obtenez une feuille de route chronologique avec budget et délais pour vos projets IA.'
    : 'Create your personalized digital transformation plan. Select your needs and get a chronological roadmap with budget and timelines for your AI projects.';

  return generateSEOMetadata({
    title,
    description,
    locale,
    canonical: '/ai-roadmap'
  });
}

export default async function AIRoadmapPage({ params }: AIRoadmapPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const content = {
    fr: {
      title: 'Générateur de Feuille de Route IA',
      subtitle: 'Planifiez votre transformation numérique étape par étape',
      description: 'Notre générateur de feuille de route analyse vos besoins et crée un plan chronologique personnalisé pour votre transformation IA. Basé sur nos services éprouvés et optimisé pour le marché québécois avec considération de la Loi 25.',
      features: [
        'Plan chronologique personnalisé',
        'Budget et délais réalistes',
        'Conformité Loi 25 intégrée',
        'Services AI-driven 100% automatisés'
      ],
      howItWorks: {
        title: 'Comment ça marche',
        steps: [
          {
            title: 'Sélectionnez vos besoins',
            description: 'Choisissez parmi nos services de développement web, SEO, intégration IA et conformité.'
          },
          {
            title: 'Générez votre plan',
            description: 'Notre IA crée une feuille de route chronologique avec dépendances et priorités.'
          },
          {
            title: 'Obtenez votre devis',
            description: 'Recevez un plan détaillé avec budget, délais et prochaines étapes.'
          }
        ]
      },
      cta: {
        title: 'Prêt à planifier votre transformation IA?',
        description: 'Utilisez notre générateur pour créer votre feuille de route personnalisée.',
        button: 'Commencer maintenant'
      }
    },
    en: {
      title: 'AI Roadmap Generator',
      subtitle: 'Plan your digital transformation step by step',
      description: 'Our roadmap generator analyzes your needs and creates a personalized chronological plan for your AI transformation. Based on our proven services and optimized for the Quebec market with Law 25 considerations.',
      features: [
        'Personalized chronological plan',
        'Realistic budget and timelines',
        'Integrated Law 25 compliance',
        '100% automated AI-driven services'
      ],
      howItWorks: {
        title: 'How it works',
        steps: [
          {
            title: 'Select your needs',
            description: 'Choose from our web development, SEO, AI integration and compliance services.'
          },
          {
            title: 'Generate your plan',
            description: 'Our AI creates a chronological roadmap with dependencies and priorities.'
          },
          {
            title: 'Get your quote',
            description: 'Receive a detailed plan with budget, timelines and next steps.'
          }
        ]
      },
      cta: {
        title: 'Ready to plan your AI transformation?',
        description: 'Use our generator to create your personalized roadmap.',
        button: 'Get Started'
      }
    }
  };

  const pageContent = content[locale];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageViewTracker 
        locale={locale}
        title={pageContent.title}
        category="tools"
        properties={{ 
          page_type: 'roadmap_generator',
          tool_name: 'ai_roadmap'
        }}
      />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {pageContent.title}
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {pageContent.subtitle}
            </p>
            <p className="mt-4 text-lg text-gray-500 max-w-4xl mx-auto">
              {pageContent.description}
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pageContent.features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <p className="text-gray-700 font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {pageContent.howItWorks.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageContent.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Generator Tool */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressiveEnhancement 
            locale={locale} 
            toolName="ai_roadmap"
          >
            <AIRoadmapGenerator locale={locale} />
          </ProgressiveEnhancement>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {pageContent.cta.title}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {pageContent.cta.description}
          </p>
          <button 
            onClick={() => {
              // Scroll to the roadmap generator
              const element = document.querySelector('[data-roadmap-generator]');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {pageContent.cta.button}
          </button>
        </div>
      </div>
    </div>
  );
}