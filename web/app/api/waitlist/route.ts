import { type NextRequest,NextResponse } from 'next/server';
import crypto from 'crypto';

import { SITE_URL } from '@/lib/metadata';

import { setSubscriber, type WaitlistSubscriber } from './store';

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    const token = crypto.randomBytes(24).toString('hex');
    const createdAt = new Date().toISOString();
    const subscriber: WaitlistSubscriber = {
      email,
      token,
      status: 'pending',
      source,
      createdAt,
    };
    setSubscriber(subscriber);

    const base = SITE_URL.replace(/\/$/, '');
    const confirmUrl = `${base}/api/waitlist/confirm?token=${encodeURIComponent(token)}`;

    // Send confirmation email (best-effort, non-blocking)
    try {
      const { sendWaitlistConfirmationEmail } = await import('@/lib/emailService');
      await sendWaitlistConfirmationEmail(email, confirmUrl);
    } catch (e) {
      console.error('Failed to send confirmation email', e);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Waitlist POST error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
