'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EnWaitlistOverlay() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle'|'pending'|'success'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Veuillez entrer votre courriel.");
      return;
    }
    if (!consent) {
      setError("Veuillez accepter de recevoir un avis de lancement.");
      return;
    }
    setStatus('pending');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), locale: 'en', source: 'en_overlay_waitlist' }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError("Une erreur est survenue. Réessayez plus tard.");
    }
  };

  if (!open) return null;
  const closeOnBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4" onClick={closeOnBackdrop} role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-white shadow-2xl">
        <h2 className="text-2xl font-semibold">Coming soon — English version</h2>
        {status === 'success' ? (
          <p className="mt-3 text-slate-200">Thanks! Check your email to confirm your subscription.</p>
        ) : (
          <>
            <p className="mt-2 text-slate-300">Leave your email and we’ll notify you at launch. In the meantime, the French version is fully available.</p>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your email"
                className="w-full rounded-lg border border-white/15 bg-slate-800 px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status==='pending'}
              />
              <label className="flex items-start gap-2 text-sm text-slate-300">
                <input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={status==='pending'} />
                <span>
                  I agree to receive a one‑time launch notice.{' '}
                  <Link href="/en/compliance/privacy" className="underline underline-offset-4 text-sky-300">Learn more</Link>
                </span>
              </label>
              {error && <p className="text-sm text-red-300">{error}</p>}
              <div className="mt-2 flex flex-wrap gap-3">
                <button type="submit" disabled={status==='pending'} className="rounded-full bg-white px-5 py-2 text-slate-900 font-semibold hover:bg-slate-100 disabled:opacity-60">
                  {status==='pending' ? 'Sending…' : 'Notify me at launch'}
                </button>
                <Link href="/fr" className="rounded-full border border-white/20 px-5 py-2 text-white hover:bg-white/10">Go to French</Link>
                <a href="mailto:info@solutionsimpactweb.com" className="rounded-full border border-white/20 px-5 py-2 text-white hover:bg-white/10">Contact us</a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
