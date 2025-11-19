'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getEnv } from './env';

/**
 * Supabase server client for server-side operations
 * Used for authenticated requests in server components and API routes
 */
export async function createServerSupabaseClient() {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Supabase admin client using service role key
 * ONLY use this in API routes or server actions that need admin privileges
 * NEVER expose this to the client
 */
export function createAdminClient() {
  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase configuration is incomplete. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE are required.');
  }

  // Use REST API directly for admin operations
  return {
    url: supabaseUrl,
    serviceRoleKey,
  };
}

/**
 * Helper to make authenticated REST API calls to Supabase
 * Uses service role key for admin operations
 */
export async function supabaseRestInsert(table: string, data: Record<string, unknown>) {
  const { url, serviceRoleKey } = createAdminClient();

  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase insert failed: ${error}`);
  }

  return response.json();
}

/**
 * Helper to query Supabase REST API
 */
export async function supabaseRestQuery(
  table: string,
  options: {
    select?: string;
    order?: string;
    limit?: number;
    filter?: string;
  } = {}
) {
  const { url, serviceRoleKey } = createAdminClient();

  const params = new URLSearchParams();
  if (options.select) params.append('select', options.select);
  if (options.order) params.append('order', options.order);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.filter) params.append(options.filter, '');

  const queryString = params.toString();
  const fullUrl = `${url}/rest/v1/${table}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(fullUrl, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase query failed: ${error}`);
  }

  return response.json();
}

