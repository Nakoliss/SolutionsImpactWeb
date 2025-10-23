import { notFound } from 'next/navigation';

import ComplianceHeatmap from '@/components/ComplianceHeatmap';
import PageViewTracker from '@/components/PageViewTracker';
import ProgressiveEnhancement from '@/components/ProgressiveEnhancement';
import { type SupportedLocale } from '@/content';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

interface ComplianceHeatmapPageProps {
  params: Promise<{
    locale: SupportedLocale;
  }>;
}

export async function generateMetadata({ params }: ComplianceHeatmapPageProps) {
  const { locale } = await params;
  
  const title = locale === 'fr' 
    ? 'Carte de Chaleur de Conformité | AI Web Agency'
    : 'Compliance Heatmap | AI Web Agency';
  
  const description = locale === 'fr'
    ? 'Outil interactif pour identifier vos priorités de conformité selon votre secteur, taille d\'organisation et types de données traitées. Conforme à la Loi 25 du Québec.'
    : 'Interactive tool to identify your compliance priorities based on your sector, organization size and data types processed. Quebec Law 25 compliant.';

  return generateSEOMetadata({
    title,
    description,
    locale,
    canonical: '/compliance/heatmap'
  });
}

export default async function ComplianceHeatmapPage({ params }: ComplianceHeatmapPageProps) {
  const { locale } = await params;
  
  if (!['fr', 'en'].includes(locale)) {
    notFound();
  }

  const content = {
    fr: {
      title: 'Carte de Chaleur de Conformité',
      subtitle: 'Identifiez vos priorités de conformité réglementaire',
      description: 'Notre outil interactif analyse votre secteur d\'activité, la taille de votre organisation et les types de données que vous traitez pour générer une liste priorisée de vos exigences de conformité. Optimisé pour la Loi 25 du Québec et les réglementations sectorielles.',
      features: [
        'Analyse personnalisée par secteur',
        'Priorités basées sur la Loi 25',
        'Estimation de l\'effort requis',
        'Ressources et guides pratiques'
      ],
      cta: {
        title: 'Besoin d\'aide pour votre conformité?',
        description: 'Nos experts peuvent vous accompagner dans votre démarche de mise en conformité.',
        button: 'Consultation gratuite'
      }
    },
    en: {
      title: 'Compliance Heatmap',
      subtitle: 'Identify your regulatory compliance priorities',
      description: 'Our interactive tool analyzes your business sector, organization size and data types you process to generate a prioritized list of your compliance requirements. Optimized for Quebec Law 25 and sector-specific regulations.',
      features: [
        'Personalized sector analysis',
        'Law 25-based priorities',
        'Required effort estimation',
        'Practical resources and guides'
      ],
      cta: {
        title: 'Need help with your compliance?',
        description: 'Our experts can guide you through your compliance journey.',
        button: 'Free Consultation'
      }
    }
  };

  const pageContent = content[locale];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageViewTracker 
        locale={locale}
        title={pageContent.title}
        category="compliance"
        properties={{ 
          page_type: 'heatmap_tool',
          tool_name: 'compliance_heatmap'
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

      {/* Heatmap Tool Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressiveEnhancement 
            locale={locale} 
            toolName="compliance_heatmap"
          >
            <ComplianceHeatmap locale={locale} />
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
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {pageContent.cta.button}
          </button>
        </div>
      </div>
    </div>
  );
}