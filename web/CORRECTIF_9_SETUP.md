# Correctif #9 — Setup Instructions

This document provides setup instructions for the Admin Ops Dashboard with Supabase integration.

## Prerequisites

1. **Supabase Project** (Canada Central region)
   - Create a new Supabase project or use an existing one
   - Ensure the project is set to Canada Central region for Law 25 compliance
   - Enable REST API access

2. **Environment Variables**

   Add the following to your `.env.local` and Vercel environment variables:

   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE=your-service-role-key

   # Stripe (if not already configured)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Cal.com
   CALCOM_WEBHOOK_SECRET=your-webhook-secret

   # Cron
   CRON_SECRET=your-random-secret-string
   ```

## Database Setup

1. **Run SQL Schema**

   Open your Supabase SQL Editor and run the contents of `web/supabase-schema.sql`.

   This creates the following tables:
   - `leads` - Lead captures from forms/chatbot
   - `bookings` - Cal.com booking records
   - `payments` - Stripe payment records
   - `consents` - Consent logs (Law 25 compliance)
   - `tasks` - Operational tasks (maintenance, SEO, etc.)

2. **Configure RLS (Row Level Security)**

   The schema includes RLS policies. Ensure:
   - Service role can insert/select (used by API routes)
   - Public anon access is restricted

## Webhook Configuration

### Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Cal.com Webhook

1. Go to Cal.com Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/calcom/webhook`
3. Select event: `BOOKING_CREATED`
4. Set webhook secret (optional) in `CALCOM_WEBHOOK_SECRET`

## Admin Authentication Setup

1. **Create Admin User in Supabase**

   - Go to Supabase Dashboard → Authentication → Users
   - Create a new user with email/password
   - Note: For production, consider restricting admin access to specific email domains

2. **Access Admin Dashboard**

   - Navigate to `/admin/login`
   - Sign in with your Supabase admin credentials
   - You'll be redirected to `/admin` dashboard

## Vercel Cron Setup

See `web/vercel-cron-config.md` for detailed instructions on setting up monthly report task generation.

## Testing

1. **Test Lead Logging**
   - Submit a contact form
   - Check Supabase `leads` table for new entry

2. **Test Consent Logging**
   - Accept/refuse cookies
   - Check Supabase `consents` table for new entries

3. **Test Webhooks**
   - Stripe: Complete a test checkout
   - Cal.com: Create a test booking
   - Verify entries appear in respective tables

4. **Test Admin Dashboard**
   - Log in at `/admin/login`
   - Verify KPIs and data tables display correctly

## Compliance Notes

- All data is stored in Canada Central region (Law 25 compliant)
- Consent logs are retained for ≥ 1 year as required
- Sub-processors (Supabase, Stripe, Cal.com) are listed in privacy policy
- Data access/deletion requests are handled within 30 days

## Troubleshooting

### Admin login not working
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check Supabase Auth is enabled in dashboard
- Verify user exists in Supabase Authentication

### Webhooks not receiving data
- Check webhook URLs are correct and publicly accessible
- Verify webhook secrets match in environment variables
- Check Supabase `SUPABASE_SERVICE_ROLE` key is correct

### Data not appearing in dashboard
- Verify tables exist in Supabase
- Check RLS policies allow service role access
- Review API route logs for errors

