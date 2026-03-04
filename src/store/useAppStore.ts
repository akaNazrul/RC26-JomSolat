import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User, Theme } from '@/types';

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
  
  // Initialize session from Supabase
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
      
      // Initialize session
      initSession: async () => {
        try {
          set({ isLoading: true });
          
          // Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Fetch user profile from public.users table
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const user: User = {
              id: session.user.id,
              display_name: profile?.display_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              zone: (profile?.zone as 'gelugor' | 'usm' | 'manual') || 'gelugor',
              role: (profile?.role as 'user' | 'admin') || 'user',
              provider: session.user.app_metadata?.provider as 'email' | 'google' || 'email',
              created_at: profile?.created_at || session.user.created_at,
              last_seen_at: new Date().toISOString(),
            };
            
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isAuthenticated: false, user: null, isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing session:', error);
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'jomsolat-storage',
      partialize: (state) => ({
        theme: state.theme,
        userZone: state.userZone,
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

