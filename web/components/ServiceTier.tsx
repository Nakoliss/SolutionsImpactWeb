import { memo } from 'react';
import { CheckCircle } from 'lucide-react';

import type { ServiceTier } from '@/lib/serviceLoader';

import { PriceDisplay } from './PriceDisplay';

interface ServiceTierMessages {
  priceAria: string;
  setupCostAria: string;
}

interface ServiceTierProps {
  tier: ServiceTier;
  serviceId: string;
  index: number;
  messages: ServiceTierMessages;
}

function ServiceTierComponent({
  tier,
  serviceId,
  index,
  messages,
}: ServiceTierProps) {
  const hasDetails = Boolean(
    tier.price || tier.setupCost || (tier.bullets?.length ?? 0) > 0
  );

  if (!hasDetails) {
    return null;
  }

  const titleId = `${serviceId}-tier-${index}-title`;

  return (
    <li
      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-shadow duration-200 hover:shadow-lg"
      aria-labelledby={titleId}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h4 id={titleId} className="text-base font-semibold text-white">
            {tier.name}
          </h4>
        </div>
        <div className="flex flex-col items-start text-sm text-slate-200">
          {tier.launchPrice?.original ? (
            <PriceDisplay className="text-xs text-slate-400/80 line-through">
              {tier.launchPrice.original}
            </PriceDisplay>
          ) : null}
          {tier.price ? (
            <PriceDisplay
              className="font-semibold text-white"
              aria-label={messages.priceAria}
            >
              {tier.price}
            </PriceDisplay>
          ) : null}
          {tier.setupCost ? (
            <PriceDisplay
              className="text-xs text-slate-400"
              aria-label={messages.setupCostAria}
            >
              {tier.setupCost}
            </PriceDisplay>
          ) : null}
        </div>
      </div>
      {tier.bullets?.length ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-200">
          {tier.bullets.map((bullet, bulletIdx) => (
            <li
              key={`${serviceId}-${index}-${bulletIdx}`}
              className="flex items-start gap-2"
            >
              <CheckCircle
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-400"
                aria-hidden="true"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export const ServiceTierCard = memo(ServiceTierComponent);
