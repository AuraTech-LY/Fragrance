import { createClient } from '@supabase/supabase-js';

// Initialize with empty values first
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a function to update the client
let supabaseClient = createClient(supabaseUrl || 'http://placeholder-url', supabaseAnonKey || 'placeholder-key');

export function updateSupabaseClient(url: string, key: string) {
  supabaseUrl = url;
  supabaseAnonKey = key;
  supabaseClient = createClient(url, key);
}

export const supabase = supabaseClient;