'use client';

import { useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  Flower2,
  Gem,
  Home,
  PawPrint,
  Scale,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react';
import type { KeyboardEvent } from 'react';

import type { SupportedLocale } from '@/content';
import {
  BUSINESS_TYPE_ORDER,
  BusinessType,
  getDesignConfig,
} from '@/lib/businessDesigns';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

interface DesignSelectorMessages {
  title: string;
  subtitle: string;
  previous: string;
  next: string;
  slidePosition: string;
  selectLabel: string;
  selectedLabel: string;
}

interface DesignSelectorProps {
  currentDesign: BusinessType;
  onDesignChange: (type: BusinessType) => void;
  locale: SupportedLocale;
  messages: DesignSelectorMessages;
}

const ICONS: Record<BusinessType, LucideIcon> = {
  [BusinessType.AI_AGENCY]: CircuitBoard,
  [BusinessType.MEDICAL_CLINIC]: Stethoscope,
  [BusinessType.ANTIQUE_SHOP]: Gem,
  [BusinessType.AUTO_GARAGE]: Wrench,
  [BusinessType.RETAIL_STORE]: ShoppingBag,
  [BusinessType.RESTAURANT]: UtensilsCrossed,
  [BusinessType.LAW_FIRM]: Scale,
  [BusinessType.BEAUTY_SALON]: Flower2,
  [BusinessType.PET_GROOMING]: PawPrint,
  [BusinessType.HOME_SERVICES]: Home,
};

const MotionDiv = motion.div;

export function DesignSelector({ currentDesign, onDesignChange, locale, messages }: DesignSelectorProps) {
  const businessMessages = locale === 'fr' ? frMessages.business : enMessages.business;

  const designs = useMemo(
    () =>
      BUSINESS_TYPE_ORDER.map((type) => {
        const designConfig = getDesignConfig(type);
        const designMessages = businessMessages[designConfig.i18nKey as keyof typeof businessMessages] as any;
        return {
          type,
          copy: designMessages,
          theme: designConfig.theme,
        };
      }),
    [locale, businessMessages],
  );

  const currentIndex = useMemo(
    () => designs.findIndex((item) => item.type === currentDesign),
    [designs, currentDesign],
  );
  const sliderRef = useRef<HTMLDivElement>(null);

  const goToIndex = useCallback(
    (index: number) => {
      const next = (index + designs.length) % designs.length;
      const nextDesign = designs[next];
      if (nextDesign && nextDesign.type !== currentDesign) {
        onDesignChange(nextDesign.type);
      }
    },
    [designs, currentDesign, onDesignChange],
  );

  const handlePrevious = useCallback(() => {
    goToIndex((currentIndex - 1 + designs.length) % designs.length);
  }, [currentIndex, designs.length, goToIndex]);

  const handleNext = useCallback(() => {
    goToIndex((currentIndex + 1) % designs.length);
  }, [currentIndex, designs.length, goToIndex]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        goToIndex(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        goToIndex(designs.length - 1);
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        const focused = sliderRef.current?.querySelector<HTMLButtonElement>(
          '[data-design-focus="true"]',
        );
        focused?.click();
      }
    },
    [designs.length, goToIndex, handleNext, handlePrevious],
  );

  if (!designs.length || currentIndex === -1) {
    return null;
  }

  const current = designs[currentIndex];
  if (!current) return null;
  const Icon = ICONS[current.type];
  const positionLabel = messages.slidePosition
    .replace('{current}', String(currentIndex + 1))
    .replace('{total}', String(designs.length));
  const selectedLabel = messages.selectedLabel.replace('{name}', current.copy.name);

  return (
    <section className="space-y-6" aria-labelledby="design-selector-heading">
      <div className="flex flex-col gap-2 text-center">
        <h2 id="design-selector-heading" className="text-2xl font-semibold text-white sm:text-3xl">
          {messages.title}
        </h2>
        <p className="text-sm text-slate-300 sm:text-base">{messages.subtitle}</p>
        <span className="sr-only" aria-live="polite">
          {selectedLabel}
        </span>
      </div>
      <div
        ref={sliderRef}
        className="group relative flex w-full items-center gap-3"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={messages.title}
        onKeyDown={handleKeyDown}
      >
        <button
          type="button"
          onClick={handlePrevious}
          aria-label={messages.previous}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 sm:flex"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
          <AnimatePresence initial={false} mode="wait">
            <MotionDiv
              key={current.type}
              className="relative flex flex-col gap-6 p-6 sm:flex-row sm:p-10"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25 }}
              style={{
                background: current.theme.gradient,
                color: current.theme.text,
              }}
            >
              <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
              <div className="relative flex flex-1 flex-col gap-4">
                <div className="inline-flex items-center gap-3 self-start rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{current.copy.name}</span>
                </div>
                <h3 className="text-2xl font-semibold sm:text-3xl">
                  {current.copy.heroTitle}
                </h3>
                <p className="text-sm text-slate-100/90 sm:text-base">
                  {current.copy.tagline}
                </p>
                <span className="mt-auto inline-flex w-max items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {current.copy.heroBadge}
                </span>
              </div>
              <div
                className="relative flex h-56 flex-1 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-center text-sm text-white/90 shadow-inner sm:h-auto"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <div className="max-w-xs space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                    {positionLabel}
                  </p>
                  <p>{current.copy.ctaText}</p>
                </div>
              </div>
            </MotionDiv>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={handleNext}
          aria-label={messages.next}
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 sm:flex"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-col items-center gap-8">
        {/* Design Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 w-full max-w-6xl">
          {designs.map((design) => {
            const ItemIcon = ICONS[design.type];
            const isActive = design.type === currentDesign;
            const label = messages.selectLabel.replace('{name}', design.copy.name);
            return (
              <button
                key={design.type}
                type="button"
                onClick={() => onDesignChange(design.type)}
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 hover:scale-[1.02] ${isActive
                  ? 'border-white/60 bg-gradient-to-br from-white/20 to-white/10 text-white shadow-xl shadow-black/20 scale-[1.02]'
                  : 'border-white/10 bg-gradient-to-br from-white/5 to-white/2 text-slate-200 hover:border-white/30 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:shadow-lg hover:shadow-black/10'
                  }`}
                aria-label={label}
                aria-pressed={isActive}
                data-design-focus={isActive}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-design"
                    className="absolute inset-0 rounded-2xl border-2 border-white/40 bg-gradient-to-br from-white/20 to-white/5"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                
                {/* Icon container */}
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${isActive
                    ? 'border-white/40 bg-black/40 shadow-lg'
                    : 'border-white/20 bg-black/30 group-hover:border-white/30 group-hover:bg-black/40'
                    }`}
                  style={{ color: design.theme.accent }}
                  aria-hidden="true"
                >
                  <ItemIcon className={`h-6 w-6 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                </span>
                
                {/* Content */}
                <div className="relative space-y-1">
                  <span className={`block text-sm font-semibold leading-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                    {design.copy.name}
                  </span>
                  <span className={`block text-xs leading-tight transition-colors duration-300 line-clamp-2 ${isActive ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {design.copy.tagline}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Pagination dots - enhanced */}
        <div className="flex items-center justify-center gap-3" aria-hidden="true">
          {designs.map((design, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={design.type}
                type="button"
                onClick={() => goToIndex(index)}
                className={`h-3 w-3 rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 ${isActive 
                  ? 'border-white bg-white shadow-lg shadow-white/20 scale-110' 
                  : 'border-white/40 bg-white/20 hover:border-white/60 hover:bg-white/30'
                  }`}
                aria-label={`Go to ${design.copy.name} design`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DesignSelector;
