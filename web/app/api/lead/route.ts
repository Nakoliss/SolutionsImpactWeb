import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestInsert } from '@/lib/supabaseServer';

/**
 * Lead submission endpoint
 * Called from forms, chatbot, and other lead capture points
 * Logs leads to Supabase for ops tracking
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Extract UTM parameters if present
    const utmSource = data.utm_source || data.utmSource || null;
    const utmMedium = data.utm_medium || data.utmMedium || null;
    const utmCampaign = data.utm_campaign || data.utmCampaign || null;

    // Normalize source field
    const source = data.source || 'unknown';

    // Prepare lead data for Supabase
    const leadData = {
      name: data.name || null,
      email: data.email || null,
      phone: data.phone || null,
      locale: data.locale || 'fr',
      source,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      notes: data.notes || data.message || null,
      consent_analytics: data.consent_analytics || false,
      consent_ads: data.consent_ads || false,
      consent_chatbot: data.consent_chatbot || false,
    };

    // Insert into Supabase
    await supabaseRestInsert('leads', leadData);

    console.log('Lead logged to Supabase:', {
      email: leadData.email,
      source: leadData.source,
      locale: leadData.locale,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to log lead to Supabase:', error);
    // Don't fail the request - lead capture should still work even if logging fails
    return NextResponse.json(
      { ok: true, warning: 'Lead logged but Supabase sync may have failed' },
      { status: 200 }
    );
  }
}

