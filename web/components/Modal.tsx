'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  TouchEvent as ReactTouchEvent,
} from 'react';
import { createPortal } from 'react-dom';

import type { BusinessDesignTheme } from '@/lib/businessDesigns';

const MotionDiv = motion.div;

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
  ).filter((node) => node.tabIndex !== -1 && !node.hidden);
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  theme: BusinessDesignTheme;
  title: string;
  subtitle?: string;
  closeLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  theme,
  title,
  subtitle,
  closeLabel = 'Close dialog',
}: ModalProps) {
  const [portalElement, setPortalElement] = useState<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pointerDownTarget = useRef<EventTarget | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const subtitleId = subtitle ? `${titleId}-subtitle` : undefined;

  useEffect(() => {
    let element = document.getElementById('modal-root') as HTMLDivElement | null;
    if (!element) {
      element = document.createElement('div');
      element.id = 'modal-root';
      document.body.appendChild(element);
    }
    setPortalElement(element);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousActiveElement.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = getFocusableElements(dialogRef.current);

        if (!focusable.length) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (active === first || active === dialogRef.current) {
            event.preventDefault();
            last?.focus();
          }
          return;
        }

        if (active === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const focusable = getFocusableElements(dialogRef.current);
    (focusable[0] ?? dialogRef.current)?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleOverlayMouseDown = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      pointerDownTarget.current = event.target;
    } else {
      pointerDownTarget.current = null;
    }
  }, []);

  const handleOverlayMouseUp = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (pointerDownTarget.current && event.target === event.currentTarget) {
        onClose();
      }
      pointerDownTarget.current = null;
    },
    [onClose],
  );

  const handleOverlayTouchStart = useCallback((event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      pointerDownTarget.current = event.target;
    }
  }, []);

  const handleOverlayTouchEnd = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      if (pointerDownTarget.current && event.target === event.currentTarget) {
        onClose();
      }
      pointerDownTarget.current = null;
    },
    [onClose],
  );

  if (!portalElement) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10 sm:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MotionDiv
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            aria-hidden="true"
            onMouseDown={handleOverlayMouseDown}
            onMouseUp={handleOverlayMouseUp}
            onTouchStart={handleOverlayTouchStart}
            onTouchEnd={handleOverlayTouchEnd}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <MotionDiv
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={subtitle ? subtitleId : undefined}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl focus:outline-none"
            tabIndex={-1}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              background: theme.gradient,
              color: theme.text,
            }}
          >
            <div
              className="absolute inset-0 opacity-80"
              aria-hidden="true"
              style={{
                background: theme.background,
                backdropFilter: 'blur(8px)',
              }}
            />
            <div className="relative z-10 flex flex-col gap-8 p-6 sm:p-10">
              <header className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 id={titleId} className="text-2xl font-semibold text-white sm:text-3xl">
                    {title}
                  </h3>
                  {subtitle ? (
                    <p id={subtitleId} className="max-w-3xl text-sm text-white/80 sm:text-base">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </header>
              <div
                className="relative flex flex-col gap-6 rounded-2xl border bg-black/40 p-6 sm:p-8"
                style={{
                  background: theme.surface,
                  borderColor: theme.border,
                  color: theme.text,
                }}
              >
                {children}
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>,
    portalElement,
  );
}

export default Modal;
