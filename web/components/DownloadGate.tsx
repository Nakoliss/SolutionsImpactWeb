'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface DownloadGateProps {
  title: string;
  description: string;
  downloadUrl: string;
  fileName: string;
  locale?: 'fr' | 'en';
  className?: string;
  source?: string;
}

export default function DownloadGate({
  title,
  description,
  downloadUrl,
  fileName,
  locale = 'fr',
  className,
  source = 'download-gate'
}: DownloadGateProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  
  const content = {
    fr: {
      fields: {
        name: 'Nom complet',
        email: 'Adresse courriel'
      },
      placeholders: {
        name: 'Votre nom complet',
        email: 'votre@email.com'
      },
      button: 'Télécharger maintenant',
      downloading: 'Préparation...',
      success: 'Téléchargement prêt !',
      downloadButton: 'Cliquez ici pour télécharger',
      errors: {
        required: 'Ce champ est requis',
        email: 'Adresse courriel invalide',
        submit: 'Erreur lors de l\'envoi. Veuillez réessayer.'
      },
      privacy: 'Nous respectons votre vie privée. Aucun spam, promis.'
    },
    en: {
      fields: {
        name: 'Full name',
        email: 'Email address'
      },
      placeholders: {
        name: 'Your full name',
        email: 'your@email.com'
      },
      button: 'Download now',
      downloading: 'Preparing...',
      success: 'Download ready!',
      downloadButton: 'Click here to download',
      errors: {
        required: 'This field is required',
        email: 'Invalid email address',
        submit: 'Error sending form. Please try again.'
      },
      privacy: 'We respect your privacy. No spam, promised.'
    }
  };
  
  const t = content[locale];
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!name.trim()) {
      setError(t.errors.required);
      return;
    }
    
    if (!email.trim()) {
      setError(t.errors.required);
      return;
    }
    
    if (!validateEmail(email)) {
      setError(t.errors.email);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit lead with download context
      const leadData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        companySize: 'unknown' as const,
        interest: `Download: ${fileName}`,
        source,
        locale,
        timestamp: new Date().toISOString(),
        downloadItem: fileName
      };
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Also log to Supabase via /api/lead
      try {
        const { getUTMParams } = await import('@/lib/utmUtils');
        const utm = getUTMParams();
        await fetch('/api/lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            locale,
            source,
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            notes: `Download: ${fileName}`,
          }),
        });
      } catch (leadError) {
        // Don't fail the form submission if Supabase logging fails
        console.warn('Failed to log lead to Supabase:', leadError);
      }
      
      setSubmitted(true);
      setDownloadReady(true);
      
      // Track download event
      console.log('Download gate submission:', {
        email: email.trim(),
        fileName,
        source
      });
      
    } catch (err) {
      console.error('Download gate error:', err);
      setError(t.errors.submit);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDownload = () => {
    // Create a download link and trigger it
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download completion
    console.log('Download initiated:', { fileName, email: email.trim() });
  };
  
  if (submitted && downloadReady) {
    return (
      <div className={clsx('bg-green-50 border border-green-200 rounded-lg p-6 text-center', className)}>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          {t.success}
        </h3>
        <p className="text-green-700 mb-4">
          {title}
        </p>
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t.downloadButton}
        </button>
      </div>
    );
  }
  
  return (
    <div className={clsx('bg-white border border-gray-200 rounded-lg p-6 shadow-sm', className)}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field */}
        <div>
          <label htmlFor="download-name" className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.name}
          </label>
          <input
            type="text"
            id="download-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.placeholders.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Email field */}
        <div>
          <label htmlFor="download-email" className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.email}
          </label>
          <input
            type="email"
            id="download-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholders.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {/* Privacy notice */}
        <p className="text-xs text-gray-500">
          {t.privacy}
        </p>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            'w-full px-4 py-3 text-white font-medium rounded-md transition-colors',
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t.downloading}
            </span>
          ) : (
            t.button
          )}
        </button>
      </form>
    </div>
  );
}