import { createClient } from '@supabase/supabase-js';
import { env, assertSupabaseConfigured } from './env.js';

// Use the signed-in user's access token so database queries are still subject
// to Supabase Row Level Security. Do not replace this with a service-role key.
export function createUserSupabaseClient(accessToken) {
  assertSupabaseConfigured();
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function createPublicSupabaseClient() {
  assertSupabaseConfigured();
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
