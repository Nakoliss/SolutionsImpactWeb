'use client';

import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface AdminDashboardClientProps {
  leads: Array<{
    id: string;
    created_at: string;
    name: string | null;
    email: string | null;
    source: string | null;
    utm_source: string | null;
    utm_campaign: string | null;
  }>;
  bookings: Array<{
    id: string;
    created_at: string;
    starts_at: string | null;
    name: string | null;
    email: string | null;
  }>;
  payments: Array<{
    id: string;
    created_at: string;
    amount_cents: number | null;
    currency: string | null;
    bundle: string | null;
    modality: string | null;
    customer_email: string | null;
  }>;
  tasks: Array<{
    id: string;
    title: string | null;
    category: string | null;
    status: string | null;
    due_date: string | null;
    assignee: string | null;
  }>;
  kpis: {
    leadsWeek: number;
    bookingsWeek: number;
    revenueWeek: number;
  };
}

export default function AdminDashboardClient({
  leads,
  bookings,
  payments,
  tasks,
  kpis,
}: AdminDashboardClientProps) {
  const t = useTranslations('admin.dashboard');
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (cents: number | null, currency: string | null) => {
    if (!cents) return '0.00';
    const amount = cents / 100;
    return `${amount.toFixed(2)} ${currency || 'CAD'}`;
  };

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'doing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {t('signOut')}
        </button>
      </div>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border p-4">
          <div className="text-sm text-gray-600">{t('leadsWeek')}</div>
          <div className="text-2xl font-bold">{kpis.leadsWeek}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-600">{t('bookingsWeek')}</div>
          <div className="text-2xl font-bold">{kpis.bookingsWeek}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-600">{t('revenueWeek')}</div>
          <div className="text-2xl font-bold">{formatCurrency(kpis.revenueWeek * 100, 'CAD')}</div>
        </div>
      </section>

      {/* Latest Leads */}
      <section>
        <h2 className="text-lg font-medium mb-4">{t('latestLeads')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">{t('when')}</th>
                <th className="text-left p-2">{t('name')}</th>
                <th className="text-left p-2">{t('email')}</th>
                <th className="text-left p-2">{t('source')}</th>
                <th className="text-left p-2">{t('utm')}</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No leads yet
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b">
                    <td className="p-2">{formatDate(lead.created_at)}</td>
                    <td className="p-2">{lead.name || '-'}</td>
                    <td className="p-2">{lead.email || '-'}</td>
                    <td className="p-2">{lead.source || '-'}</td>
                    <td className="p-2">
                      {lead.utm_source && lead.utm_campaign
                        ? `${lead.utm_source}/${lead.utm_campaign}`
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Latest Bookings */}
      <section>
        <h2 className="text-lg font-medium mb-4">{t('latestBookings')}</h2>
        <div className="space-y-2">
          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="text-sm border-b pb-2">
                <span className="font-medium">{formatDate(booking.starts_at || booking.created_at)}</span>
                {' — '}
                <span>{booking.name || 'Unknown'}</span>
                {booking.email && <span> ({booking.email})</span>}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Latest Payments */}
      <section>
        <h2 className="text-lg font-medium mb-4">{t('latestPayments')}</h2>
        <div className="space-y-2">
          {payments.length === 0 ? (
            <p className="text-gray-500">No payments yet</p>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="text-sm border-b pb-2">
                <span className="font-medium">
                  {formatCurrency(payment.amount_cents, payment.currency)}
                </span>
                {' — '}
                <span>
                  {payment.bundle || '-'}/{payment.modality || '-'}
                </span>
                {payment.customer_email && <span> — {payment.customer_email}</span>}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tasks */}
      <section>
        <h2 className="text-lg font-medium mb-4">{t('tasks')}</h2>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="text-sm border-b pb-2 flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(task.status)}`}
                >
                  {task.status === 'done'
                    ? t('done')
                    : task.status === 'doing'
                      ? t('doing')
                      : t('todo')}
                </span>
                <span className="font-medium">{task.category || '-'}</span>
                <span>—</span>
                <span>{task.title || '-'}</span>
                {task.due_date && (
                  <>
                    <span className="text-gray-500">(échéance {task.due_date})</span>
                  </>
                )}
                {task.assignee && <span className="text-gray-500">— {task.assignee}</span>}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

