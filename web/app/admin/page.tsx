import 'server-only';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { supabaseRestQuery } from '@/lib/supabaseServer';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import AdminDashboardClient from './AdminDashboardClient';

/**
 * Admin Dashboard - Server Component
 * Fetches data from Supabase and renders the dashboard
 */
export default async function AdminDashboard() {
  // Check authentication
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch data from Supabase
  const [leads, bookings, payments, tasks] = await Promise.all([
    supabaseRestQuery('leads', {
      order: 'created_at.desc',
      limit: 20,
    }).catch(() => []),
    supabaseRestQuery('bookings', {
      order: 'created_at.desc',
      limit: 20,
    }).catch(() => []),
    supabaseRestQuery('payments', {
      order: 'created_at.desc',
      limit: 20,
    }).catch(() => []),
    supabaseRestQuery('tasks', {
      order: 'due_date.asc',
      limit: 50,
    }).catch(() => []),
  ]);

  // Calculate KPIs (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const leadsWeek = Array.isArray(leads)
    ? leads.filter((l: { created_at: string }) => new Date(l.created_at) >= sevenDaysAgo).length
    : 0;

  const bookingsWeek = Array.isArray(bookings)
    ? bookings.filter((b: { created_at: string }) => new Date(b.created_at) >= sevenDaysAgo).length
    : 0;

  const revenueWeek = Array.isArray(payments)
    ? payments
        .filter((p: { created_at: string; amount_cents: number }) => {
          return new Date(p.created_at) >= sevenDaysAgo && p.amount_cents;
        })
        .reduce((sum: number, p: { amount_cents: number }) => sum + (p.amount_cents || 0), 0) / 100
    : 0;

  const t = await getTranslations('admin.dashboard');

  return (
    <AdminDashboardClient
      leads={leads || []}
      bookings={bookings || []}
      payments={payments || []}
      tasks={tasks || []}
      kpis={{
        leadsWeek,
        bookingsWeek,
        revenueWeek,
      }}
    />
  );
}

