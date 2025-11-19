'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for browser-side operations
 * Used for authentication and client-side queries
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.');
  }

  // For client-side, we use anon key for auth
  // Service role key should NEVER be exposed to the client
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

