// Supabase client configuration for ApplyPro AI
// TODO: Install @supabase/supabase-js when ready to integrate

// Environment variables (to be added to .env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Placeholder for Supabase client
// TODO: Replace with actual Supabase client creation
export const createSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not found. Using mock client.');
    return null;
  }
  
  // TODO: Uncomment and install dependencies
  // import { createClient } from '@supabase/supabase-js'
  // return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  return null;
};

// Mock client for development
export const supabase = createSupabaseClient();

// Types for Supabase integration
export interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: SupabaseUser;
}

// TODO: Add database types when schema is ready
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          plan: 'starter' | 'pro' | 'business';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: any; // JSON
          ats_score: number;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['resumes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['resumes']['Insert']>;
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          role: string;
          status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
          link?: string;
          salary_range?: string;
          notes?: string;
          applied_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['applications']['Insert']>;
      };
    };
  };
}