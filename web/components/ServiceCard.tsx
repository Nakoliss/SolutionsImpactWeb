import { memo, useId } from 'react';

import type { ServiceCategory } from '@/lib/serviceLoader';

import { ServiceTierCard } from './ServiceTier';

interface ServiceCardMessages {
  detailsSoon: string;
  tiersAria: string;
  priceAria: string;
  setupCostAria: string;
}

interface ServiceCardProps {
  service: ServiceCategory;
  messages: ServiceCardMessages;
}

function hasTierDetails(tier: ServiceCategory['tiers'][number]): boolean {
  return Boolean(
    tier.price || tier.setupCost || (tier.bullets?.length ?? 0) > 0
  );
}

function ServiceCardComponent({ service, messages }: ServiceCardProps) {
  const headingId = useId();
  const descriptionId = `${headingId}-description`;
  const hasDetailedTiers = service.tiers.some(hasTierDetails);
  const hasLaunch = Boolean(service.launchSpecial);

  return (
    <article
      className="flex flex-col rounded-3xl border border-white/10 bg-black/40 p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-black/50"
      aria-labelledby={headingId}
      aria-describedby={service.description ? descriptionId : undefined}
    >
      {hasLaunch ? (
        <span className="mb-3 inline-flex w-fit items-center gap-2 self-start rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.25)] animate-pulse">
          {service.launchSpecial?.tag}
        </span>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 id={headingId} className="text-2xl font-semibold text-white">
            {service.title}
          </h3>
          {service.description ? (
            <p id={descriptionId} className="mt-2 text-sm text-slate-300">
              {service.description}
            </p>
          ) : null}
          {hasLaunch && service.launchSpecial?.message ? (
            <p className="mt-2 text-xs text-sky-200/80">
              {service.launchSpecial.message}
            </p>
          ) : null}
        </div>
        {hasLaunch ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)] animate-pulse">
            {service.launchSpecial?.originalHeadline ? (
              <span className="text-slate-300/70 line-through">
                {service.launchSpecial.originalHeadline}
              </span>
            ) : null}
            <span>{service.launchSpecial?.specialHeadline}</span>
          </span>
        ) : service.headlinePrice ? (
          <span className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200">
            {service.headlinePrice}
          </span>
        ) : null}
      </div>

      {hasDetailedTiers ? (
        <ul className="mt-6 space-y-5" aria-label={messages.tiersAria}>
          {service.tiers.map((tier, index) => (
            <ServiceTierCard
              key={`${service.id}-${tier.name}-${index}`}
              tier={tier}
              serviceId={service.id}
              index={index}
              messages={{
                priceAria: messages.priceAria,
                setupCostAria: messages.setupCostAria,
              }}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-slate-400" role="note">
          {messages.detailsSoon}
        </p>
      )}
    </article>
  );
}

export const ServiceCard = memo(ServiceCardComponent);
