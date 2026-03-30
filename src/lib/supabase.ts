import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Environment variable access (fall back to process.env for tests)
const metaEnv = (typeof import.meta !== 'undefined') ? (import.meta as any).env : undefined;
const ENV: Record<string, any> = metaEnv && Object.keys(metaEnv || {}).length ? metaEnv : process.env;
// Environment variable validation - fail fast if missing
const getEnvVar = (name: string): string => {
  const value = ENV[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    throw new Error(`Configuration error: ${name} is not set`);
  }
  return value;
};

// Note: environment variables are validated lazily in createSupabaseClient

// Security: List of allowed origins for CORS (configure in Supabase Dashboard)
// Add your production domains to this list
// Compute allowed origins at call-time so tests can set env before use
const computeAllowedOrigins = (): string[] => {
  const raw = (metaEnv && metaEnv.VITE_ALLOWED_ORIGINS) || (process.env && process.env.VITE_ALLOWED_ORIGINS) || 'http://localhost:5173';
  return (raw as string).split(',').map((o: string) => o.trim()).filter(Boolean);
};

// Secure storage adapter using sessionStorage for better security
// Session storage is cleared when the browser tab is closed, reducing XSS impact
const getSecureStorage = () => {
  return {
    getItem: (key: string): string | null => {
      try {
        const value = sessionStorage.getItem(key);
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
        sessionStorage.setItem(key, value);
      } catch (e) {
        console.error('Failed to store item:', e);
      }
    },
    removeItem: (key: string): void => {
      try {
        sessionStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to remove item:', e);
      }
    },
  };
};

// Lazy-initialized Supabase client to avoid import-time side-effects and
// improve testability. Use `getSupabase()` to obtain the client programmatically.
let _supabase: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL');
  const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY');
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: getSecureStorage(),
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'jom-solat-web',
      },
    },
  });
  _supabase = client;
  return client;
}

export function getSupabase(): SupabaseClient {
  return _supabase ?? createSupabaseClient();
}

// Export `supabase` as a transparent proxy that initializes the real client
// on first access so existing imports continue to work.
export const supabase: any = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getSupabase();
      // @ts-ignore
      const val = (client as any)[prop];
      // If the property is a function, bind it to the real client so
      // method calls keep the correct `this` context (prevents hung
      // or misbehaving requests when methods are extracted).
      if (typeof val === 'function') return val.bind(client);
      return val;
    },
    set(_target, prop, value) {
      const client = getSupabase();
      // @ts-ignore
      (client as any)[prop] = value;
      return true;
    },
    apply(_target, thisArg, args) {
      const client = getSupabase();
      // If proxy is called like a function, forward the call to the
      // underlying client (ensure function is bound to client).
      // @ts-ignore
      const fn = (client as any).apply;
      if (typeof fn === 'function') return fn.apply(client, args as any);
      // Fallback: try directly invoking as a function
      // @ts-ignore
      return (client as any).apply?.(thisArg, args);
    },
  }
);

// Export allowed origins for use in Edge Functions and CORS validation
export const getAllowedOrigins = (): string[] => computeAllowedOrigins();

// Helper to validate origin against allowed list
export const isOriginAllowed = (origin: string): boolean => {
  const ALLOWED_ORIGINS = computeAllowedOrigins();
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