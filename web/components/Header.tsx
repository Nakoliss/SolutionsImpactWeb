'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { scrollToContact } from '@/lib/scrollToContact';
import { useDesignAwareLinks } from '@/lib/useDesignNavigation';
import type { SupportedLocale } from '@/content';

interface HeaderProps {
    locale: SupportedLocale;
    currentPath: string;
}

export default function Header({ locale, currentPath }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const t = useTranslations('nav');

    // Design context integration
    const { getLinkWithDesign } = useDesignAwareLinks();

    const navigationItems = [
        { key: 'services', href: `/${locale}#services` },
        { key: 'packages', href: `/${locale}#home-packages` },
        { key: 'whyUs', href: `/${locale}#why` },
        { key: 'process', href: `/${locale}#process` },
        { key: 'contact', href: `/${locale}#contact` }
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

    const handleNavClick = (href: string, e?: React.MouseEvent) => {
        if (href.includes('#')) {
            e?.preventDefault();
            const section = href.split('#')[1];
            const homePage = `/${locale}`;

            // If we're not on the home page, navigate there first
            if (currentPath !== homePage) {
                window.location.href = href;
            } else if (section) {
                // We're on the home page, scroll to the section
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
        setIsMenuOpen(false);
    };

    const isActive = (href: string) => {
        if (href.includes('#')) {
            return currentPath === `/${locale}`;
        }
        return currentPath === href;
    };

    return (
        <header className="sticky top-0 z-50 bg-slate-950 shadow-sm border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href={getLinkWithDesign(`/${locale}`)}
                            className="text-2xl font-bold text-white hover:text-purple-300 transition-colors"
                        >
                            Solutions Impact Web
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            {navigationItems.map((item) => {
                                const designAwareHref = getDesignAwareHref(item.href);
                                return (
                                    <Link
                                        key={item.key}
                                        href={designAwareHref}
                                        onClick={(e) => handleNavClick(designAwareHref, e)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive(item.href)
                                            ? 'bg-gradient-to-r from-purple-500/20 to-sky-500/20 text-purple-300 shadow-sm'
                                            : 'text-slate-300 hover:text-purple-200 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-sky-500/10'
                                            }`}
                                        aria-current={isActive(item.href) ? 'page' : undefined}
                                    >
                                        {t(item.key)}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA Button Only - Language switcher removed */}
                    <div className="hidden md:flex items-center ml-8">
                        <button
                            onClick={scrollToContact}
                            className="bg-gradient-to-r from-purple-500 to-sky-500 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:from-purple-600 hover:to-sky-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            {t('book')}
                        </button>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                                return (
                                    <Link
                                        key={item.key}
                                        href={designAwareHref}
                                        onClick={(e) => handleNavClick(designAwareHref, e)}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.href)
                                            ? 'bg-gradient-to-r from-purple-500/20 to-sky-500/20 text-purple-300'
                                            : 'text-slate-300 hover:text-purple-200 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-sky-500/10'
                                            }`}
                                        aria-current={isActive(item.href) ? 'page' : undefined}
                                    >
                                        {t(item.key)}
                                    </Link>
                                );
                            })}



                            {/* Mobile CTA */}
                            <div className="px-3 py-2">
                                <button
                                    onClick={() => {
                                        scrollToContact();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-purple-500 to-sky-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-600 hover:to-sky-600 transition-all duration-300"
                                >
                                    {t('book')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

        </header>
    );
}
