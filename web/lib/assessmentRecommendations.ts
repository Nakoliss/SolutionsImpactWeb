/**
 * AI Readiness Assessment Recommendation Engine
 * Maps assessment results to specific recommendations and next steps
 */

import type { AssessmentResult } from '@/components/AIReadinessAssessment';
import type { SupportedLocale } from '@/content';

export interface Recommendation {
  id: string;
  category: 'business' | 'technical' | 'data' | 'culture';
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeline: 'immediate' | 'short' | 'medium' | 'long';
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  actions: {
    fr: string[];
    en: string[];
  };
  resources?: {
    fr: string[];
    en: string[];
  };
}

export interface RecommendationPlan {
  readinessLevel: AssessmentResult['readinessLevel'];
  overallScore: number;
  recommendations: Recommendation[];
  nextSteps: {
    immediate: Recommendation[];
    shortTerm: Recommendation[];
    longTerm: Recommendation[];
  };
  estimatedTimeline: {
    fr: string;
    en: string;
  };
}

// Comprehensive recommendation database
const RECOMMENDATIONS: Record<string, Recommendation> = {
  // Business Strategy Recommendations
  business_strategy_foundation: {
    id: 'business_strategy_foundation',
    category: 'business',
    priority: 'high',
    effort: 'medium',
    timeline: 'immediate',
    title: {
      fr: 'Développer une stratégie IA fondamentale',
      en: 'Develop foundational AI strategy'
    },
    description: {
      fr: 'Établir une vision claire et des objectifs mesurables pour l\'adoption de l\'IA dans votre organisation.',
      en: 'Establish a clear vision and measurable goals for AI adoption in your organization.'
    },
    actions: {
      fr: [
        'Identifier les cas d\'usage IA prioritaires',
        'Définir des KPIs pour mesurer le succès',
        'Créer un comité de pilotage IA',
        'Évaluer le ROI potentiel des initiatives IA'
      ],
      en: [
        'Identify priority AI use cases',
        'Define KPIs to measure success',
        'Create an AI steering committee',
        'Assess potential ROI of AI initiatives'
      ]
    },
    resources: {
      fr: [
        'Template de stratégie IA',
        'Guide d\'évaluation ROI',
        'Checklist de gouvernance IA'
      ],
      en: [
        'AI strategy template',
        'ROI assessment guide',
        'AI governance checklist'
      ]
    }
  },

  business_process_optimization: {
    id: 'business_process_optimization',
    category: 'business',
    priority: 'medium',
    effort: 'low',
    timeline: 'short',
    title: {
      fr: 'Optimiser les processus d\'affaires',
      en: 'Optimize business processes'
    },
    description: {
      fr: 'Identifier et automatiser les processus répétitifs pour maximiser l\'efficacité avant l\'implémentation IA.',
      en: 'Identify and automate repetitive processes to maximize efficiency before AI implementation.'
    },
    actions: {
      fr: [
        'Mapper les processus actuels',
        'Identifier les goulots d\'étranglement',
        'Prioriser les opportunités d\'automatisation',
        'Standardiser les workflows'
      ],
      en: [
        'Map current processes',
        'Identify bottlenecks',
        'Prioritize automation opportunities',
        'Standardize workflows'
      ]
    }
  },

  // Technical Infrastructure Recommendations
  technical_infrastructure_modernization: {
    id: 'technical_infrastructure_modernization',
    category: 'technical',
    priority: 'high',
    effort: 'high',
    timeline: 'medium',
    title: {
      fr: 'Moderniser l\'infrastructure technique',
      en: 'Modernize technical infrastructure'
    },
    description: {
      fr: 'Mettre à niveau votre infrastructure pour supporter les charges de travail IA et l\'analyse de données.',
      en: 'Upgrade your infrastructure to support AI workloads and data analytics.'
    },
    actions: {
      fr: [
        'Migrer vers une architecture cloud hybride',
        'Implémenter des solutions de calcul haute performance',
        'Configurer des pipelines CI/CD pour les modèles IA',
        'Établir des environnements de développement et production'
      ],
      en: [
        'Migrate to hybrid cloud architecture',
        'Implement high-performance computing solutions',
        'Set up CI/CD pipelines for AI models',
        'Establish development and production environments'
      ]
    }
  },

  technical_api_integration: {
    id: 'technical_api_integration',
    category: 'technical',
    priority: 'medium',
    effort: 'low',
    timeline: 'immediate',
    title: {
      fr: 'Intégrer des APIs IA existantes',
      en: 'Integrate existing AI APIs'
    },
    description: {
      fr: 'Commencer avec des solutions IA prêtes à l\'emploi pour valider les cas d\'usage et acquérir de l\'expérience.',
      en: 'Start with ready-to-use AI solutions to validate use cases and gain experience.'
    },
    actions: {
      fr: [
        'Identifier les APIs IA pertinentes (OpenAI, Google Cloud AI, etc.)',
        'Développer des preuves de concept',
        'Intégrer dans les systèmes existants',
        'Mesurer les performances et l\'impact'
      ],
      en: [
        'Identify relevant AI APIs (OpenAI, Google Cloud AI, etc.)',
        'Develop proof of concepts',
        'Integrate with existing systems',
        'Measure performance and impact'
      ]
    }
  },

  // Data Management Recommendations
  data_governance_framework: {
    id: 'data_governance_framework',
    category: 'data',
    priority: 'high',
    effort: 'medium',
    timeline: 'short',
    title: {
      fr: 'Établir un cadre de gouvernance des données',
      en: 'Establish data governance framework'
    },
    description: {
      fr: 'Créer des politiques et procédures pour assurer la qualité, sécurité et conformité des données.',
      en: 'Create policies and procedures to ensure data quality, security, and compliance.'
    },
    actions: {
      fr: [
        'Définir des standards de qualité des données',
        'Implémenter des contrôles d\'accès aux données',
        'Créer un catalogue de données',
        'Établir des procédures de sauvegarde et récupération'
      ],
      en: [
        'Define data quality standards',
        'Implement data access controls',
        'Create a data catalog',
        'Establish backup and recovery procedures'
      ]
    }
  },

  data_pipeline_automation: {
    id: 'data_pipeline_automation',
    category: 'data',
    priority: 'medium',
    effort: 'high',
    timeline: 'medium',
    title: {
      fr: 'Automatiser les pipelines de données',
      en: 'Automate data pipelines'
    },
    description: {
      fr: 'Construire des pipelines automatisés pour l\'ingestion, transformation et préparation des données.',
      en: 'Build automated pipelines for data ingestion, transformation, and preparation.'
    },
    actions: {
      fr: [
        'Concevoir l\'architecture de données',
        'Implémenter des outils ETL/ELT',
        'Configurer la surveillance et alertes',
        'Optimiser les performances'
      ],
      en: [
        'Design data architecture',
        'Implement ETL/ELT tools',
        'Set up monitoring and alerts',
        'Optimize performance'
      ]
    }
  },

  // Culture & Team Recommendations
  culture_change_management: {
    id: 'culture_change_management',
    category: 'culture',
    priority: 'high',
    effort: 'medium',
    timeline: 'immediate',
    title: {
      fr: 'Gérer le changement organisationnel',
      en: 'Manage organizational change'
    },
    description: {
      fr: 'Préparer votre équipe et votre culture d\'entreprise pour l\'adoption réussie de l\'IA.',
      en: 'Prepare your team and company culture for successful AI adoption.'
    },
    actions: {
      fr: [
        'Communiquer la vision IA à tous les niveaux',
        'Identifier et former les champions IA',
        'Gérer les résistances au changement',
        'Célébrer les premiers succès'
      ],
      en: [
        'Communicate AI vision at all levels',
        'Identify and train AI champions',
        'Manage change resistance',
        'Celebrate early wins'
      ]
    }
  },

  culture_skills_development: {
    id: 'culture_skills_development',
    category: 'culture',
    priority: 'medium',
    effort: 'medium',
    timeline: 'short',
    title: {
      fr: 'Développer les compétences IA',
      en: 'Develop AI skills'
    },
    description: {
      fr: 'Investir dans la formation et le développement des compétences IA de votre équipe.',
      en: 'Invest in training and developing your team\'s AI skills.'
    },
    actions: {
      fr: [
        'Évaluer les compétences actuelles',
        'Créer un plan de formation IA',
        'Organiser des ateliers pratiques',
        'Encourager la certification professionnelle'
      ],
      en: [
        'Assess current skills',
        'Create an AI training plan',
        'Organize hands-on workshops',
        'Encourage professional certification'
      ]
    }
  }
};

// Scoring thresholds for different readiness levels (for future use)
// const READINESS_THRESHOLDS = {
//   beginner: { min: 0, max: 25 },
//   intermediate: { min: 25, max: 50 },
//   advanced: { min: 50, max: 75 },
//   expert: { min: 75, max: 100 }
// };

// Category-specific recommendation mappings
const CATEGORY_RECOMMENDATIONS: Record<string, string[]> = {
  business: [
    'business_strategy_foundation',
    'business_process_optimization'
  ],
  technical: [
    'technical_infrastructure_modernization',
    'technical_api_integration'
  ],
  data: [
    'data_governance_framework',
    'data_pipeline_automation'
  ],
  culture: [
    'culture_change_management',
    'culture_skills_development'
  ]
};

/**
 * Generate personalized recommendations based on assessment results
 */
export function generateRecommendations(result: AssessmentResult): RecommendationPlan {
  const recommendations: Recommendation[] = [];
  
  // Add recommendations based on weak categories (score < 50)
  Object.entries(result.categoryScores).forEach(([category, score]) => {
    if (typeof score === 'number' && score < 50) {
      const categoryRecs = CATEGORY_RECOMMENDATIONS[category] || [];
      categoryRecs.forEach(recId => {
        const rec = RECOMMENDATIONS[recId];
        if (rec && !recommendations.find(r => r.id === rec.id)) {
          recommendations.push(rec);
        }
      });
    }
  });

  // Add level-appropriate recommendations
  if (result.readinessLevel === 'beginner') {
    // Focus on foundations
    const foundationalRecs = [
      'business_strategy_foundation',
      'technical_api_integration',
      'culture_change_management'
    ];
    foundationalRecs.forEach(recId => {
      const rec = RECOMMENDATIONS[recId];
      if (rec && !recommendations.find(r => r.id === rec.id)) {
        recommendations.push(rec);
      }
    });
  }

  // Sort recommendations by priority and effort
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const effortOrder = { low: 3, medium: 2, high: 1 };
    
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return effortOrder[b.effort] - effortOrder[a.effort];
  });

  // Organize by timeline
  const nextSteps = {
    immediate: recommendations.filter(r => r.timeline === 'immediate'),
    shortTerm: recommendations.filter(r => r.timeline === 'short'),
    longTerm: recommendations.filter(r => r.timeline === 'medium' || r.timeline === 'long')
  };

  // Estimate timeline based on readiness level
  const timelineEstimates = {
    beginner: {
      fr: '12-18 mois pour atteindre le niveau intermédiaire',
      en: '12-18 months to reach intermediate level'
    },
    intermediate: {
      fr: '6-12 mois pour atteindre le niveau avancé',
      en: '6-12 months to reach advanced level'
    },
    advanced: {
      fr: '3-6 mois pour atteindre le niveau expert',
      en: '3-6 months to reach expert level'
    },
    expert: {
      fr: 'Prêt pour l\'implémentation IA avancée',
      en: 'Ready for advanced AI implementation'
    }
  };

  return {
    readinessLevel: result.readinessLevel,
    overallScore: result.overallScore,
    recommendations: recommendations.slice(0, 6), // Limit to top 6 recommendations
    nextSteps,
    estimatedTimeline: timelineEstimates[result.readinessLevel]
  };
}

/**
 * Get recommendations for a specific category
 */
export function getCategoryRecommendations(category: string, _locale: SupportedLocale): Recommendation[] {
  const recIds = CATEGORY_RECOMMENDATIONS[category] || [];
  return recIds.map(id => RECOMMENDATIONS[id]).filter((rec): rec is Recommendation => Boolean(rec));
}

/**
 * Get all available recommendations
 */
export function getAllRecommendations(): Recommendation[] {
  return Object.values(RECOMMENDATIONS);
}

/**
 * Filter recommendations by criteria
 */
export function filterRecommendations(
  recommendations: Recommendation[],
  filters: {
    priority?: 'high' | 'medium' | 'low';
    effort?: 'low' | 'medium' | 'high';
    timeline?: 'immediate' | 'short' | 'medium' | 'long';
    category?: 'business' | 'technical' | 'data' | 'culture';
  }
): Recommendation[] {
  return recommendations.filter(rec => {
    if (filters.priority && rec.priority !== filters.priority) return false;
    if (filters.effort && rec.effort !== filters.effort) return false;
    if (filters.timeline && rec.timeline !== filters.timeline) return false;
    if (filters.category && rec.category !== filters.category) return false;
    return true;
  });
}