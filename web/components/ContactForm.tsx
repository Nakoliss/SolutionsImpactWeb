'use client';

import { useRef, useState } from 'react';
import { Building, CheckCircle, Mail, Phone, Send, User } from 'lucide-react';

import type { SupportedLocale } from '@/content';
import { useAnalytics } from '@/lib/analytics';
import { PhoneInput } from './PhoneInput';
import { trackMetaLead } from './MetaPixelGate';

interface ContactFormProps {
  locale: SupportedLocale;
  className?: string;
  id?: string;
}

const CONTENT = {
  fr: {
    title: "Prêt à Transformer Votre Présence Numérique ?",
    subtitle: "Contactez-nous pour une consultation gratuite et découvrez comment nous pouvons propulser votre entreprise",
    form: {
      name: "Nom complet",
      email: "Adresse courriel",
      phone: "Téléphone",
      phonePlaceholder: "(123) 456-7890",
      company: "Entreprise",
      message: "Message",
      messagePlaceholder: "Décrivez votre projet ou vos besoins...",
      submit: "Envoyer le message",
      submitting: "Envoi en cours...",
      success: "Message envoyé avec succès!",
      error: "Une erreur s'est produite. Veuillez réessayer.",
      required: "Ce champ est requis",
      consultationCheckbox: "Je souhaite une consultation gratuite de 30 minutes"
    }
  },
  en: {
    title: "Ready to Transform Your Digital Presence?",
    subtitle: "Contact us for a free consultation and discover how we can propel your business",
    form: {
      name: "Full name",
      email: "Email address",
      phone: "Phone",
      phonePlaceholder: "(123) 456-7890",
      company: "Company",
      message: "Message",
      messagePlaceholder: "Describe your project or needs...",
      submit: "Send message",
      submitting: "Sending...",
      success: "Message sent successfully!",
      error: "An error occurred. Please try again.",
      required: "This field is required",
      consultationCheckbox: "I would like a free 30-minute consultation"
    }
  }
};

export default function ContactForm({ locale, className = '', id }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [wantsConsultation, setWantsConsultation] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const formStartRef = useRef(Date.now());

  const content = CONTENT[locale];
  const analytics = useAnalytics();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const phoneExample = content.form.phonePlaceholder ?? '(123) 456-7890';

    if (!formData.name.trim()) {
      newErrors.name = content.form.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = content.form.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'fr' ? 'Adresse courriel invalide' : 'Invalid email address';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length > 0 && phoneDigits.length !== 10) {
      newErrors.phone =
        locale === 'fr'
          ? `Numéro de téléphone invalide (ex. : ${phoneExample})`
          : `Invalid phone number (e.g., ${phoneExample})`;
    }

    if (!formData.message.trim()) {
      newErrors.message = content.form.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot.trim()) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Track form submission
    const submissionDelayMs = Date.now() - formStartRef.current;
    const phoneDigits = formData.phone.replace(/\D/g, '');
    analytics.track('contact_form_submitted', {
      locale,
      has_phone: !!formData.phone,
      has_company: !!formData.company,
      message_length: formData.message.length,
      phone_digits: phoneDigits.length,
      time_to_submit_ms: submissionDelayMs
    });

    // Track Meta Pixel Lead event if consultation requested
    if (wantsConsultation) {
      trackMetaLead('contact_form_consultation');
    }

    try {
      // Prepare message with consultation preference
      let finalMessage = formData.message;
      if (wantsConsultation) {
        const consultationText = locale === 'fr'
          ? "**CLIENT SOUHAITE UNE CONSULTATION GRATUITE**\n\n"
          : "**CLIENT WANTS A FREE CONSULTATION**\n\n";
        finalMessage = consultationText + formData.message;
      }

      // Add language information
      const languageInfo = locale === 'fr'
        ? "\n\n[Formulaire envoyé en français]"
        : "\n\n[Form sent in English]";
      finalMessage += languageInfo;

      // Save to leads API (existing endpoint for email/legacy storage)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          message: finalMessage,
          wantsConsultation,
          source: 'contact_form',
          locale,
          timestamp: new Date().toISOString(),
          companySize: 'unknown',
          interest: wantsConsultation
            ? 'contact_form_consultation'
            : 'contact_form_message'
        }),
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
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            locale,
            source: 'contact_form',
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            notes: finalMessage,
          }),
        });
      } catch (leadError) {
        // Don't fail the form submission if Supabase logging fails
        console.warn('Failed to log lead to Supabase:', leadError);
      }

      setSubmitStatus('success');
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        setSubmitStatus('idle');
        formStartRef.current = Date.now();
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      analytics.trackError('contact_form_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <section id={id || "contact-form"} className={`py-20 ${className} scroll-mt-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{content.title}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form suppressHydrationWarning onSubmit={handleSubmit} autoComplete="off" data-lpignore="true" noValidate className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {content.form.name} *
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700`}
                      disabled={isSubmitting}
                      required
                      aria-required="true"
                      aria-invalid={errors.name ? 'true' : undefined}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    />
                  </div>
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1 text-sm text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {content.form.email} *
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700`}
                      disabled={isSubmitting}
                      required
                      aria-required="true"
                      aria-invalid={errors.email ? 'true' : undefined}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1 text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    {content.form.phone}
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <PhoneInput
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(value) => handleChange('phone', value)}
                      autoComplete="tel"
                      data-lpignore="true"
                      data-form-type="other"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      disabled={isSubmitting}
                      placeholder={content.form.phonePlaceholder}
                      inputMode="tel"
                      aria-invalid={errors.phone ? 'true' : undefined}
                      aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                    />
                  </div>
                  {errors.phone && (
                    <p id="contact-phone-error" className="mt-1 text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    {content.form.company}
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {content.form.message} *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder={content.form.messagePlaceholder}
                  autoComplete="off"
                  data-lpignore="true"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700`}
                  disabled={isSubmitting}
                  required
                  aria-required="true"
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1 text-sm text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot for spam bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website" className="hidden">
                  Website
                </label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Consultation Checkbox */}
              <div className="mt-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsConsultation}
                    onChange={(e) => setWantsConsultation(e.target.checked)}
                    className="mt-1 mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {content.form.consultationCheckbox}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  aria-busy={isSubmitting ? 'true' : 'false'}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      {content.form.submitting}
                    </>
                  ) : (
                    <>
                      {content.form.submit}
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div
                  className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {content.form.success}
                </div>
              )}

              {submitStatus === 'error' && (
                <div
                  className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg"
                  role="alert"
                  aria-live="assertive"
                >
                  {content.form.error}
                </div>
              )}
          </form>
        </div>
      </div>
    </section>
  );
}
