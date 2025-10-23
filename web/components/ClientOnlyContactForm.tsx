'use client';

import { useEffect, useState } from 'react';

import ContactForm from './ContactForm';
import type { SupportedLocale } from '@/content';

interface ClientOnlyContactFormProps {
    locale: SupportedLocale;
    className?: string;
    id?: string;
}

export default function ClientOnlyContactForm({ locale, className, id }: ClientOnlyContactFormProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        // Return a placeholder that matches the expected layout during SSR
        return (
            <section id={id || "contact-form"} className={`py-20 ${className} scroll-mt-16`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            {locale === 'fr' ? "Prêt à Transformer Votre Présence Numérique ?" : "Ready to Transform Your Digital Presence?"}
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            {locale === 'fr'
                                ? "Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons propulser votre entreprise"
                                : "Contact us for a free consultation and discover how we can propel your business"
                            }
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="animate-pulse">
                                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <div className="animate-pulse">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                    <div className="mt-6 h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="mt-8 h-12 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Only render the actual ContactForm after hydration is complete
    return <ContactForm locale={locale} className={className} id={id} />;
}