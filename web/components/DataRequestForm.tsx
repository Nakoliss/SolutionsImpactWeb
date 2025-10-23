'use client';

import { useState, useTransition } from 'react';

import type { SupportedLocale } from '@/content';

type RequestType = 'access' | 'rectification' | 'portability' | 'deletion' | 'consent-withdrawal';

interface DataRequestFormProps {
  locale: SupportedLocale;
}

interface FormContent {
  title: string;
  subtitle: string;
  labels: {
    name: string;
    email: string;
    company: string;
    type: string;
    details: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
  help: string;
  types: Array<{ value: RequestType; label: string; description: string }>;
}

const COPY: Record<SupportedLocale, FormContent> = {
  en: {
    title: 'Request access, correction, or deletion',
    subtitle: 'Complete this form to exercise your Law 25 privacy rights. We will respond within 30 days and confirm once your request is completed.',
    labels: {
      name: 'Full name',
      email: 'Email address',
      company: 'Company (optional)',
      type: 'Choose the type of request',
      details: 'Details (optional)',
      submit: 'Submit my request',
      submitting: 'Submitting...',
      success: 'Your request was received. Our privacy officer will follow up shortly.',
      error: 'We could not process your request. Please try again or email privacy@webimpactsolutions.ca.',
    },
    help: 'Explain your request so we can respond quickly. Never include passwords or highly sensitive information in this form.',
    types: [
      { value: 'access', label: 'Access', description: 'Receive a copy of the personal information we hold about you.' },
      { value: 'rectification', label: 'Rectification', description: 'Correct inaccurate or outdated information.' },
      { value: 'portability', label: 'Portability', description: 'Receive your information in a portable format.' },
      { value: 'deletion', label: 'Deletion', description: 'Request removal of personal data that is no longer required.' },
      { value: 'consent-withdrawal', label: 'Withdraw consent', description: 'Stop optional communications or deactivate your account.' },
    ],
  },
  fr: {
    title: 'Demander l acces, la correction ou la suppression',
    subtitle: 'Remplissez ce formulaire pour exercer vos droits prevus par la Loi 25. Nous repondrons dans les 30 jours et confirmerons une fois la demande traitee.',
    labels: {
      name: 'Nom complet',
      email: 'Adresse courriel',
      company: 'Entreprise (optionnel)',
      type: 'Choisissez le type de demande',
      details: 'Details (optionnel)',
      submit: 'Soumettre ma demande',
      submitting: 'Envoi en cours...',
      success: 'Votre demande a ete recue. Notre responsable de la protection des renseignements personnels vous contactera sous peu.',
      error: 'Nous navons pas pu traiter votre demande. Reessayez ou ecrivez a privacy@webimpactsolutions.ca.',
    },
    help: 'Decrivez votre demande pour que nous puissions repondre rapidement. N inscrivez pas de mots de passe ni dinformations tres sensibles dans ce formulaire.',
    types: [
      { value: 'access', label: 'Acces', description: 'Recevoir une copie des renseignements personnels que nous detennons.' },
      { value: 'rectification', label: 'Rectification', description: 'Corriger des informations inexactes ou perimees.' },
      { value: 'portability', label: 'Portabilite', description: 'Recevoir vos renseignements dans un format portable.' },
      { value: 'deletion', label: 'Suppression', description: 'Demander la suppression des donnees qui ne sont plus necessaires.' },
      { value: 'consent-withdrawal', label: 'Retrait du consentement', description: 'Cesser les communications optionnelles ou desactiver votre compte.' },
    ],
  },
};

interface FormState {
  name: string;
  email: string;
  company: string;
  requestType: RequestType;
  details: string;
}

const DEFAULT_STATE: FormState = {
  name: '',
  email: '',
  company: '',
  requestType: 'access',
  details: '',
};

export default function DataRequestForm({ locale }: DataRequestFormProps) {
  const copy = COPY[locale];
  const [form, setForm] = useState<FormState>(DEFAULT_STATE);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch('/api/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            locale,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: 'unknown' }));
          throw new Error(typeof data.error === 'string' ? data.error : 'unknown');
        }

        setStatus('success');
        setForm({ ...DEFAULT_STATE });
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : null);
      }
    });
  };

  const disabled = isPending;

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl sm:p-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">{copy.title}</h1>
        <p className="text-sm text-slate-200">{copy.subtitle}</p>
      </header>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="dr-name" className="mb-2 block text-sm font-medium text-slate-200">
              {copy.labels.name}
            </label>
            <input
              id="dr-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm(prev => ({ ...prev, name: event.target.value }))}
              disabled={disabled}
              className="w-full rounded-lg border border-white/20 bg-slate-900 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label htmlFor="dr-email" className="mb-2 block text-sm font-medium text-slate-200">
              {copy.labels.email}
            </label>
            <input
              id="dr-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm(prev => ({ ...prev, email: event.target.value }))}
              disabled={disabled}
              className="w-full rounded-lg border border-white/20 bg-slate-900 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="dr-company" className="mb-2 block text-sm font-medium text-slate-200">
            {copy.labels.company}
          </label>
          <input
            id="dr-company"
            name="company"
            type="text"
            value={form.company}
            onChange={(event) => setForm(prev => ({ ...prev, company: event.target.value }))}
            disabled={disabled}
            className="w-full rounded-lg border border-white/20 bg-slate-900 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-slate-200">{copy.labels.type}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.types.map(option => (
              <label
                key={option.value}
                className={`rounded-xl border px-4 py-3 text-sm transition ${
                  form.requestType === option.value
                    ? 'border-sky-500 bg-sky-500/10 text-white'
                    : 'border-white/15 bg-slate-900 text-slate-200 hover:border-sky-400'
                }`}
              >
                <input
                  type="radio"
                  name="requestType"
                  value={option.value}
                  checked={form.requestType === option.value}
                  onChange={() => setForm(prev => ({ ...prev, requestType: option.value }))}
                  disabled={disabled}
                  className="mr-3 h-4 w-4 align-middle text-sky-500 focus:ring-sky-500"
                />
                <span className="font-semibold">{option.label}</span>
                <p className="mt-1 text-xs text-slate-300">{option.description}</p>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="dr-details" className="mb-2 block text-sm font-medium text-slate-200">
            {copy.labels.details}
          </label>
          <textarea
            id="dr-details"
            name="details"
            rows={5}
            value={form.details}
            onChange={(event) => setForm(prev => ({ ...prev, details: event.target.value }))}
            disabled={disabled}
            placeholder={copy.help}
            className="w-full rounded-lg border border-white/20 bg-slate-900 px-4 py-3 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? copy.labels.submitting : copy.labels.submit}
          </button>
          {status === 'success' && (
            <p className="text-sm text-green-400">{copy.labels.success}</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-400">
              {copy.labels.error}
              {errorMessage ? ` (${errorMessage})` : ''}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
