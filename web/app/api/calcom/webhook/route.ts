import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestInsert } from '@/lib/supabaseServer';

/**
 * Cal.com webhook handler
 * Processes BOOKING_CREATED events and logs bookings to Supabase
 */
export async function POST(req: NextRequest) {
  // Optional: Verify webhook signature if CALCOM_WEBHOOK_SECRET is set
  const webhookSecret = process.env.CALCOM_WEBHOOK_SECRET;
  
  if (webhookSecret) {
    const signature = req.headers.get('cal-signature');
    if (signature && signature !== webhookSecret) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }
  }

  try {
    const payload = await req.json();

    // Handle BOOKING_CREATED event
    if (payload?.triggerEvent === 'BOOKING_CREATED') {
      const event = payload.payload || {};
      const attendees = event.attendees || [];
      const primaryAttendee = attendees[0] || {};

      // Insert booking record into Supabase
      await supabaseRestInsert('bookings', {
        cal_event_id: event.uid || event.id,
        name: primaryAttendee.name || null,
        email: primaryAttendee.email || null,
        starts_at: event.startTime || null,
        locale: 'fr', // Default to French, can be enhanced later
        source: 'cal.com|contact',
      });

      console.log('Booking logged to Supabase:', {
        eventId: event.uid || event.id,
        email: primaryAttendee.email,
        startsAt: event.startTime,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to process Cal.com webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

