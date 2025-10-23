import { notFound } from 'next/navigation';

import type { AssessmentResult } from '@/components/AIReadinessAssessment';
import AIReadinessAssessmentComplete from '@/components/AIReadinessAssessmentComplete';
import PageViewTracker from '@/components/PageViewTracker';
import { type SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface AssessmentPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export async function generateMetadata({ params }: AssessmentPageProps) {
  const { locale } = await params;
  
  const title = locale === 'fr' 
    ? 'Évaluation de maturité IA | AI Web Agency'
    : 'AI Readiness Assessment | AI Web Agency';
  
  const description = locale === 'fr'
    ? 'Évaluez la maturité IA de votre organisation avec notre outil d\'évaluation gratuit. Obtenez des recommandations personnalisées pour votre transformation numérique.'
    : 'Assess your organization\'s AI readiness with our free assessment tool. Get personalized recommendations for your digital transformation.';

  return generateSEOMetadata({
    title,
    description,
    locale
  });
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const handleRequestConsultation = async (result: AssessmentResult) => {
    // TODO: Implement consultation request logic
    // This could open a contact form or redirect to a consultation booking page
    console.log('Consultation requested with result:', result);
  };

  const content = {
    fr: {
      title: 'Évaluation de maturité IA',
      subtitle: 'Découvrez où en est votre organisation dans son parcours d\'adoption de l\'intelligence artificielle',
      description: 'Notre évaluation gratuite analysera votre niveau de préparation actuel et vous fournira des recommandations personnalisées pour accélérer votre transformation numérique.',
      benefits: [
        'Évaluation complète en 4 catégories clés',
        'Recommandations personnalisées et priorisées',
        'Feuille de route détaillée avec chronologie',
        'Analyse comparative par secteur d\'activité'
      ],
      process: {
        title: 'Comment ça fonctionne',
        steps: [
          {
            title: 'Répondez aux questions',
            description: 'Évaluation rapide de 5-10 minutes couvrant stratégie, technique, données et culture'
          },
          {
            title: 'Obtenez vos résultats',
            description: 'Score détaillé par catégorie avec niveau de maturité IA global'
          },
          {
            title: 'Recevez vos recommandations',
            description: 'Plan d\'action personnalisé avec prochaines étapes prioritaires'
          }
        ]
      }
    },
    en: {
      title: 'AI Readiness Assessment',
      subtitle: 'Discover where your organization stands in its artificial intelligence adoption journey',
      description: 'Our free assessment will analyze your current readiness level and provide personalized recommendations to accelerate your digital transformation.',
      benefits: [
        'Complete assessment across 4 key categories',
        'Personalized and prioritized recommendations',
        'Detailed roadmap with timeline',
        'Industry comparative analysis'
      ],
      process: {
        title: 'How it works',
        steps: [
          {
            title: 'Answer the questions',
            description: 'Quick 5-10 minute assessment covering strategy, technical, data, and culture'
          },
          {
            title: 'Get your results',
            description: 'Detailed score by category with overall AI maturity level'
          },
          {
            title: 'Receive recommendations',
            description: 'Personalized action plan with priority next steps'
          }
        ]
      }
    }
  };

  const pageContent = content[locale];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageViewTracker 
        locale={locale}
        title={pageContent.title}
        category="assessment"
        properties={{ page_type: 'tool' }}
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
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              {pageContent.description}
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pageContent.benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <p className="text-gray-700 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {pageContent.process.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageContent.process.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIReadinessAssessmentComplete
            locale={locale}
            onRequestConsultation={handleRequestConsultation}
          />
        </div>
      </div>
    </div>
  );
}