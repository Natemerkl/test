
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zbpugkkdtczpqakriknj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicHVna2tkdGN6cHFha3Jpa25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MDAzODQsImV4cCI6MjA1NTM3NjM4NH0.aOOmuTs73ocO7OWTO5lJvt3ou43hh6TMSHfIr4nSg98";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});
