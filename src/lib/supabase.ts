import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// The Database type is exported for use in explicit casts elsewhere.
// Note: typed createClient<Database>() requires the exact Supabase-generated
// schema format; use plain createClient() to avoid version-mismatch errors.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key: string) => {
        return localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
      },
    },
  },
});

// Types for Supabase responses
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          email: string;
          avatar_url: string | null;
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
          avatar_url?: string | null;
          zone?: string;
          role?: string;
          provider: string;
        };
        Update: {
          display_name?: string;
          avatar_url?: string | null;
          zone?: string;
          role?: string;
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
          is_active?: boolean;
          created_by?: string;
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
          updated_at?: string;
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

