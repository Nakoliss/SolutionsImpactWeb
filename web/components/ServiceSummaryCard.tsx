import { memo, useId } from 'react';

import type { ServiceCategory } from '@/lib/serviceLoader';

import { PriceDisplay } from './PriceDisplay';

interface ServiceSummaryCardProps {
    service: ServiceCategory;
    onClick: () => void;
    clickForDetailsText?: string;
}

function ServiceSummaryCardComponent({ service, onClick, clickForDetailsText = 'Click for details' }: ServiceSummaryCardProps) {
    const headingId = useId();
    const descriptionId = `${headingId}-description`;
    const hasLaunch = Boolean(service.launchSpecial);

    return (
        <article
            className="group flex cursor-pointer flex-col rounded-3xl border border-white/10 bg-black/40 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-black/50 hover:shadow-lg"
            aria-labelledby={headingId}
            aria-describedby={service.shortDescription ? descriptionId : undefined}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {hasLaunch ? (
                <span className="mb-3 inline-flex w-fit items-center gap-2 self-start rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.25)] animate-pulse">
                    {service.launchSpecial?.tag}
                </span>
            ) : null}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                    <h3 id={headingId} className="text-2xl font-semibold text-white">
                        {service.title}
                    </h3>
                    {service.shortDescription ? (
                        <p id={descriptionId} className="mt-2 text-sm text-slate-300">
                            {service.shortDescription}
                        </p>
                    ) : null}
                </div>
                {hasLaunch ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)] animate-pulse">
                        {service.launchSpecial?.originalHeadline ? (
                            <PriceDisplay className="text-slate-300/70 line-through">
                                {service.launchSpecial?.originalHeadline}
                            </PriceDisplay>
                        ) : null}
                        <PriceDisplay>{service.launchSpecial?.specialHeadline ?? ''}</PriceDisplay>
                    </span>
                ) : service.headlinePrice ? (
                    <span className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200">
                        <PriceDisplay>{service.headlinePrice}</PriceDisplay>
                    </span>
                ) : null}
            </div>

            {hasLaunch && service.launchSpecial?.message ? (
                <p className="mt-3 text-xs text-sky-200/80">
                    {service.launchSpecial.message}
                </p>
            ) : null}

            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                    {clickForDetailsText}
                </span>
                <svg
                    className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </div>
        </article>
    );
}

export const ServiceSummaryCard = memo(ServiceSummaryCardComponent);
