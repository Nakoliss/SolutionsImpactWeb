import { type NextRequest,NextResponse } from 'next/server';

import { getSubscriber, setSubscriber } from '../store';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token') || '';
    const subscriber = getSubscriber(token);
    if (!subscriber) {
      return new NextResponse('Lien invalide ou expir&eacute;.', {
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }
    subscriber.status = 'confirmed';
    setSubscriber(subscriber);
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Confirm&eacute;</title><style>body{background:#0f172a;color:#e2e8f0;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0} .card{background:#111827;border:1px solid #334155;padding:24px;border-radius:16px;max-width:520px} a{color:#38bdf8}</style></head><body><div class="card"><h1>Inscription confirm&eacute;e</h1><p>Merci! Vous recevrez un avis au lancement de la version anglaise.</p><p><a href="/fr">Retour &agrave; l&apos;accueil</a></p></div></body></html>`;
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Waitlist confirmation error', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
