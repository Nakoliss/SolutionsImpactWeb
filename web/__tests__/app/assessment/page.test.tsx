import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import AssessmentPage from '@/app/[locale]/assessment/page';

vi.mock('@/components/AIReadinessAssessmentComplete', () => ({
  __esModule: true,
  default: () => <div>AIReadinessAssessmentComplete</div>,
}));

describe('AssessmentPage', () => {
  it('renders the english content when the locale is "en"', async () => {
    const props = {
      params: {
        locale: 'en' as const,
      },
    };

    render(await AssessmentPage(props));

    expect(screen.getByText('AI Readiness Assessment')).toBeInTheDocument();
  });

  it('renders the french content when the locale is "fr"', async () => {
    const props = {
      params: {
        locale: 'fr' as const,
      },
    };

    render(await AssessmentPage(props));

    expect(screen.getByText('Évaluation de maturité IA')).toBeInTheDocument();
  });
});