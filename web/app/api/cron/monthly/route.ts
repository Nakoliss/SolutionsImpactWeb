import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestInsert } from '@/lib/supabaseServer';

/**
 * Monthly cron endpoint
 * Creates monthly report tasks for maintenance and SEO/AEO
 * Protected by CRON_SECRET header
 */
export async function POST(req: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = req.headers.get('authorization')?.replace('Bearer ', '');

  if (cronSecret && providedSecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current month (or previous month if run at month start)
    const now = new Date();
    const monthNames = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const monthLabel = `${monthName} ${year}`;

    // Calculate due date (end of current month)
    const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Create maintenance report task
    await supabaseRestInsert('tasks', {
      title: `Rapport maintenance ${monthLabel}`,
      category: 'maintenance',
      status: 'todo',
      due_date: dueDate.toISOString().split('T')[0],
      client: 'Solutions Impact Web',
      notes: 'Rapport mensuel de maintenance incluant uptime, SSL, sauvegarde, GBP posts, etc.',
    });

    // Create SEO/AEO report task
    await supabaseRestInsert('tasks', {
      title: `Rapport SEO/AEO ${monthLabel}`,
      category: 'seo',
      status: 'todo',
      due_date: dueDate.toISOString().split('T')[0],
      client: 'Solutions Impact Web',
      notes: 'Rapport mensuel SEO/AEO incluant articles publiés, mots-clés, tests IA (ChatGPT/Claude/Perplexity), etc.',
    });

    console.log('Monthly report tasks created for', monthLabel);

    return NextResponse.json({
      success: true,
      month: monthLabel,
      tasksCreated: 2,
    });
  } catch (error) {
    console.error('Failed to create monthly report tasks:', error);
    return NextResponse.json(
      { error: 'Failed to create tasks' },
      { status: 500 }
    );
  }
}

