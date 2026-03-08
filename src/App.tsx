import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Home from '@/pages/Home';
import PrayerTimes from '@/pages/PrayerTimes';
import MosqueInfo from '@/pages/MosqueInfo';
import Facilities from '@/pages/Facilities';
import Parking from '@/pages/Parking';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import Feedpage from './pages/Feedpage';

function App() {
  const { theme, isAuthenticated, user, initSession } = useAppStore();

  useEffect(() => {
    // Initialize session on mount
    initSession();
    
    // Listen for auth changes (for OAuth callbacks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch user profile and set in store
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        const user = {
          id: session.user.id,
          display_name: profile?.display_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          zone: (profile?.zone as 'gelugor' | 'usm' | 'manual') || 'gelugor',
          role: (profile?.role as 'user' | 'admin') || 'user',
          provider: session.user.app_metadata?.provider as 'email' | 'google' || 'email',
          created_at: profile?.created_at || session.user.created_at,
          last_seen_at: new Date().toISOString(),
        };
        
        useAppStore.getState().setUser(user);
      } else if (event === 'SIGNED_OUT') {
        useAppStore.getState().setUser(null);
        useAppStore.getState().setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Initialize theme on mount
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" replace /> : <SignUp />} />
      
      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/mosque-info" element={<MosqueInfo />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/parking" element={<Parking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feed" element={<Feedpage />} />
        
        {/* Admin routes */}
        {user?.role === 'admin' && (
          <Route path="/admin" element={<AdminDashboard />} />
        )}
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

