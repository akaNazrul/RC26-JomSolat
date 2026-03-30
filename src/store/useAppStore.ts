import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { fetchPrayerTimes } from '@/lib/prayerTimes';
import { buildUserObject } from '@/lib/user';
import type { User, Theme } from '@/types';
import type { PrayerTimeData } from '@/lib/prayerTimes';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Session
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;

  // Zone
  userZone: 'gelugor' | 'usm' | 'manual';
  setUserZone: (zone: 'gelugor' | 'usm' | 'manual') => void;

  // Prayer times cache (persisted for same-day reuse)
  prayerTimeData: PrayerTimeData | null;
  prayerTimeFetchedDate: string | null;
  fetchPrayerData: () => Promise<PrayerTimeData>;

  // Initialize session from Supabase + subscribe to auth state changes
  initSession: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(newTheme);
      },

      // User
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Loading
      isLoading: true,
      setIsLoading: (isLoading) => set({ isLoading }),

      // Auth
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      // Zone
      userZone: 'gelugor',
      setUserZone: (userZone) => set({ userZone }),

      // Prayer times cache
      prayerTimeData: null,
      prayerTimeFetchedDate: null,
      fetchPrayerData: async () => {
        const { prayerTimeData, prayerTimeFetchedDate } = get();
        const today = new Date().toDateString();
        if (prayerTimeData && prayerTimeFetchedDate === today) {
          return prayerTimeData;
        }
        const data = await fetchPrayerTimes();
        set({ prayerTimeData: data, prayerTimeFetchedDate: today });
        return data;
      },

      // Initialize session + subscribe to auth state changes
      initSession: async () => {
        set({ isLoading: true });

        // One-time initial session check
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            set({
              user: buildUserObject(session.user, profile),
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isAuthenticated: false, user: null, isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing session:', error);
          set({ isAuthenticated: false, user: null, isLoading: false });
        }

        // Persistent subscription — keeps store in sync for the lifetime of the page.
        // Handles token refresh, logout from another tab, OAuth sign-in, etc.
        supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
          if (event === 'SIGNED_OUT' || !session) {
            set({ user: null, isAuthenticated: false });
            return;
          }
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            try {
              const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              set({
                user: buildUserObject(session.user, profile),
                isAuthenticated: true,
              });
            } catch {
              // Non-fatal — token is valid even if profile fetch fails
            }
          }
        });
      },
    }),
    {
      name: 'jomsolat-storage',
      partialize: (state) => ({
        theme: state.theme,
        userZone: state.userZone,
        prayerTimeData: state.prayerTimeData,
        prayerTimeFetchedDate: state.prayerTimeFetchedDate,
      }),
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('jomsolat-storage');
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      if (parsed.state?.theme) {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(parsed.state.theme);
      }
    } catch {
      document.documentElement.classList.add('dark');
    }
  }
}