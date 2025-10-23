'use client';

import { useState } from 'react';
import { AlertTriangle, Building, ChevronRight, Database, FileText, Info, Shield, Users } from 'lucide-react';

import type { SupportedLocale } from '@/content';
import { useAnalytics } from '@/lib/analytics';

interface ComplianceHeatmapProps {
  locale: SupportedLocale;
  className?: string;
}

// Company size categories (aligned with pricing calculator)
type CompanySize = '1-5' | '6-25' | '26-100' | '101-500' | '500+';

// Quebec business sectors with specific compliance considerations
type BusinessSector = 
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'government'
  | 'technology'
  | 'retail'
  | 'manufacturing'
  | 'professional-services'
  | 'non-profit'
  | 'other';

// Data categories that affect compliance requirements
type DataCategory = 
  | 'personal-info'
  | 'financial-data'
  | 'health-records'
  | 'biometric-data'
  | 'location-data'
  | 'employee-data'
  | 'customer-communications'
  | 'technical-logs';

// Compliance requirement with Quebec-specific priorities
interface ComplianceRequirement {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  regulation: 'loi-25' | 'pipeda' | 'ccpa' | 'gdpr' | 'sector-specific';
  deadline?: { fr: string; en: string };
  effort: 'low' | 'medium' | 'high' | 'very-high';
  sectors: BusinessSector[];
  companySizes: CompanySize[];
  dataCategories: DataCategory[];
  resources: Array<{
    title: { fr: string; en: string };
    url: string;
    type: 'guide' | 'template' | 'law' | 'external';
  }>;
}

// Comprehensive compliance requirements database
const COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: 'loi25-privacy-policy',
    priority: 'critical',
    title: {
      fr: 'Politique de confidentialité conforme à la Loi 25',
      en: 'Law 25 Compliant Privacy Policy'
    },
    description: {
      fr: 'Rédiger et publier une politique de confidentialité détaillée respectant les exigences de la Loi 25 du Québec.',
      en: 'Draft and publish a detailed privacy policy meeting Quebec Law 25 requirements.'
    },
    regulation: 'loi-25',
    deadline: {
      fr: 'Obligatoire depuis septembre 2022',
      en: 'Required since September 2022'
    },
    effort: 'medium',
    sectors: ['healthcare', 'finance', 'education', 'government', 'technology', 'retail', 'manufacturing', 'professional-services', 'non-profit', 'other'],
    companySizes: ['1-5', '6-25', '26-100', '101-500', '500+'],
    dataCategories: ['personal-info', 'financial-data', 'health-records', 'employee-data', 'customer-communications'],
    resources: [
      {
        title: { fr: 'Guide de la CAI', en: 'CAI Guidelines' },
        url: 'https://www.cai.gouv.qc.ca/',
        type: 'guide'
      }
    ]
  },
  {
    id: 'data-residency-mapping',
    priority: 'critical',
    title: {
      fr: 'Cartographie de la résidence des données',
      en: 'Data Residency Mapping'
    },
    description: {
      fr: 'Documenter où sont stockées toutes les données personnelles et identifier les transferts transfrontaliers.',
      en: 'Document where all personal data is stored and identify cross-border transfers.'
    },
    regulation: 'loi-25',
    effort: 'high',
    sectors: ['healthcare', 'finance', 'education', 'government', 'technology', 'retail', 'manufacturing', 'professional-services'],
    companySizes: ['6-25', '26-100', '101-500', '500+'],
    dataCategories: ['personal-info', 'financial-data', 'health-records', 'biometric-data', 'location-data', 'employee-data'],
    resources: [
      {
        title: { fr: 'Guide de résidence des données', en: 'Data Residency Guide' },
        url: '/content/compliance/bill-64-data-residency-guide',
        type: 'guide'
      }
    ]
  },
  {
    id: 'breach-notification-procedure',
    priority: 'high',
    title: {
      fr: 'Procédure de notification des violations',
      en: 'Data Breach Notification Procedure'
    },
    description: {
      fr: 'Établir une procédure pour détecter, évaluer et notifier les violations de données dans les 72 heures.',
      en: 'Establish procedure to detect, assess and notify data breaches within 72 hours.'
    },
    regulation: 'loi-25',
    effort: 'medium',
    sectors: ['healthcare', 'finance', 'education', 'government', 'technology', 'retail', 'professional-services'],
    companySizes: ['26-100', '101-500', '500+'],
    dataCategories: ['personal-info', 'financial-data', 'health-records', 'biometric-data'],
    resources: []
  },
  {
    id: 'consent-management',
    priority: 'high',
    title: {
      fr: 'Système de gestion du consentement',
      en: 'Consent Management System'
    },
    description: {
      fr: 'Implémenter un système pour obtenir, enregistrer et gérer le consentement explicite des utilisateurs.',
      en: 'Implement system to obtain, record and manage explicit user consent.'
    },
    regulation: 'loi-25',
    effort: 'high',
    sectors: ['technology', 'retail', 'professional-services', 'healthcare', 'education'],
    companySizes: ['6-25', '26-100', '101-500', '500+'],
    dataCategories: ['personal-info', 'location-data', 'customer-communications', 'technical-logs'],
    resources: []
  },
  {
    id: 'data-portability-tools',
    priority: 'medium',
    title: {
      fr: 'Outils de portabilité des données',
      en: 'Data Portability Tools'
    },
    description: {
      fr: 'Développer des outils permettant aux utilisateurs d\'exporter leurs données dans un format structuré.',
      en: 'Develop tools allowing users to export their data in structured format.'
    },
    regulation: 'loi-25',
    effort: 'high',
    sectors: ['technology', 'retail', 'healthcare', 'education', 'professional-services'],
    companySizes: ['26-100', '101-500', '500+'],
    dataCategories: ['personal-info', 'customer-communications', 'location-data'],
    resources: []
  },
  {
    id: 'hipaa-compliance',
    priority: 'critical',
    title: {
      fr: 'Conformité aux normes de santé (secteur)',
      en: 'Healthcare Sector Compliance (HIPAA-equivalent)'
    },
    description: {
      fr: 'Implémenter les mesures de sécurité spécifiques au secteur de la santé pour les données médicales.',
      en: 'Implement healthcare-specific security measures for medical data.'
    },
    regulation: 'sector-specific',
    effort: 'very-high',
    sectors: ['healthcare'],
    companySizes: ['6-25', '26-100', '101-500', '500+'],
    dataCategories: ['health-records', 'biometric-data', 'personal-info'],
    resources: []
  },
  {
    id: 'financial-regulatory-compliance',
    priority: 'critical',
    title: {
      fr: 'Conformité réglementaire financière',
      en: 'Financial Regulatory Compliance'
    },
    description: {
      fr: 'Respecter les exigences sectorielles pour la protection des données financières et KYC.',
      en: 'Meet sector requirements for financial data protection and KYC.'
    },
    regulation: 'sector-specific',
    effort: 'very-high',
    sectors: ['finance'],
    companySizes: ['6-25', '26-100', '101-500', '500+'],
    dataCategories: ['financial-data', 'personal-info', 'biometric-data'],
    resources: []
  },
  {
    id: 'employee-privacy-rights',
    priority: 'medium',
    title: {
      fr: 'Droits à la vie privée des employés',
      en: 'Employee Privacy Rights'
    },
    description: {
      fr: 'Établir des politiques claires pour la collecte et l\'utilisation des données des employés.',
      en: 'Establish clear policies for employee data collection and usage.'
    },
    regulation: 'loi-25',
    effort: 'medium',
    sectors: ['manufacturing', 'retail', 'professional-services', 'technology', 'healthcare', 'finance'],
    companySizes: ['26-100', '101-500', '500+'],
    dataCategories: ['employee-data', 'biometric-data', 'location-data'],
    resources: []
  }
];

const CONTENT = {
  fr: {
    title: 'Carte de Chaleur de Conformité',
    subtitle: 'Identifiez vos priorités de conformité selon votre secteur et vos données',
    filters: {
      sector: {
        label: 'Secteur d\'activité',
        description: 'Sélectionnez votre secteur principal',
        options: {
          healthcare: 'Santé et services sociaux',
          finance: 'Services financiers',
          education: 'Éducation',
          government: 'Secteur public',
          technology: 'Technologies de l\'information',
          retail: 'Commerce de détail',
          manufacturing: 'Fabrication et industrie',
          'professional-services': 'Services professionnels',
          'non-profit': 'Organisme à but non lucratif',
          other: 'Autre secteur'
        }
      },
      companySize: {
        label: 'Taille de l\'organisation',
        description: 'Nombre d\'employés approximatif',
        options: {
          '1-5': '1-5 employés (Startup)',
          '6-25': '6-25 employés (PME)',
          '26-100': '26-100 employés (Moyenne)',
          '101-500': '101-500 employés (Grande)',
          '500+': '500+ employés (Entreprise)'
        }
      },
      dataCategories: {
        label: 'Types de données traitées',
        description: 'Sélectionnez tous les types de données que vous collectez',
        options: {
          'personal-info': 'Informations personnelles de base',
          'financial-data': 'Données financières',
          'health-records': 'Dossiers médicaux/santé',
          'biometric-data': 'Données biométriques',
          'location-data': 'Données de géolocalisation',
          'employee-data': 'Données des employés',
          'customer-communications': 'Communications clients',
          'technical-logs': 'Journaux techniques/logs'
        }
      }
    },
    results: {
      title: 'Vos Priorités de Conformité',
      subtitle: 'Basé sur vos sélections, voici vos exigences de conformité par ordre de priorité',
      priority: {
        critical: 'Critique',
        high: 'Élevée',
        medium: 'Modérée',
        low: 'Faible'
      },
      effort: {
        low: 'Effort faible',
        medium: 'Effort modéré',
        high: 'Effort élevé',
        'very-high': 'Effort très élevé'
      },
      regulation: {
        'loi-25': 'Loi 25 (Québec)',
        'pipeda': 'PIPEDA (Canada)',
        'ccpa': 'CCPA (Californie)',
        'gdpr': 'RGPD (Europe)',
        'sector-specific': 'Réglementation sectorielle'
      },
      noResults: 'Aucune exigence spécifique trouvée pour vos critères.',
      getConsultation: 'Obtenir une consultation personnalisée',
      downloadReport: 'Télécharger le rapport PDF'
    }
  },
  en: {
    title: 'Compliance Heatmap',
    subtitle: 'Identify your compliance priorities based on your sector and data types',
    filters: {
      sector: {
        label: 'Business Sector',
        description: 'Select your primary business sector',
        options: {
          healthcare: 'Healthcare & Social Services',
          finance: 'Financial Services',
          education: 'Education',
          government: 'Government & Public Sector',
          technology: 'Information Technology',
          retail: 'Retail & Commerce',
          manufacturing: 'Manufacturing & Industry',
          'professional-services': 'Professional Services',
          'non-profit': 'Non-profit Organization',
          other: 'Other Sector'
        }
      },
      companySize: {
        label: 'Organization Size',
        description: 'Approximate number of employees',
        options: {
          '1-5': '1-5 employees (Startup)',
          '6-25': '6-25 employees (Small)',
          '26-100': '26-100 employees (Medium)',
          '101-500': '101-500 employees (Large)',
          '500+': '500+ employees (Enterprise)'
        }
      },
      dataCategories: {
        label: 'Data Types Processed',
        description: 'Select all data types you collect or process',
        options: {
          'personal-info': 'Basic Personal Information',
          'financial-data': 'Financial Data',
          'health-records': 'Health/Medical Records',
          'biometric-data': 'Biometric Data',
          'location-data': 'Location/GPS Data',
          'employee-data': 'Employee Data',
          'customer-communications': 'Customer Communications',
          'technical-logs': 'Technical Logs/Analytics'
        }
      }
    },
    results: {
      title: 'Your Compliance Priorities',
      subtitle: 'Based on your selections, here are your compliance requirements prioritized',
      priority: {
        critical: 'Critical',
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      effort: {
        low: 'Low effort',
        medium: 'Medium effort',
        high: 'High effort',
        'very-high': 'Very high effort'
      },
      regulation: {
        'loi-25': 'Law 25 (Quebec)',
        'pipeda': 'PIPEDA (Canada)',
        'ccpa': 'CCPA (California)',
        'gdpr': 'GDPR (Europe)',
        'sector-specific': 'Sector-specific Regulation'
      },
      noResults: 'No specific requirements found for your criteria.',
      getConsultation: 'Get Personalized Consultation',
      downloadReport: 'Download PDF Report'
    }
  }
};

export default function ComplianceHeatmap({ locale, className }: ComplianceHeatmapProps) {
  const [sector, setSector] = useState<BusinessSector | ''>('');
  const [companySize, setCompanySize] = useState<CompanySize | ''>('');
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([]);
  const [showResults, setShowResults] = useState(false);

  const content = CONTENT[locale];
  const analytics = useAnalytics();

  // Filter compliance requirements based on user selections
  const getFilteredRequirements = (): ComplianceRequirement[] => {
    if (!sector || !companySize || dataCategories.length === 0) {
      return [];
    }

    return COMPLIANCE_REQUIREMENTS
      .filter(req => 
        req.sectors.includes(sector) &&
        req.companySizes.includes(companySize) &&
        req.dataCategories.some(cat => dataCategories.includes(cat))
      )
      .sort((a, b) => {
        // Sort by priority (critical > high > medium > low)
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by effort (lower effort first for same priority)
        const effortOrder = { low: 1, medium: 2, high: 3, 'very-high': 4 };
        return effortOrder[a.effort] - effortOrder[b.effort];
      });
  };

  const handleDataCategoryChange = (category: DataCategory, checked: boolean) => {
    if (checked) {
      setDataCategories(prev => [...prev, category]);
    } else {
      setDataCategories(prev => prev.filter(cat => cat !== category));
    }
  };

  const handleGenerateHeatmap = () => {
    setShowResults(true);
    
    analytics.track('compliance_heatmap_generated', {
      sector,
      company_size: companySize,
      data_categories: dataCategories.join(','),
      requirements_count: getFilteredRequirements().length,
      locale
    });
  };

  const handleGetConsultation = () => {
    analytics.track('compliance_consultation_requested', {
      source: 'heatmap',
      sector,
      company_size: companySize,
      data_categories: dataCategories.join(','),
      locale
    });
    
    // TODO: Navigate to contact form or open consultation modal
    console.log('Consultation requested with context:', { sector, companySize, dataCategories });
  };

  const getPriorityColor = (priority: ComplianceRequirement['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getEffortColor = (effort: ComplianceRequirement['effort']) => {
    switch (effort) {
      case 'low': return 'bg-green-50 text-green-700';
      case 'medium': return 'bg-yellow-50 text-yellow-700';
      case 'high': return 'bg-orange-50 text-orange-700';
      case 'very-high': return 'bg-red-50 text-red-700';
    }
  };

  const filteredRequirements = getFilteredRequirements();

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className || ''}`}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
        </div>
        <p className="text-gray-600">{content.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Sector Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              <Building className="w-4 h-4 inline mr-2" />
              {content.filters.sector.label}
            </label>
            <p className="text-sm text-gray-600 mb-4">{content.filters.sector.description}</p>
            
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as BusinessSector)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un secteur...</option>
              {Object.entries(content.filters.sector.options).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              <Users className="w-4 h-4 inline mr-2" />
              {content.filters.companySize.label}
            </label>
            <p className="text-sm text-gray-600 mb-4">{content.filters.companySize.description}</p>
            
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value as CompanySize)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez une taille...</option>
              {Object.entries(content.filters.companySize.options).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Data Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              <Database className="w-4 h-4 inline mr-2" />
              {content.filters.dataCategories.label}
            </label>
            <p className="text-sm text-gray-600 mb-4">{content.filters.dataCategories.description}</p>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(content.filters.dataCategories.options).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={dataCategories.includes(key as DataCategory)}
                    onChange={(e) => handleDataCategoryChange(key as DataCategory, e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateHeatmap}
            disabled={!sector || !companySize || dataCategories.length === 0}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Générer la carte de conformité
          </button>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {content.results.title}
          </h3>

          {showResults ? (
            <div className="space-y-6">
              {filteredRequirements.length > 0 ? (
                <>
                  <p className="text-gray-600 text-sm mb-4">{content.results.subtitle}</p>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredRequirements.map((requirement) => (
                      <div key={requirement.id} className="bg-white rounded-lg border p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 flex-1">
                            {requirement.title[locale]}
                          </h4>
                          <div className="flex gap-2 ml-2">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(requirement.priority)}`}>
                              {content.results.priority[requirement.priority]}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getEffortColor(requirement.effort)}`}>
                              {content.results.effort[requirement.effort]}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {requirement.description[locale]}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{content.results.regulation[requirement.regulation]}</span>
                          {requirement.deadline && (
                            <span className="text-red-600 font-medium">
                              {requirement.deadline[locale]}
                            </span>
                          )}
                        </div>
                        
                        {requirement.resources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                              {requirement.resources.map((resource, index) => (
                                <a
                                  key={index}
                                  href={resource.url}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  {resource.title[locale]}
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleGetConsultation}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {content.results.getConsultation}
                    </button>
                    <button
                      onClick={() => {
                        analytics.track('compliance_report_download_requested', {
                          sector,
                          company_size: companySize,
                          requirements_count: filteredRequirements.length,
                          locale
                        });
                        // TODO: Generate and download PDF report
                        console.log('PDF download requested');
                      }}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      {content.results.downloadReport}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{content.results.noResults}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Configurez vos paramètres pour voir votre carte de conformité</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}