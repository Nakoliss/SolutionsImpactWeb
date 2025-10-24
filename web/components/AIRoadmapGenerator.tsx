'use client';

import { useState } from 'react';
import { Calendar, CheckSquare, Clock, DollarSign, MapPin, Shield, Target, Zap } from 'lucide-react';

import type { SupportedLocale } from '@/content';
import { useAnalytics } from '@/lib/analytics';
import { exportAndDownloadRoadmap, type ExportCapability, type RoadmapExportData } from '@/lib/roadmapExport';

interface AIRoadmapGeneratorProps {
  locale: SupportedLocale;
  className?: string;
}

// AI Service categories and capabilities
type ServiceCategory = 'web-development' | 'seo-marketing' | 'ai-integration' | 'compliance' | 'maintenance';

interface AICapability {
  id: string;
  category: ServiceCategory;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  duration: { min: number; max: number }; // in weeks
  effort: 'low' | 'medium' | 'high' | 'very-high';
  price: { min: number; max: number }; // in CAD
  type: 'one-time' | 'monthly' | 'hourly';
  prerequisites: string[];
  benefits: Array<{ fr: string; en: string }>;
  compliance: boolean; // requires Law 25 compliance
}

// Comprehensive AI service capabilities based on business documents
const AI_CAPABILITIES: AICapability[] = [
  {
    id: 'landing-page',
    category: 'web-development',
    name: {
      fr: 'Page d\'atterrissage responsive',
      en: 'Responsive Landing Page'
    },
    description: {
      fr: 'Page unique optimisée pour la conversion avec design responsive, visibilité Google intégrée et contenu bilingue.',
      en: 'Single conversion-optimized page with responsive design, built-in Google visibility work and bilingual content.'
    },
    duration: { min: 1, max: 2 },
    effort: 'low',
    price: { min: 1200, max: 2000 },
    type: 'one-time',
    prerequisites: [],
    benefits: [
      { fr: 'Présence web immédiate', en: 'Immediate web presence' },
      { fr: 'Optimisé pour conversions', en: 'Conversion optimized' },
      { fr: 'visibilité Google intégrée', en: 'Built-in Google visibility work' }
    ],
    compliance: false
  },
  {
    id: 'business-website',
    category: 'web-development',
    name: {
      fr: 'Site web d\'entreprise complet',
      en: 'Complete Business Website'
    },
    description: {
      fr: 'Site de 5-7 pages avec front-end moderne, optimisation Google on-page, contenu bilingue et CMS intégré.',
      en: '5-7 page website with modern front-end, on-page work to help you show up on Google, bilingual content and integrated CMS.'
    },
    duration: { min: 2, max: 4 },
    effort: 'medium',
    price: { min: 3500, max: 5000 },
    type: 'one-time',
    prerequisites: [],
    benefits: [
      { fr: 'Présence professionnelle', en: 'Professional presence' },
      { fr: 'Gestion de contenu facile', en: 'Easy content management' },
      { fr: 'Optimisation multilingue', en: 'Multilingual optimization' }
    ],
    compliance: true
  },
  {
    id: 'ecommerce-site',
    category: 'web-development',
    name: {
      fr: 'Site e-commerce complet',
      en: 'Complete E-commerce Site'
    },
    description: {
      fr: 'Boutique en ligne Shopify/WooCommerce avec produits, paiements, visibilité Google et interface bilingue.',
      en: 'Shopify/WooCommerce online store with products, payments, Google visibility work and bilingual interface.'
    },
    duration: { min: 4, max: 8 },
    effort: 'high',
    price: { min: 8000, max: 12000 },
    type: 'one-time',
    prerequisites: ['business-website'],
    benefits: [
      { fr: 'Ventes en ligne 24/7', en: '24/7 online sales' },
      { fr: 'Gestion d\'inventaire', en: 'Inventory management' },
      { fr: 'Paiements sécurisés', en: 'Secure payments' }
    ],
    compliance: true
  },
  {
    id: 'custom-web-app',
    category: 'web-development',
    name: {
      fr: 'Application web personnalisée',
      en: 'Custom Web Application'
    },
    description: {
      fr: 'Application React avec API, authentification, tableau de bord et fonctionnalités CRUD.',
      en: 'React application with API, authentication, dashboard and CRUD functionality.'
    },
    duration: { min: 8, max: 16 },
    effort: 'very-high',
    price: { min: 15000, max: 25000 },
    type: 'one-time',
    prerequisites: ['business-website'],
    benefits: [
      { fr: 'Processus automatisés', en: 'Automated processes' },
      { fr: 'Expérience utilisateur sur mesure', en: 'Custom user experience' },
      { fr: 'Évolutivité', en: 'Scalability' }
    ],
    compliance: true
  },
  {
    id: 'seo-audit',
    category: 'seo-marketing',
    name: {
      fr: 'Audit audit technique de visibilité Google',
      en: 'Technical Google visibility audit'
    },
    description: {
      fr: 'Analyse complète de jusqu\'à 50 URLs avec rapport sur la vitesse, l\'accessibilité et le schema.',
      en: 'Complete analysis of up to 50 URLs with speed, accessibility and schema reporting.'
    },
    duration: { min: 1, max: 2 },
    effort: 'medium',
    price: { min: 1000, max: 2000 },
    type: 'one-time',
    prerequisites: [],
    benefits: [
      { fr: 'Identification des problèmes', en: 'Issue identification' },
      { fr: 'Plan d\'amélioration', en: 'Improvement roadmap' },
      { fr: 'Benchmarks de performance', en: 'Performance benchmarks' }
    ],
    compliance: false
  },
  {
    id: 'seo-retainer',
    category: 'seo-marketing',
    name: {
      fr: 'Abonnement mensuel pour la visibilité Google',
      en: 'Monthly Google visibility retainer'
    },
    description: {
      fr: 'Optimisation continue avec suivi des mots-clés, mises à jour et 4 articles de blog bilingues.',
      en: 'Ongoing optimization with keyword tracking, updates and 4 bilingual blog posts.'
    },
    duration: { min: 4, max: 52 },
    effort: 'medium',
    price: { min: 1000, max: 2500 },
    type: 'monthly',
    prerequisites: ['seo-audit'],
    benefits: [
      { fr: 'Amélioration continue du classement', en: 'Continuous ranking improvement' },
      { fr: 'Contenu frais régulier', en: 'Fresh content regularly' },
      { fr: 'Suivi des performances', en: 'Performance tracking' }
    ],
    compliance: false
  },
  {
    id: 'auth-database-setup',
    category: 'ai-integration',
    name: {
      fr: 'Configuration auth et base de données',
      en: 'Auth & Database Setup'
    },
    description: {
      fr: 'Mise en place Firebase/Supabase avec flux d\'authentification, rôles et schema API.',
      en: 'Firebase/Supabase setup with authentication flows, roles and API schema.'
    },
    duration: { min: 1, max: 2 },
    effort: 'medium',
    price: { min: 800, max: 1200 },
    type: 'one-time',
    prerequisites: [],
    benefits: [
      { fr: 'Gestion sécurisée des utilisateurs', en: 'Secure user management' },
      { fr: 'Données structurées', en: 'Structured data' },
      { fr: 'API prête à l\'emploi', en: 'Ready-to-use API' }
    ],
    compliance: true
  },
  {
    id: 'booking-integration',
    category: 'ai-integration',
    name: {
      fr: 'Intégration système de réservation',
      en: 'Booking System Integration'
    },
    description: {
      fr: 'Widget de réservation Calendly/Setmore avec styling, webhooks et labels bilingues.',
      en: 'Calendly/Setmore booking widget with styling, webhooks and bilingual labels.'
    },
    duration: { min: 1, max: 2 },
    effort: 'low',
    price: { min: 600, max: 1500 },
    type: 'one-time',
    prerequisites: ['business-website'],
    benefits: [
      { fr: 'Réservations automatisées', en: 'Automated bookings' },
      { fr: 'Synchronisation calendrier', en: 'Calendar synchronization' },
      { fr: 'Notifications automatiques', en: 'Automatic notifications' }
    ],
    compliance: true
  },
  {
    id: 'sms-integration',
    category: 'ai-integration',
    name: {
      fr: 'Intégration SMS',
      en: 'SMS Integration'
    },
    description: {
      fr: 'Service SMS Twilio/Vonage pour OTP, rappels et alertes de commandes.',
      en: 'Twilio/Vonage SMS service for OTP, reminders and order alerts.'
    },
    duration: { min: 1, max: 3 },
    effort: 'medium',
    price: { min: 800, max: 2000 },
    type: 'one-time',
    prerequisites: ['auth-database-setup'],
    benefits: [
      { fr: 'Communication directe clients', en: 'Direct client communication' },
      { fr: 'Authentification sécurisée', en: 'Secure authentication' },
      { fr: 'Engagement amélioré', en: 'Improved engagement' }
    ],
    compliance: true
  },
  {
    id: 'law25-compliance',
    category: 'compliance',
    name: {
      fr: 'Conformité Loi 25 complète',
      en: 'Complete Law 25 Compliance'
    },
    description: {
      fr: 'Implémentation complète: cartographie des données, résidence Canada, endpoints export/delete, alertes violations.',
      en: 'Complete implementation: data mapping, Canada residency, export/delete endpoints, breach alerts.'
    },
    duration: { min: 2, max: 4 },
    effort: 'high',
    price: { min: 3000, max: 6000 },
    type: 'one-time',
    prerequisites: [],
    benefits: [
      { fr: 'Conformité réglementaire', en: 'Regulatory compliance' },
      { fr: 'Protection des données', en: 'Data protection' },
      { fr: 'Confiance des clients', en: 'Client trust' }
    ],
    compliance: true
  },
  {
    id: 'monthly-maintenance',
    category: 'maintenance',
    name: {
      fr: 'Maintenance mensuelle',
      en: 'Monthly Maintenance'
    },
    description: {
      fr: 'Mises à jour de sécurité, sauvegardes, surveillance de disponibilité et corrections de bugs.',
      en: 'Security updates, backups, uptime monitoring and bug fixes.'
    },
    duration: { min: 4, max: 52 },
    effort: 'low',
    price: { min: 150, max: 300 },
    type: 'monthly',
    prerequisites: [],
    benefits: [
      { fr: 'Sécurité continue', en: 'Ongoing security' },
      { fr: 'Performance optimale', en: 'Optimal performance' },
      { fr: 'Tranquillité d\'esprit', en: 'Peace of mind' }
    ],
    compliance: false
  }
];

const CONTENT = {
  fr: {
    title: 'Générateur de Feuille de Route IA',
    subtitle: 'Créez votre plan de transformation numérique personnalisé',
    categories: {
      'web-development': {
        name: 'Développement Web',
        description: 'Sites web et applications personnalisées'
      },
      'seo-marketing': {
        name: 'Visibilité Google et marketing',
        description: 'Optimisation et visibilité en ligne'
      },
      'ai-integration': {
        name: 'Intégration IA',
        description: 'Automatisation et intelligence artificielle'
      },
      'compliance': {
        name: 'Conformité',
        description: 'Respect des réglementations'
      },
      'maintenance': {
        name: 'Maintenance',
        description: 'Support et maintenance continus'
      }
    },
    filters: {
      title: 'Sélectionnez vos besoins',
      selectAll: 'Tout sélectionner',
      selectNone: 'Tout désélectionner',
      complianceNote: 'Les services marqués d\'un bouclier nécessitent une conformité à la Loi 25'
    },
    roadmap: {
      title: 'Votre Feuille de Route IA',
      subtitle: 'Plan chronologique basé sur vos sélections',
      timeline: 'Chronologie',
      budget: 'Budget estimé',
      duration: 'Durée totale',
      effort: {
        low: 'Effort faible',
        medium: 'Effort modéré',
        high: 'Effort élevé',
        'very-high': 'Effort très élevé'
      },
      type: {
        'one-time': 'Paiement unique',
        'monthly': 'Mensuel',
        'hourly': 'Horaire'
      },
      phases: {
        immediate: 'Phase 1: Immédiat (0-2 mois)',
        short: 'Phase 2: Court terme (2-6 mois)',
        medium: 'Phase 3: Moyen terme (6-12 mois)',
        long: 'Phase 4: Long terme (12+ mois)'
      },
      noSelection: 'Sélectionnez des services pour voir votre feuille de route',
      getQuote: 'Obtenir un devis détaillé',
      exportPlan: 'Exporter le plan',
      exportMarkdown: 'Exporter en Markdown',
      exportJSON: 'Exporter en JSON'
    }
  },
  en: {
    title: 'AI Roadmap Generator',
    subtitle: 'Create your personalized digital transformation plan',
    categories: {
      'web-development': {
        name: 'Web Development',
        description: 'Websites and custom applications'
      },
      'seo-marketing': {
        name: 'Google visibility & marketing',
        description: 'Optimization and online visibility'
      },
      'ai-integration': {
        name: 'AI Integration',
        description: 'Automation and artificial intelligence'
      },
      'compliance': {
        name: 'Compliance',
        description: 'Regulatory compliance'
      },
      'maintenance': {
        name: 'Maintenance',
        description: 'Ongoing support and maintenance'
      }
    },
    filters: {
      title: 'Select your needs',
      selectAll: 'Select All',
      selectNone: 'Select None',
      complianceNote: 'Services marked with a shield require Law 25 compliance'
    },
    roadmap: {
      title: 'Your AI Roadmap',
      subtitle: 'Chronological plan based on your selections',
      timeline: 'Timeline',
      budget: 'Estimated Budget',
      duration: 'Total Duration',
      effort: {
        low: 'Low effort',
        medium: 'Medium effort',
        high: 'High effort',
        'very-high': 'Very high effort'
      },
      type: {
        'one-time': 'One-time',
        'monthly': 'Monthly',
        'hourly': 'Hourly'
      },
      phases: {
        immediate: 'Phase 1: Immediate (0-2 months)',
        short: 'Phase 2: Short term (2-6 months)',
        medium: 'Phase 3: Medium term (6-12 months)',
        long: 'Phase 4: Long term (12+ months)'
      },
      noSelection: 'Select services to see your roadmap',
      getQuote: 'Get Detailed Quote',
      exportPlan: 'Export Plan',
      exportMarkdown: 'Export as Markdown',
      exportJSON: 'Export as JSON'
    }
  }
};

export default function AIRoadmapGenerator({ locale, className }: AIRoadmapGeneratorProps) {
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const content = CONTENT[locale];
  const analytics = useAnalytics();

  // Group capabilities by category
  const capabilitiesByCategory = AI_CAPABILITIES.reduce((acc, capability) => {
    if (!acc[capability.category]) {
      acc[capability.category] = [];
    }
    acc[capability.category].push(capability);
    return acc;
  }, {} as Record<ServiceCategory, AICapability[]>);

  // Generate roadmap phases based on selected capabilities
  const generateRoadmap = () => {
    const selected = AI_CAPABILITIES.filter(cap => selectedCapabilities.includes(cap.id));
    
    // Sort by dependencies and duration
    const sorted = [...selected].sort((a, b) => {
      // Prerequisites first
      const aHasPrereqs = a.prerequisites.some(prereq => selectedCapabilities.includes(prereq));
      const bHasPrereqs = b.prerequisites.some(prereq => selectedCapabilities.includes(prereq));
      
      if (aHasPrereqs && !bHasPrereqs) return 1;
      if (!aHasPrereqs && bHasPrereqs) return -1;
      
      // Then by effort/duration
      const effortOrder = { low: 1, medium: 2, high: 3, 'very-high': 4 };
      return effortOrder[a.effort] - effortOrder[b.effort];
    });

    // Organize into phases
    const phases = {
      immediate: [] as AICapability[],
      short: [] as AICapability[],
      medium: [] as AICapability[],
      long: [] as AICapability[]
    };

    let currentWeek = 0;
    
    sorted.forEach(capability => {
      const avgDuration = (capability.duration.min + capability.duration.max) / 2;
      
      if (currentWeek <= 8) {
        phases.immediate.push(capability);
      } else if (currentWeek <= 24) {
        phases.short.push(capability);
      } else if (currentWeek <= 48) {
        phases.medium.push(capability);
      } else {
        phases.long.push(capability);
      }
      
      currentWeek += avgDuration;
    });

    return phases;
  };

  // Calculate totals
  const calculateTotals = () => {
    const selected = AI_CAPABILITIES.filter(cap => selectedCapabilities.includes(cap.id));
    
    const totalBudget = selected.reduce((sum, cap) => {
      const avgPrice = (cap.price.min + cap.price.max) / 2;
      return sum + avgPrice;
    }, 0);

    const totalDuration = selected.reduce((sum, cap) => {
      const avgDuration = (cap.duration.min + cap.duration.max) / 2;
      return sum + avgDuration;
    }, 0);

    return { totalBudget, totalDuration };
  };

  const handleCapabilityToggle = (capabilityId: string, checked: boolean) => {
    let newSelection;
    
    if (checked) {
      newSelection = [...selectedCapabilities, capabilityId];
    } else {
      newSelection = selectedCapabilities.filter(id => id !== capabilityId);
    }
    
    setSelectedCapabilities(newSelection);
    setShowRoadmap(newSelection.length > 0);
  };

  const handleCategoryToggle = (category: ServiceCategory, selectAll: boolean) => {
    const categoryCapabilities = capabilitiesByCategory[category].map(cap => cap.id);
    
    if (selectAll) {
      const newSelection = [...new Set([...selectedCapabilities, ...categoryCapabilities])];
      setSelectedCapabilities(newSelection);
    } else {
      const newSelection = selectedCapabilities.filter(id => !categoryCapabilities.includes(id));
      setSelectedCapabilities(newSelection);
    }
  };

  const handleGenerateRoadmap = () => {
    setShowRoadmap(true);
    
    analytics.track('ai_roadmap_generated', {
      capabilities_count: selectedCapabilities.length,
      selected_capabilities: selectedCapabilities.join(','),
      estimated_budget: calculateTotals().totalBudget,
      estimated_duration: calculateTotals().totalDuration,
      locale
    });
  };

  const handleGetQuote = () => {
    analytics.track('roadmap_quote_requested', {
      capabilities: selectedCapabilities.join(','),
      estimated_budget: calculateTotals().totalBudget,
      locale
    });
    
    // TODO: Navigate to contact form or open quote modal
    console.log('Quote requested with roadmap:', selectedCapabilities);
  };

  // Convert AI capabilities to export format
  const convertCapabilitiesToExport = (capabilities: AICapability[]): ExportCapability[] => {
    return capabilities.map(cap => ({
      id: cap.id,
      name: cap.name[locale],
      description: cap.description[locale],
      duration: cap.duration,
      effort: content.roadmap.effort[cap.effort],
      price: cap.price,
      type: content.roadmap.type[cap.type],
      benefits: cap.benefits.map(benefit => benefit[locale]),
      compliance: cap.compliance
    }));
  };

  // Handle roadmap export
  const handleExportRoadmap = (format: 'markdown' | 'json') => {
    const roadmapPhases = generateRoadmap();
    const { totalBudget, totalDuration } = calculateTotals();
    
    const exportData: RoadmapExportData = {
      generatedAt: new Date().toISOString(),
      locale,
      selectedCapabilities,
      totalBudget,
      totalDuration,
      phases: {
        immediate: convertCapabilitiesToExport(roadmapPhases.immediate),
        short: convertCapabilitiesToExport(roadmapPhases.short),
        medium: convertCapabilitiesToExport(roadmapPhases.medium),
        long: convertCapabilitiesToExport(roadmapPhases.long)
      },
      metadata: {
        companyName: '', // Could be collected from user input
        contactEmail: '',
        notes: ''
      }
    };

    analytics.track('roadmap_exported', {
      format,
      capabilities_count: selectedCapabilities.length,
      total_budget: totalBudget,
      total_duration: totalDuration,
      locale
    });

    exportAndDownloadRoadmap(exportData, format);
  };

  const getEffortColor = (effort: AICapability['effort']) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very-high': return 'bg-red-100 text-red-800';
    }
  };

  const roadmapPhases = generateRoadmap();
  const { totalBudget, totalDuration } = calculateTotals();

  return (
    <div data-roadmap-generator className={`bg-white rounded-lg shadow-lg p-6 ${className || ''}`}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
        </div>
        <p className="text-gray-600">{content.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Capabilities Selection */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            {content.filters.title}
          </h3>
          
          <p className="text-sm text-blue-600 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            {content.filters.complianceNote}
          </p>

          {Object.entries(capabilitiesByCategory).map(([category, capabilities]) => (
            <div key={category} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {content.categories[category as ServiceCategory].name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {content.categories[category as ServiceCategory].description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCategoryToggle(category as ServiceCategory, true)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {content.filters.selectAll}
                    </button>
                    <button
                      onClick={() => handleCategoryToggle(category as ServiceCategory, false)}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      {content.filters.selectNone}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {capabilities.map(capability => (
                  <label
                    key={capability.id}
                    className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCapabilities.includes(capability.id)}
                      onChange={(e) => handleCapabilityToggle(capability.id, e.target.checked)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">
                          {capability.name[locale]}
                        </h5>
                        {capability.compliance && (
                          <Shield className="w-4 h-4 text-blue-600" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${getEffortColor(capability.effort)}`}>
                          {content.roadmap.effort[capability.effort]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {capability.description[locale]}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${capability.price.min.toLocaleString()} - ${capability.price.max.toLocaleString()} CAD
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {capability.duration.min}-{capability.duration.max} semaines
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {selectedCapabilities.length > 0 && (
            <button
              onClick={handleGenerateRoadmap}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Générer la feuille de route
            </button>
          )}
        </div>

        {/* Roadmap Display */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            {content.roadmap.title}
          </h3>

          {showRoadmap && selectedCapabilities.length > 0 ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${totalBudget.toLocaleString()} CAD
                  </div>
                  <div className="text-sm text-gray-600">{content.roadmap.budget}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.ceil(totalDuration)} sem.
                  </div>
                  <div className="text-sm text-gray-600">{content.roadmap.duration}</div>
                </div>
              </div>

              {/* Timeline Phases */}
              <div className="space-y-4">
                {Object.entries(roadmapPhases).map(([phase, capabilities]) => {
                  if (capabilities.length === 0) return null;
                  
                  return (
                    <div key={phase} className="bg-white rounded-lg border p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {content.roadmap.phases[phase as keyof typeof content.roadmap.phases]}
                      </h4>
                      
                      <div className="space-y-2">
                        {capabilities.map(capability => (
                          <div key={capability.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {capability.name[locale]}
                              </div>
                              <div className="text-xs text-gray-600">
                                {capability.duration.min}-{capability.duration.max} sem. • 
                                ${capability.price.min.toLocaleString()}-${capability.price.max.toLocaleString()} CAD
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${getEffortColor(capability.effort)}`}>
                              {content.roadmap.effort[capability.effort]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleGetQuote}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {content.roadmap.getQuote}
                </button>
                
                {/* Export Options */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleExportRoadmap('markdown')}
                    className="bg-gray-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm"
                    title={content.roadmap.exportMarkdown}
                  >
                    📄 Markdown
                  </button>
                  <button
                    onClick={() => handleExportRoadmap('json')}
                    className="bg-gray-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm"
                    title={content.roadmap.exportJSON}
                  >
                    📊 JSON
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{content.roadmap.noSelection}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}