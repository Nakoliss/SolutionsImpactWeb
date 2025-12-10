'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { useDesignAwareLinks } from '@/lib/useDesignNavigation';
import { buildLocalePath, switchLocalePath } from '@/lib/localeRouting';
import type { SupportedLocale } from '@/content';

interface HeaderProps {
  locale: SupportedLocale;
}

const normalizePath = (path: string) => {
  if (!path) {
    return '/';
  }
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
};

export default function Header({ locale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Initialize with a consistent value for SSR, will be updated on mount
  const [activeHash, setActiveHash] = useState<string>('#services');
  const [isMounted, setIsMounted] = useState(false);

  const t = useTranslations('nav');
  const pathname = usePathname() ?? buildLocalePath(locale);
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.toString() ?? '';
  const currentPath = useMemo(() => {
    if (!pathname) {
      return buildLocalePath(locale);
    }
    return `${pathname}${searchQuery ? `?${searchQuery}` : ''}`;
  }, [pathname, searchQuery, locale]);
  const homePath = useMemo(() => buildLocalePath(locale), [locale]);
  const languageTargets = useMemo<Record<SupportedLocale, string>>(
    () => ({
      fr: switchLocalePath(currentPath, 'fr'),
      en: switchLocalePath(currentPath, 'en'),
    }),
    [currentPath]
  );
  const languageLabel =
    locale === 'fr' ? 'Selection de la langue' : 'Language selection';

  const renderLanguageSwitcher = (variant: 'desktop' | 'mobile') => (
    <nav
      aria-label={languageLabel}
      className={`flex items-center gap-2 ${variant === 'mobile' ? 'w-full justify-start' : ''}`}
    >
      {(['fr', 'en'] as const).map((lang) => {
        const href = languageTargets[lang];
        const isActiveLang = lang === locale;
        return (
          <Link
            key={lang}
            href={href}
            lang={lang}
            aria-current={isActiveLang ? 'true' : undefined}
            className={`inline-flex min-w-[44px] justify-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              isActiveLang
                ? 'bg-white text-slate-900 shadow-lg'
                : 'border border-white/30 text-slate-200 hover:text-white hover:border-white'
            }`}
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );

  // Design context integration
  const { getLinkWithDesign } = useDesignAwareLinks();

  const navigationItems = [
    { key: 'services', href: `${homePath}#services` },
    { key: 'packages', href: `${homePath}#home-packages` },
    { key: 'guides', href: buildLocalePath(locale, '/content/guides') },
    { key: 'faq', href: buildLocalePath(locale, '/faq') },
    { key: 'loi25', href: buildLocalePath(locale, '/compliance') },
    { key: 'whyUs', href: `${homePath}#why` },
    { key: 'process', href: `${homePath}#process` },
    { key: 'contact', href: `${homePath}#contact` },
  ];

  // Get design-aware navigation items
  const getDesignAwareHref = (href: string): string => {
    // For anchor links (like #assessment, #contact), don't add design parameter
    // as they should stay on the home page
    if (href.includes('#')) {
      return href;
    }
    return getLinkWithDesign(href);
  };

  const smoothScrollTo = (element: HTMLElement, speed: number = 2200) => {
    const start = window.pageYOffset;
    const target =
      element.getBoundingClientRect().top + window.pageYOffset - 80; // 80px offset for header
    const distance = Math.abs(target - start); // Absolute distance in pixels
    const duration = (distance / speed) * 1000; // Duration in milliseconds based on distance and speed
    let startTime: number | null = null;

    // Linear easing function - constant speed throughout (no acceleration/deceleration)
    const linearEase = (t: number): number => {
      return t; // Linear progression - constant speed
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = linearEase(progress);

      // This formula works identically for both scroll up and scroll down
      // When distance is negative (scroll up), we subtract; when positive (scroll down), we add
      window.scrollTo(0, start + (target - start) * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    setIsMounted(true);
    const updateActiveHash = () => {
      if (typeof window === 'undefined') {
        return;
      }
      const nextHash =
        window.location.hash && window.location.hash !== ''
          ? window.location.hash
          : '#services';
      setActiveHash(nextHash);
    };

    updateActiveHash();
    window.addEventListener('hashchange', updateActiveHash);

    return () => {
      window.removeEventListener('hashchange', updateActiveHash);
    };
  }, [locale]);

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    if (href.includes('#')) {
      e?.preventDefault();
      const section = href.split('#')[1];
      const normalizedHomePath = normalizePath(homePath);
      const normalizedCurrentPath = normalizePath(pathname ?? '/');

      // If we're not on the home page, navigate there first
      if (normalizedCurrentPath !== normalizedHomePath) {
        window.location.href = href;
      } else if (section) {
        // We're on the home page, scroll to the section
        const element = document.getElementById(section);
        if (element) {
          smoothScrollTo(element, 2200); // 2200 pixels per second - constant scroll speed
          const newHash = `#${section}`;
          window.history.replaceState(null, '', href);
          setActiveHash(newHash);
        }
      }
    }
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => {
    // During SSR, always return false to ensure consistent hydration
    if (!isMounted) {
      return false;
    }
    const normalizedCurrentPath = normalizePath(pathname ?? homePath);
    if (href.includes('#')) {
      const [basePath, hashFragment] = href.split('#');
      const normalizedBasePath = normalizePath(basePath || homePath);

      if (normalizedCurrentPath !== normalizedBasePath) {
        return false;
      }

      const expectedHash = hashFragment ? `#${hashFragment}` : '#services';
      return activeHash === expectedHash;
    }
    return normalizedCurrentPath === normalizePath(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950 shadow-sm border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href={getLinkWithDesign(homePath)}
              className="text-2xl font-bold text-white hover:text-purple-300 transition-colors"
              onClick={(e) => {
                const normalizedHomePath = normalizePath(homePath);
                const normalizedCurrentPath = normalizePath(
                  pathname ?? homePath
                );
                if (normalizedCurrentPath === normalizedHomePath) {
                  e.preventDefault();
                  // Scroll to top with constant scroll speed
                  const scrollToTop = () => {
                    const start = window.pageYOffset;
                    const target = 0;
                    const distance = Math.abs(target - start);
                    const speed = 2200; // pixels per second
                    const duration = (distance / speed) * 1000; // Duration based on distance
                    let startTime: number | null = null;

                    const linearEase = (t: number): number => t;

                    const animation = (currentTime: number) => {
                      if (startTime === null) startTime = currentTime;
                      const timeElapsed = currentTime - startTime;
                      const progress = Math.min(timeElapsed / duration, 1);
                      const ease = linearEase(progress);

                      window.scrollTo(0, start + (target - start) * ease);

                      if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                      }
                    };

                    requestAnimationFrame(animation);
                  };
                  scrollToTop();
                }
              }}
            >
              Solutions Impact Web
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navigationItems.map((item) => {
                const designAwareHref = getDesignAwareHref(item.href);
                const isActiveItem = isActive(item.href);

                return (
                  <Link
                    key={item.key}
                    href={designAwareHref}
                    onClick={(e) => handleNavClick(designAwareHref, e)}
                    className="inline-block"
                    aria-current={isActiveItem ? 'page' : undefined}
                  >
                    <span
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 hover:translate-y-[-4px] hover:scale-105 hover:text-white hover:from-purple-500 hover:to-sky-500 hover:shadow-[0_12px_36px_rgba(56,189,248,0.35)] ${
                        isActiveItem
                          ? 'text-purple-200 bg-gradient-to-r from-purple-500/40 to-sky-500/40 shadow-[0_8px_24px_rgba(99,102,241,0.25)]'
                          : 'text-slate-200 bg-gradient-to-r from-purple-700/70 via-indigo-900/70 to-sky-900/70'
                      }`}
                    >
                      {t(item.key)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center ml-8 gap-4">
            {renderLanguageSwitcher('desktop')}
            <Link
              href={buildLocalePath(locale, '/contact')}
              onClick={() => trackMetaLead('header_cta')}
              className="bg-gradient-to-r from-purple-500 to-sky-500 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:from-purple-600 hover:to-sky-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {t('book')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-purple-200 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-sky-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-950 border-t border-white/10">
              {navigationItems.map((item) => {
                const designAwareHref = getDesignAwareHref(item.href);
                const isActiveItem = isActive(item.href);

                return (
                  <Link
                    key={item.key}
                    href={designAwareHref}
                    onClick={(e) => handleNavClick(designAwareHref, e)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform hover:translate-y-[-4px] hover:scale-105 hover:text-white hover:from-purple-500 hover:to-sky-500 hover:shadow-[0_12px_36px_rgba(56,189,248,0.35)] ${
                      isActiveItem
                        ? 'bg-gradient-to-r from-purple-500/40 to-sky-500/40 text-purple-200 shadow-[0_8px_24px_rgba(99,102,241,0.25)]'
                        : 'text-slate-200 bg-gradient-to-r from-purple-700/70 via-indigo-900/70 to-sky-900/70'
                    }`}
                    aria-current={isActiveItem ? 'page' : undefined}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}

              <div className="px-3 pt-4 pb-2 border-t border-white/10">
                {renderLanguageSwitcher('mobile')}
              </div>
              {/* Mobile CTA */}
              <div className="px-3 py-2">
                <Link
                  href={buildLocalePath(locale, '/contact')}
                  onClick={() => {
                    setIsMenuOpen(false);
                    trackMetaLead('header_mobile_cta');
                  }}
                  className="block w-full rounded-md bg-gradient-to-r from-purple-500 to-sky-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:from-purple-600 hover:to-sky-600"
                >
                  {t('book')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
