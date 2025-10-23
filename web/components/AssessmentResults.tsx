'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle, Clock, Download, Mail,Star, X } from 'lucide-react';

import type { AssessmentResult } from '@/components/AIReadinessAssessment';
import type { SupportedLocale } from '@/content';
import { useAnalytics } from '@/lib/analytics';
import { generateRecommendations } from '@/lib/assessmentRecommendations';

interface AssessmentResultsProps {
  locale: SupportedLocale;
  result: AssessmentResult;
  isOpen: boolean;
  onClose: () => void;
  onRequestConsultation?: () => void;
}

const CONTENT = {
  fr: {
    title: 'Résultats de votre évaluation IA',
    overallScore: 'Score global',
    readinessLevel: 'Niveau de maturité IA',
    categoryScores: 'Scores par catégorie',
    recommendations: 'Recommandations personnalisées',
    nextSteps: 'Prochaines étapes',
    estimatedTimeline: 'Chronologie estimée',
    immediate: 'Actions immédiates',
    shortTerm: 'Court terme (1-3 mois)',
    longTerm: 'Long terme (3-12 mois)',
    priority: 'Priorité',
    effort: 'Effort',
    timeline: 'Délai',
    actions: 'Actions recommandées',
    resources: 'Ressources',
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Faible',
    requestConsultation: 'Demander une consultation',
    downloadReport: 'Télécharger le rapport',
    close: 'Fermer',
    categories: {
      business: 'Stratégie d\'affaires',
      technical: 'Infrastructure technique',
      data: 'Gestion des données',
      culture: 'Culture et équipe'
    },
    levels: {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert'
    },
    levelDescriptions: {
      beginner: 'Votre organisation commence son parcours IA. Focus sur les fondations.',
      intermediate: 'Bonnes bases établies. Prêt pour des projets pilotes.',
      advanced: 'Infrastructure mature. Prêt pour le déploiement à grande échelle.',
      expert: 'Excellence IA. Optimisation continue et innovation.'
    },
    consultation: {
      title: 'Prêt pour la prochaine étape?',
      description: 'Nos experts peuvent vous aider à transformer ces recommandations en plan d\'action concret.',
      benefits: [
        'Stratégie IA personnalisée',
        'Feuille de route détaillée',
        'Estimation de ROI',
        'Plan d\'implémentation'
      ]
    }
  },
  en: {
    title: 'Your AI Readiness Assessment Results',
    overallScore: 'Overall Score',
    readinessLevel: 'AI Maturity Level',
    categoryScores: 'Category Scores',
    recommendations: 'Personalized Recommendations',
    nextSteps: 'Next Steps',
    estimatedTimeline: 'Estimated Timeline',
    immediate: 'Immediate Actions',
    shortTerm: 'Short Term (1-3 months)',
    longTerm: 'Long Term (3-12 months)',
    priority: 'Priority',
    effort: 'Effort',
    timeline: 'Timeline',
    actions: 'Recommended Actions',
    resources: 'Resources',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    requestConsultation: 'Request Consultation',
    downloadReport: 'Download Report',
    close: 'Close',
    categories: {
      business: 'Business Strategy',
      technical: 'Technical Infrastructure',
      data: 'Data Management',
      culture: 'Culture & Team'
    },
    levels: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      expert: 'Expert'
    },
    levelDescriptions: {
      beginner: 'Your organization is starting its AI journey. Focus on foundations.',
      intermediate: 'Good foundations established. Ready for pilot projects.',
      advanced: 'Mature infrastructure. Ready for large-scale deployment.',
      expert: 'AI excellence. Continuous optimization and innovation.'
    },
    consultation: {
      title: 'Ready for the next step?',
      description: 'Our experts can help you transform these recommendations into a concrete action plan.',
      benefits: [
        'Personalized AI strategy',
        'Detailed roadmap',
        'ROI estimation',
        'Implementation plan'
      ]
    }
  }
};

export default function AssessmentResults({
  locale,
  result,
  isOpen,
  onClose,
  onRequestConsultation
}: AssessmentResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'next-steps'>('overview');
  const content = CONTENT[locale];
  const recommendationPlan = generateRecommendations(result);
  const analytics = useAnalytics();

  // Track results viewing when modal opens
  useEffect(() => {
    if (isOpen) {
      analytics.trackAssessmentResultsViewed(result, activeTab, locale);
    }
  }, [isOpen, analytics, result, locale, activeTab]);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-blue-600 bg-blue-100';
    if (score >= 25) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'expert':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'advanced':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'intermediate':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
          {result.overallScore}%
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-2">
            {getLevelIcon(result.readinessLevel)}
            <h3 className="text-xl font-semibold">
              {content.levels[result.readinessLevel]}
            </h3>
          </div>
          <p className="text-gray-600 mt-2">
            {content.levelDescriptions[result.readinessLevel]}
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <div>
        <h4 className="text-lg font-semibold mb-4">{content.categoryScores}</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(result.categoryScores).map(([category, score]) => (
            <div key={category} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  {content.categories[category as keyof typeof content.categories]}
                </span>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${getScoreColor(score)}`}>
                  {score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    score >= 75 ? 'bg-green-500' :
                    score >= 50 ? 'bg-blue-500' :
                    score >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      {recommendationPlan.recommendations.map((rec, _index) => (
        <div key={rec.id} className="border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900">
                {rec.title[locale]}
              </h4>
              <p className="text-gray-600 mt-1">
                {rec.description[locale]}
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(rec.priority)}`}>
                {content[rec.priority as 'high' | 'medium' | 'low']}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-sm">
              <span className="font-medium">{content.effort}:</span>
              <span className="ml-2">{content[rec.effort as 'high' | 'medium' | 'low']}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{content.timeline}:</span>
              <span className="ml-2">{rec.timeline}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{content.priority}:</span>
              <span className="ml-2">{content[rec.priority as 'high' | 'medium' | 'low']}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="font-medium mb-2">{content.actions}</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {rec.actions[locale].map((action, actionIndex) => (
                  <li key={actionIndex}>{action}</li>
                ))}
              </ul>
            </div>
            
            {rec.resources && (
              <div>
                <h5 className="font-medium mb-2">{content.resources}</h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {rec.resources[locale].map((resource, resourceIndex) => (
                    <li key={resourceIndex}>{resource}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderNextSteps = () => (
    <div className="space-y-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">{content.estimatedTimeline}</h4>
        <p className="text-blue-800">{recommendationPlan.estimatedTimeline[locale]}</p>
      </div>

      {/* Immediate Actions */}
      {recommendationPlan.nextSteps.immediate.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            {content.immediate}
          </h4>
          <div className="space-y-3">
            {recommendationPlan.nextSteps.immediate.map((rec) => (
              <div key={rec.id} className="flex items-center p-3 border-l-4 border-red-500 bg-red-50 rounded">
                <div className="flex-1">
                  <h5 className="font-medium">{rec.title[locale]}</h5>
                  <p className="text-sm text-gray-600">{rec.description[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Short Term Actions */}
      {recommendationPlan.nextSteps.shortTerm.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            {content.shortTerm}
          </h4>
          <div className="space-y-3">
            {recommendationPlan.nextSteps.shortTerm.map((rec) => (
              <div key={rec.id} className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                <div className="flex-1">
                  <h5 className="font-medium">{rec.title[locale]}</h5>
                  <p className="text-sm text-gray-600">{rec.description[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long Term Actions */}
      {recommendationPlan.nextSteps.longTerm.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-green-500" />
            {content.longTerm}
          </h4>
          <div className="space-y-3">
            {recommendationPlan.nextSteps.longTerm.map((rec) => (
              <div key={rec.id} className="flex items-center p-3 border-l-4 border-green-500 bg-green-50 rounded">
                <div className="flex-1">
                  <h5 className="font-medium">{rec.title[locale]}</h5>
                  <p className="text-sm text-gray-600">{rec.description[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: content.overallScore },
              { id: 'recommendations', label: content.recommendations },
              { id: 'next-steps', label: content.nextSteps }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'recommendations' | 'next-steps')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'recommendations' && renderRecommendations()}
          {activeTab === 'next-steps' && renderNextSteps()}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h4 className="font-semibold mb-2">{content.consultation.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{content.consultation.description}</p>
              <ul className="text-xs text-gray-500 space-y-1">
                {content.consultation.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  analytics.trackDownloadRequested('assessment_report', 'ai_readiness_assessment', locale);
                  // TODO: Implement actual PDF download
                }}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                {content.downloadReport}
              </button>
              
              {onRequestConsultation && (
                <button
                  onClick={() => {
                    analytics.trackConsultationRequested('assessment_results', result, locale);
                    onRequestConsultation();
                  }}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {content.requestConsultation}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}