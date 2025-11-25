import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseRestInsert } from '@/lib/supabaseServer';
import { getEnv } from '@/lib/env';

/**
 * Get Stripe client instance (lazy initialization)
 */
function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey, {
    apiVersion: '2023-10-16',
  });
}

/**
 * Stripe webhook handler
 * Processes checkout.session.completed events and logs payments to Supabase
 */
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let stripe: Stripe;
  try {
    stripe = getStripeClient();
  } catch (error) {
    console.error('Failed to initialize Stripe client:', error);
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json(
      { error: `Signature verification failed: ${error}` },
      { status: 400 }
    );
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const amount = session.amount_total ?? 0;
      const currency = (session.currency?.toUpperCase() || 'CAD') as string;
      const metadata = session.metadata || {};

      // Insert payment record into Supabase
      await supabaseRestInsert('payments', {
        stripe_session_id: session.id,
        amount_cents: amount,
        currency,
        status: 'paid',
        bundle: metadata.bundle || null,
        modality: metadata.modality || null,
        customer_email: session.customer_details?.email || null,
      });

      console.log('Payment logged to Supabase:', {
        sessionId: session.id,
        amount,
        currency,
        email: session.customer_details?.email,
      });
    } catch (error) {
      console.error('Failed to log payment to Supabase:', error);
      // Don't fail the webhook - Stripe will retry if we return an error
      // Log the error for manual investigation
      return NextResponse.json(
        { error: 'Failed to process payment', received: true },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

