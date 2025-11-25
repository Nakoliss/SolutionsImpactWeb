import { NextResponse } from 'next/server';

interface CheckoutRequest {
  slug: 'essentials' | 'growth' | 'pro';
  mode: 'ot' | 'm';
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequest;
    const { slug, mode } = body;

    // Validate input
    if (!slug || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: slug and mode' },
        { status: 400 }
      );
    }

    if (!['essentials', 'growth', 'pro'].includes(slug)) {
      return NextResponse.json(
        { error: 'Invalid bundle slug' },
        { status: 400 }
      );
    }

    if (!['ot', 'm'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "ot" or "m"' },
        { status: 400 }
      );
    }

    // Return mock response indicating Stripe Checkout is coming soon
    return NextResponse.json(
      {
        status: 'coming_soon',
        message: 'Le paiement en ligne arrive bientôt. Pour commander, utilisez le diagnostic ou la page Contact.',
        bundle: slug,
        modality: mode,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      {
        status: 'coming_soon',
        error: 'checkout_failed',
        message: 'Le paiement en ligne arrive bientôt. Pour commander, utilisez le diagnostic ou la page Contact.',
      },
      { status: 501 }
    );
  }
}


