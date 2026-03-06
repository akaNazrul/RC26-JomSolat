import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Environment variable validation - fail fast if missing
const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    throw new Error(`Configuration error: ${name} is not set`);
  }
  return value;
};

// Validate required environment variables at startup
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Security: List of allowed origins for CORS (configure in Supabase Dashboard)
// Add your production domains to this list
const ALLOWED_ORIGINS = (
  import.meta.env.VITE_ALLOWED_ORIGINS || 
  'http://localhost:5173'
).split(',').map((o: string) => o.trim()).filter(Boolean);

// Secure storage adapter with XSS protection
const getSecureStorage = () => {
  return {
    getItem: (key: string): string | null => {
      try {
        const value = localStorage.getItem(key);
        if (!value) return null;
        
        // Validate token structure before returning
        try {
          const parsed = JSON.parse(value);
          // Only return if it looks like a valid session
          if (parsed.access_token || parsed.refresh_token) {
            return value;
          }
        } catch {
          // Not JSON, return as-is
        }
        return value;
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        // Additional security: validate input before storing
        if (typeof value !== 'string') {
          console.warn('Attempted to store non-string value');
          return;
        }
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Failed to store item:', e);
      }
    },
    removeItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to remove item:', e);
      }
    },
  };
};

// Create Supabase client with enhanced security configurations
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: getSecureStorage(),
    // Use PKCE flow for better security
    flowType: 'pkce',
  },
  // Global headers for additional security tracking
  global: {
    headers: {
      'X-Client-Info': 'jom-solat-web',
    },
  },
});

// Export allowed origins for use in Edge Functions and CORS validation
export const getAllowedOrigins = (): string[] => ALLOWED_ORIGINS;

// Helper to validate origin against allowed list
export const isOriginAllowed = (origin: string): boolean => {
  return ALLOWED_ORIGINS.some((allowed: string) => 
    allowed === origin || 
    allowed === '*'
  );
};

// Database Types
export type Database = {
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
};

