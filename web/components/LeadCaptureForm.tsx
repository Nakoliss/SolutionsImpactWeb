'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

import { useAnalytics } from '@/lib/analytics';

export interface LeadFormData {
  name: string;
  email: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  interest: string;
  honeypot?: string; // Spam detection field
}

interface LeadCaptureFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
  locale?: 'fr' | 'en';
  className?: string;
  onSubmit?: (data: LeadFormData) => Promise<void> | void;
  source?: string; // Track where the form was submitted from
}

const COMPANY_SIZE_OPTIONS = {
  fr: {
    startup: 'Startup (1-5 employés)',
    small: 'PME (6-25 employés)',
    medium: 'Moyenne entreprise (26-100 employés)',
    large: 'Grande entreprise (101-500 employés)',
    enterprise: 'Corporation (500+ employés)'
  },
  en: {
    startup: 'Startup (1-5 employees)',
    small: 'Small business (6-25 employees)',
    medium: 'Medium business (26-100 employees)',
    large: 'Large business (101-500 employees)',
    enterprise: 'Enterprise (500+ employees)'
  }
};

const INTEREST_OPTIONS = {
  fr: [
    'Page d\'atterrissage',
    'Site web complet',
    'E-commerce',
    'SEO et marketing',
    'Conformité Loi 25',
    'Automatisation IA',
    'Consultation stratégique',
    'Autre'
  ],
  en: [
    'Landing page',
    'Complete website',
    'E-commerce',
    'SEO and marketing',
    'Law 25 compliance',
    'AI automation',
    'Strategic consultation',
    'Other'
  ]
};

export default function LeadCaptureForm({
  title,
  description,
  buttonText,
  locale = 'fr',
  className,
  onSubmit,
  source = 'unknown'
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    companySize: 'small',
    interest: '',
    honeypot: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analytics = useAnalytics();
  
  const content = {
    fr: {
      title: title || 'Consultation Gratuite',
      description: description || 'Obtenez une évaluation personnalisée de vos besoins en marketing numérique.',
      fields: {
        name: 'Nom complet',
        email: 'Adresse courriel',
        companySize: 'Taille de l\'entreprise',
        interest: 'Principal intérêt'
      },
      placeholders: {
        name: 'Votre nom complet',
        email: 'votre@email.com',
        interest: 'Sélectionnez votre principal intérêt'
      },
      button: buttonText || 'Obtenir ma consultation gratuite',
      success: 'Merci ! Nous vous contacterons sous peu.',
      errors: {
        required: 'Ce champ est requis',
        email: 'Adresse courriel invalide',
        submit: 'Erreur lors de l\'envoi. Veuillez réessayer.'
      }
    },
    en: {
      title: title || 'Free Consultation',
      description: description || 'Get a personalized assessment of your digital marketing needs.',
      fields: {
        name: 'Full name',
        email: 'Email address',
        companySize: 'Company size',
        interest: 'Primary interest'
      },
      placeholders: {
        name: 'Your full name',
        email: 'your@email.com',
        interest: 'Select your primary interest'
      },
      button: buttonText || 'Get my free consultation',
      success: 'Thank you! We will contact you shortly.',
      errors: {
        required: 'This field is required',
        email: 'Invalid email address',
        submit: 'Error sending form. Please try again.'
      }
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
    
    // Honeypot check for spam
    if (formData.honeypot) {
      console.log('Spam submission detected');
      return;
    }
    
    // Basic validation
    if (!formData.name.trim()) {
      setError(t.errors.required);
      return;
    }
    
    if (!formData.email.trim()) {
      setError(t.errors.required);
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError(t.errors.email);
      return;
    }
    
    if (!formData.interest) {
      setError(t.errors.required);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add metadata to form submission
      const submissionData = {
        ...formData,
        source,
        timestamp: new Date().toISOString(),
        locale
      };
      
      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Default handling - submit to API
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
        
        const result = await response.json();
        console.log('Lead submitted successfully:', result);
      }
      
      // Track successful form submission
      const completedFields = Object.keys(formData).filter(key => 
        key !== 'honeypot' && formData[key as keyof LeadFormData]
      );
      analytics.trackLeadFormSubmitted(source, completedFields.join(','), locale);
      
      setSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
      analytics.trackError(`Lead form submission failed: ${err}`, { source, locale });
      setError(t.errors.submit);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className={clsx('bg-green-50 border border-green-200 rounded-lg p-6 text-center', className)}>
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          {t.success}
        </h3>
        <p className="text-green-700">
          {locale === 'fr' 
            ? 'Un membre de notre équipe vous contactera dans les 24 heures.'
            : 'A team member will contact you within 24 hours.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className={clsx('bg-white border border-gray-200 rounded-lg p-6 shadow-sm', className)}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t.title}
        </h3>
        <p className="text-gray-600">
          {t.description}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="website"
          value={formData.honeypot}
          onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />
        
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.name}
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t.placeholders.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.email}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder={t.placeholders.email}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        {/* Company size field */}
        <div>
          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.companySize}
          </label>
          <select
            id="companySize"
            value={formData.companySize}
            onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value as LeadFormData['companySize'] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {Object.entries(COMPANY_SIZE_OPTIONS[locale]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Interest field */}
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.interest}
          </label>
          <select
            id="interest"
            value={formData.interest}
            onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">
              {t.placeholders.interest}
            </option>
            {INTEREST_OPTIONS[locale].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}
        
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
              {locale === 'fr' ? 'Envoi...' : 'Sending...'}
            </span>
          ) : (
            t.button
          )}
        </button>
      </form>
    </div>
  );
}