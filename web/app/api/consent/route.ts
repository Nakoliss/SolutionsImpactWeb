import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestInsert } from '@/lib/supabaseServer';

/**
 * Consent logging endpoint
 * Called when users accept/refuse analytics, ads, or chatbot consent
 * Required for Loi 25 compliance - logs must be retained ≥ 1 year
 */
export async function POST(req: NextRequest) {
  try {
    const { category, granted, actor, meta } = await req.json();

    // Validate required fields
    if (!category || typeof granted !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: category, granted' },
        { status: 400 }
      );
    }

    // Get IP address for actor if not provided
    const ipAddress =
      actor ||
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // Prepare consent record
    const consentData = {
      category, // analytics/ads/chatbot/email
      granted,
      actor: ipAddress,
      meta: meta || {
        userAgent: req.headers.get('user-agent') || null,
        timestamp: new Date().toISOString(),
      },
    };

    // Insert into Supabase
    await supabaseRestInsert('consents', consentData);

    console.log('Consent logged to Supabase:', {
      category,
      granted,
      actor: ipAddress,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to log consent to Supabase:', error);
    // Don't fail the request - consent should still work even if logging fails
    return NextResponse.json(
      { ok: true, warning: 'Consent processed but logging may have failed' },
      { status: 200 }
    );
  }
}

