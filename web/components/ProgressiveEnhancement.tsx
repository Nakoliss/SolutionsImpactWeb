'use client';

import { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';

import type { SupportedLocale } from '@/content';

interface ProgressiveEnhancementProps {
  locale: SupportedLocale;
  toolName: 'compliance_heatmap' | 'ai_roadmap';
  children: React.ReactNode;
  className?: string;
}

const FALLBACK_CONTENT = {
  fr: {
    compliance_heatmap: {
      title: 'Carte de Chaleur de Conformité',
      description: 'Cet outil interactif vous aide à identifier vos priorités de conformité réglementaire selon votre secteur d\'activité.',
      loading: 'Chargement de l\'outil...',
      jsRequired: 'JavaScript requis',
      jsMessage: 'Cet outil nécessite JavaScript pour fonctionner. Veuillez activer JavaScript dans votre navigateur ou contactez-nous directement.',
      features: [
        'Analyse par secteur d\'activité',
        'Taille d\'organisation considérée',
        'Types de données évalués',
        'Priorités conformes à la Loi 25'
      ],
      contact: 'Contactez-nous pour une analyse personnalisée'
    },
    ai_roadmap: {
      title: 'Générateur de Feuille de Route IA',
      description: 'Cet outil vous permet de créer un plan personnalisé pour votre transformation numérique.',
      loading: 'Chargement du générateur...',
      jsRequired: 'JavaScript requis',
      jsMessage: 'Cet outil nécessite JavaScript pour fonctionner. Veuillez activer JavaScript dans votre navigateur ou contactez-nous directement.',
      features: [
        'Sélection de services IA',
        'Planification chronologique',
        'Estimation de budget',
        'Export en Markdown/JSON'
      ],
      contact: 'Contactez-nous pour une consultation personnalisée'
    }
  },
  en: {
    compliance_heatmap: {
      title: 'Compliance Heatmap',
      description: 'This interactive tool helps you identify your regulatory compliance priorities based on your business sector.',
      loading: 'Loading tool...',
      jsRequired: 'JavaScript Required',
      jsMessage: 'This tool requires JavaScript to function. Please enable JavaScript in your browser or contact us directly.',
      features: [
        'Business sector analysis',
        'Organization size considered',
        'Data types evaluated',
        'Law 25 compliant priorities'
      ],
      contact: 'Contact us for personalized analysis'
    },
    ai_roadmap: {
      title: 'AI Roadmap Generator',
      description: 'This tool allows you to create a personalized plan for your digital transformation.',
      loading: 'Loading generator...',
      jsRequired: 'JavaScript Required',
      jsMessage: 'This tool requires JavaScript to function. Please enable JavaScript in your browser or contact us directly.',
      features: [
        'AI service selection',
        'Chronological planning',
        'Budget estimation',
        'Markdown/JSON export'
      ],
      contact: 'Contact us for personalized consultation'
    }
  }
};

export default function ProgressiveEnhancement({ 
  locale, 
  toolName, 
  children, 
  className 
}: ProgressiveEnhancementProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const content = FALLBACK_CONTENT[locale][toolName];

  useEffect(() => {
    // This effect only runs on the client
    setIsClient(true);
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // SSR fallback: Show static content when JavaScript is disabled
  if (!isClient) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className || ''}`}>
        <noscript>
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                {content.jsRequired}
              </h3>
              <p className="text-yellow-700 mb-4">
                {content.jsMessage}
              </p>
            </div>
            
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {content.description}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {locale === 'fr' ? 'Fonctionnalités:' : 'Features:'}
                </h3>
                <ul className="space-y-2">
                  {content.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {content.contact}
                </button>
              </div>
            </div>
          </div>
        </noscript>
        
        {/* This will be hydrated on the client */}
        <div className="js-content">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{content.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  // Client-side: Show loading state then actual content
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className || ''}`}>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{content.loading}</p>
        </div>
      </div>
    );
  }

  // Client-side: Show actual interactive content
  return <>{children}</>;
}

/**
 * Hook for progressive enhancement
 */
export function useProgressiveEnhancement() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return { isClient, isLoading };
}

/**
 * Loading fallback component
 */
export function LoadingFallback({ 
  locale, 
  message 
}: { 
  locale: SupportedLocale; 
  message?: string; 
}) {
  const defaultMessage = locale === 'fr' 
    ? 'Chargement...' 
    : 'Loading...';

  return (
    <div className="text-center py-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">{message || defaultMessage}</p>
    </div>
  );
}

/**
 * No JavaScript fallback component
 */
export function NoJSFallback({ 
  locale, 
  toolName,
  className 
}: { 
  locale: SupportedLocale; 
  toolName: 'compliance_heatmap' | 'ai_roadmap';
  className?: string;
}) {
  const content = FALLBACK_CONTENT[locale][toolName];

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-6 ${className || ''}`}>
      <div className="flex items-center mb-4">
        <Zap className="w-6 h-6 text-yellow-600 mr-3" />
        <h3 className="text-lg font-semibold text-yellow-800">
          {content.jsRequired}
        </h3>
      </div>
      <p className="text-yellow-700 mb-4">
        {content.jsMessage}
      </p>
      <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
        {content.contact}
      </button>
    </div>
  );
}