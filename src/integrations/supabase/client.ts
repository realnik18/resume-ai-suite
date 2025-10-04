import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://oaxphvejrudbtdqhukhe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heHBodmVqcnVkYnRkcWh1a2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NzQ0NjgsImV4cCI6MjA3MTI1MDQ2OH0.PQnHzexlUhykW_d-SfGDdww7rx0okushLjRZREEbjkM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});