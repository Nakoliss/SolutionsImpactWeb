'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { SupportedLocale } from '@/content';
import { useAnalytics } from '@/lib/analytics';

// Assessment question types
export interface AssessmentQuestion {
  id: string;
  type: 'single' | 'multiple' | 'scale';
  category: 'business' | 'technical' | 'data' | 'culture';
  weight: number;
  options?: AssessmentOption[];
  min?: number;
  max?: number;
}

export interface AssessmentOption {
  id: string;
  value: number;
  label: {
    fr: string;
    en: string;
  };
}

export interface AssessmentAnswer {
  questionId: string;
  value: number | number[];
}

export interface AssessmentResult {
  overallScore: number;
  categoryScores: {
    business: number;
    technical: number;
    data: number;
    culture: number;
  };
  recommendations: string[];
  readinessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface AIReadinessAssessmentProps {
  locale: SupportedLocale;
  onComplete: (result: AssessmentResult) => void;
}

// Assessment questions configuration
const ASSESSMENT_QUESTIONS: Record<string, AssessmentQuestion> = {
  business_strategy: {
    id: 'business_strategy',
    type: 'single',
    category: 'business',
    weight: 1.5,
    options: [
      {
        id: 'no_strategy',
        value: 1,
        label: {
          fr: 'Aucune stratégie IA définie',
          en: 'No AI strategy defined'
        }
      },
      {
        id: 'exploring',
        value: 2,
        label: {
          fr: 'Exploration des possibilités IA',
          en: 'Exploring AI possibilities'
        }
      },
      {
        id: 'basic_plan',
        value: 3,
        label: {
          fr: 'Plan de base pour adopter l\'IA',
          en: 'Basic plan to adopt AI'
        }
      },
      {
        id: 'comprehensive_strategy',
        value: 4,
        label: {
          fr: 'Stratégie IA complète et documentée',
          en: 'Comprehensive documented AI strategy'
        }
      }
    ]
  },
  technical_infrastructure: {
    id: 'technical_infrastructure',
    type: 'single',
    category: 'technical',
    weight: 1.3,
    options: [
      {
        id: 'basic_tech',
        value: 1,
        label: {
          fr: 'Infrastructure technique de base',
          en: 'Basic technical infrastructure'
        }
      },
      {
        id: 'cloud_ready',
        value: 2,
        label: {
          fr: 'Infrastructure cloud moderne',
          en: 'Modern cloud infrastructure'
        }
      },
      {
        id: 'data_ready',
        value: 3,
        label: {
          fr: 'Systèmes orientés données',
          en: 'Data-oriented systems'
        }
      },
      {
        id: 'ai_ready',
        value: 4,
        label: {
          fr: 'Infrastructure prête pour l\'IA',
          en: 'AI-ready infrastructure'
        }
      }
    ]
  },
  data_maturity: {
    id: 'data_maturity',
    type: 'scale',
    category: 'data',
    weight: 1.4,
    min: 1,
    max: 5
  },
  team_readiness: {
    id: 'team_readiness',
    type: 'multiple',
    category: 'culture',
    weight: 1.2,
    options: [
      {
        id: 'leadership_support',
        value: 1,
        label: {
          fr: 'Support de la direction',
          en: 'Leadership support'
        }
      },
      {
        id: 'technical_skills',
        value: 1,
        label: {
          fr: 'Compétences techniques',
          en: 'Technical skills'
        }
      },
      {
        id: 'change_management',
        value: 1,
        label: {
          fr: 'Gestion du changement',
          en: 'Change management'
        }
      },
      {
        id: 'budget_allocated',
        value: 1,
        label: {
          fr: 'Budget alloué',
          en: 'Budget allocated'
        }
      }
    ]
  }
};

const QUESTION_CONTENT = {
  business_strategy: {
    title: {
      fr: 'Quelle est votre stratégie IA actuelle?',
      en: 'What is your current AI strategy?'
    },
    description: {
      fr: 'Décrivez le niveau de planification stratégique de votre organisation pour l\'adoption de l\'IA.',
      en: 'Describe your organization\'s level of strategic planning for AI adoption.'
    }
  },
  technical_infrastructure: {
    title: {
      fr: 'Comment décririez-vous votre infrastructure technique?',
      en: 'How would you describe your technical infrastructure?'
    },
    description: {
      fr: 'Évaluez la capacité de votre infrastructure technique actuelle à supporter des solutions IA.',
      en: 'Assess your current technical infrastructure\'s ability to support AI solutions.'
    }
  },
  data_maturity: {
    title: {
      fr: 'Niveau de maturité des données (1-5)',
      en: 'Data maturity level (1-5)'
    },
    description: {
      fr: 'Évaluez la qualité, l\'accessibilité et la gouvernance de vos données.',
      en: 'Rate the quality, accessibility, and governance of your data.'
    }
  },
  team_readiness: {
    title: {
      fr: 'Quels facteurs de préparation d\'équipe avez-vous?',
      en: 'Which team readiness factors do you have?'
    },
    description: {
      fr: 'Sélectionnez tous les éléments qui s\'appliquent à votre organisation.',
      en: 'Select all that apply to your organization.'
    }
  }
};

export default function AIReadinessAssessment({ locale, onComplete }: AIReadinessAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswer>>({});
  const [startTime] = useState(Date.now());
  const analytics = useAnalytics();
  
  // Track assessment start
  useEffect(() => {
    analytics.trackAssessmentStarted(locale);
  }, [analytics, locale]);
  
  const questions = Object.keys(ASSESSMENT_QUESTIONS);
  const currentQuestionId = questions[currentStep];
  
  if (!currentQuestionId) {
    return <div>Assessment error: Invalid step</div>;
  }
  
  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionId];
  const currentContent = QUESTION_CONTENT[currentQuestionId as keyof typeof QUESTION_CONTENT];
  
  if (!currentQuestion || !currentContent) {
    return <div>Assessment error: Invalid question</div>;
  }
  
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestionId] !== undefined;

  const handleAnswer = (questionId: string, value: number | number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, value }
    }));
  };

  const handleNext = () => {
    // Track step completion
    if (currentQuestionId) {
      analytics.trackAssessmentStepCompleted(currentStep, currentQuestionId, locale);
    }
    
    if (isLastStep) {
      // Calculate results and complete assessment
      const result = calculateAssessmentResult(answers);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      // Track assessment completion
      analytics.trackAssessmentCompleted(result, locale, timeSpent);
      
      onComplete(result);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderQuestion = () => {
    const question = currentQuestion;
    const currentAnswer = answers[currentQuestionId];

    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-4">
            {question.options?.map((option: AssessmentOption) => (
              <label
                key={option.id}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={currentAnswer?.value === option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                  className="mr-3"
                />
                <span>{option.label[locale]}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple':
        return (
          <div className="space-y-4">
            {question.options?.map((option: AssessmentOption) => (
              <label
                key={option.id}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(currentAnswer?.value) && currentAnswer.value.includes(option.value)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(currentAnswer?.value) ? currentAnswer.value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: number) => v !== option.value);
                    handleAnswer(question.id, newValues);
                  }}
                  className="mr-3"
                />
                <span>{option.label[locale]}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {locale === 'fr' ? 'Faible' : 'Low'} ({question.min})
              </span>
              <span className="text-sm text-gray-500">
                {locale === 'fr' ? 'Élevé' : 'High'} ({question.max})
              </span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              value={typeof currentAnswer?.value === 'number' ? currentAnswer.value : question.min}
              onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center">
              <span className="text-lg font-semibold">
                {currentAnswer?.value || question.min} / {question.max}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {locale === 'fr' ? 'Progression' : 'Progress'}
          </span>
          <span className="text-sm text-gray-500">
            {currentStep + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          {currentContent?.title[locale]}
        </h2>
        <p className="text-gray-600 mb-6">
          {currentContent?.description[locale]}
        </p>
        {renderQuestion()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {locale === 'fr' ? 'Précédent' : 'Previous'}
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLastStep ? (
            locale === 'fr' ? 'Terminer' : 'Complete'
          ) : (
            <>
              {locale === 'fr' ? 'Suivant' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Calculate assessment results
function calculateAssessmentResult(answers: Record<string, AssessmentAnswer>): AssessmentResult {
  const categoryScores = { business: 0, technical: 0, data: 0, culture: 0 };
  const categoryWeights = { business: 0, technical: 0, data: 0, culture: 0 };
  
  // Calculate category scores
  Object.values(answers).forEach(answer => {
    const question = ASSESSMENT_QUESTIONS[answer.questionId];
    if (!question) return;
    
    let score = 0;
    if (Array.isArray(answer.value)) {
      score = answer.value.reduce((sum, val) => sum + val, 0);
    } else {
      score = answer.value;
    }
    
    // Normalize to 0-1 scale based on question type
    let normalizedScore = 0;
    if (question.type === 'scale') {
      normalizedScore = (score - (question.min || 1)) / ((question.max || 5) - (question.min || 1));
    } else if (question.type === 'single') {
      const maxValue = Math.max(...(question.options?.map(o => o.value) || [1]));
      normalizedScore = (score - 1) / (maxValue - 1);
    } else if (question.type === 'multiple') {
      const maxValue = question.options?.length || 1;
      normalizedScore = score / maxValue;
    }
    
    categoryScores[question.category] += normalizedScore * question.weight;
    categoryWeights[question.category] += question.weight;
  });
  
  // Normalize category scores
  Object.keys(categoryScores).forEach(category => {
    const key = category as keyof typeof categoryScores;
    if (categoryWeights[key] > 0) {
      categoryScores[key] = categoryScores[key] / categoryWeights[key];
    }
  });
  
  // Calculate overall score
  const overallScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 4;
  
  // Determine readiness level
  let readinessLevel: AssessmentResult['readinessLevel'];
  if (overallScore < 0.25) {
    readinessLevel = 'beginner';
  } else if (overallScore < 0.5) {
    readinessLevel = 'intermediate';
  } else if (overallScore < 0.75) {
    readinessLevel = 'advanced';
  } else {
    readinessLevel = 'expert';
  }
  
  // Generate recommendations based on lowest scoring categories
  const recommendations: string[] = [];
  const sortedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2);
  
  sortedCategories.forEach(([category, score]) => {
    if (score < 0.5) {
      recommendations.push(category);
    }
  });
  
  return {
    overallScore: Math.round(overallScore * 100),
    categoryScores: {
      business: Math.round(categoryScores.business * 100),
      technical: Math.round(categoryScores.technical * 100),
      data: Math.round(categoryScores.data * 100),
      culture: Math.round(categoryScores.culture * 100)
    },
    recommendations,
    readinessLevel
  };
}