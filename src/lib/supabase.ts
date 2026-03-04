import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase responses
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          email: string;
          zone: string;
          role: string;
          provider: string;
          created_at: string;
          last_seen_at: string | null;
        };
        Insert: {
          id: string;
          display_name: string;
          email: string;
          zone?: string;
          role?: string;
          provider: string;
        };
        Update: {
          display_name?: string;
          zone?: string;
          last_seen_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          type: string;
          event_date: string;
          event_time: string | null;
          location: string | null;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          type: string;
          event_date: string;
          event_time?: string | null;
          location?: string | null;
          description?: string | null;
          image_url?: string | null;
          created_by: string;
        };
        Update: {
          title?: string;
          type?: string;
          event_date?: string;
          event_time?: string | null;
          location?: string | null;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
        };
      };
      mosque_info: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: string;
          updated_by?: string | null;
        };
        Update: {
          value?: string;
          updated_by?: string | null;
        };
      };
      prayer_cache: {
        Row: {
          id: string;
          date: string;
          zone: string;
          fajr: string;
          sunrise: string;
          dhuhr: string;
          asr: string;
          maghrib: string;
          isha: string;
          fetched_at: string;
        };
        Insert: {
          date: string;
          zone: string;
          fajr: string;
          sunrise: string;
          dhuhr: string;
          asr: string;
          maghrib: string;
          isha: string;
        };
        Update: never;
      };
    };
  };
}

