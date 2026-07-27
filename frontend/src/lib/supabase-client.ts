import { createBrowserClient } from "@supabase/ssr";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || key.includes('placeholder')) return null;
  return { url, key };
}

export function createClient() {
  const config = getSupabaseConfig();
  if (!config) {
    return { auth: { getSession: async () => ({ data: { session: null } }), getUser: async () => ({ data: { user: null } }), signInWithOtp: async () => ({ error: new Error('Supabase not configured') }), verifyOtp: async () => ({ error: new Error('Supabase not configured') }), signOut: async () => ({}), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) }, from: () => ({ insert: async () => ({}), select: async () => ({ data: [] }), order: () => ({ limit: () => ({ data: [] }) }) }) } as any;
  }
  return createBrowserClient(config.url, config.key);
}
