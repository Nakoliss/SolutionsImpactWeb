'use client';

import { memo, useEffect, useId } from 'react';
import { X } from 'lucide-react';

import type { ServiceCategory } from '@/lib/serviceLoader';

import { ServiceTierCard } from './ServiceTier';
import { scrollToContact } from '@/lib/scrollToContact';

interface ServiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: ServiceCategory | null;
    messages: {
        detailsSoon: string;
        tiersAria: string;
        priceAria: string;
        setupCostAria: string;
        closeButton: string;
    };
}

function ServiceDetailModalComponent({
    isOpen,
    onClose,
    service,
    messages,
}: ServiceDetailModalProps) {
    const headingId = useId();
    const descriptionId = `${headingId}-description`;

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !service) {
        return null;
    }

    const hasDetailedTiers = service.tiers.some(tier =>
        Boolean(tier.price || tier.setupCost || (tier.bullets?.length ?? 0) > 0)
    );
    const hasNamedTiers = service.tiers.some(tier => Boolean(tier.name));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-describedby={service.description ? descriptionId : undefined}
        >
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    aria-label={messages.closeButton}
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="pr-12">
                    {service.launchSpecial ? (
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.25)] animate-pulse">
                            {service.launchSpecial.tag}
                        </span>
                    ) : null}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 id={headingId} className="text-3xl font-semibold text-white">
                                {service.title}
                            </h2>
                            {service.description ? (
                                <p id={descriptionId} className="mt-3 text-base text-slate-300">
                                    {service.description}
                                </p>
                            ) : null}
                            {service.launchSpecial?.message ? (
                                <p className="mt-3 text-sm text-sky-200/80">
                                    {service.launchSpecial.message}
                                </p>
                            ) : null}
                        </div>
                        {service.launchSpecial ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.25)] animate-pulse">
                                {service.launchSpecial.originalHeadline ? (
                                    <span className="text-slate-300/70 line-through">
                                        {service.launchSpecial.originalHeadline}
                                    </span>
                                ) : null}
                                <span>{service.launchSpecial.specialHeadline}</span>
                            </span>
                        ) : service.headlinePrice ? (
                            <span className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-sky-200">
                                {service.headlinePrice}
                            </span>
                        ) : null}
                    </div>

                    {hasDetailedTiers ? (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-white mb-6">
                                {messages.tiersAria}
                            </h3>
                            <ul className="space-y-6" aria-label={messages.tiersAria}>
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
                        </div>
                    ) : hasNamedTiers ? (
                        <div className="mt-8">
                            <ul className="space-y-3" aria-label={messages.tiersAria}>
                                {service.tiers.map((tier, index) => (
                                    <li key={`${service.id}-${tier.name}-${index}`}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                // Give the close animation a moment, then scroll
                                                setTimeout(() => scrollToContact(), 50);
                                            }}
                                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-left font-semibold text-slate-100 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                        >
                                            {tier.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => scrollToContact(), 50);
                                    }}
                                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                                >
                                    Nous contacter
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mt-8 text-sm text-slate-400" role="note">
                            {messages.detailsSoon}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export const ServiceDetailModal = memo(ServiceDetailModalComponent);
