import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> | null {
  if (supabaseInstance) return supabaseInstance;

  const metaEnv = (import.meta as any).env || {};
  const url = metaEnv.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL : '');
  const anonKey = metaEnv.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY : '');

  if (url && anonKey) {
    try {
      supabaseInstance = createClient<Database>(url, anonKey);
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }

  return null;
}

export const isSupabaseConfigured = (): boolean => {
  return getSupabase() !== null;
};
