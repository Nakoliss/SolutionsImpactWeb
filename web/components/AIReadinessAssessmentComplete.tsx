'use client';

import { useState } from 'react';

import AIReadinessAssessment, { type AssessmentResult } from '@/components/AIReadinessAssessment';
import AssessmentResults from '@/components/AssessmentResults';
import type { SupportedLocale } from '@/content';

interface AIReadinessAssessmentCompleteProps {
  locale: SupportedLocale;
  onRequestConsultation?: (result: AssessmentResult) => void;
}

export default function AIReadinessAssessmentComplete({ 
  locale, 
  onRequestConsultation 
}: AIReadinessAssessmentCompleteProps) {
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    // Optionally reset the assessment to allow retaking
    // setAssessmentResult(null);
  };

  const handleRequestConsultation = () => {
    if (assessmentResult && onRequestConsultation) {
      onRequestConsultation(assessmentResult);
    }
    setShowResults(false);
  };

  return (
    <>
      {!assessmentResult ? (
        <AIReadinessAssessment 
          locale={locale}
          onComplete={handleAssessmentComplete}
        />
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {locale === 'fr' ? 'Évaluation terminée!' : 'Assessment Complete!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'fr' 
              ? 'Cliquez sur le bouton ci-dessous pour voir vos résultats détaillés et recommandations personnalisées.'
              : 'Click the button below to view your detailed results and personalized recommendations.'
            }
          </p>
          <button
            onClick={() => setShowResults(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {locale === 'fr' ? 'Voir les résultats' : 'View Results'}
          </button>
        </div>
      )}

      {assessmentResult && (
        <AssessmentResults
          locale={locale}
          result={assessmentResult}
          isOpen={showResults}
          onClose={handleCloseResults}
          onRequestConsultation={handleRequestConsultation}
        />
      )}
    </>
  );
}