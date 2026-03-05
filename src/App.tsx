import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import Layout from '@/components/Layout';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import AuthCallback from '@/pages/AuthCallback';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Home from '@/pages/Home';
import PrayerTimes from '@/pages/PrayerTimes';
import MosqueInfo from '@/pages/MosqueInfo';
import Facilities from '@/pages/Facilities';
import Parking from '@/pages/Parking';
import Events from '@/pages/Events';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  const { theme, isAuthenticated, user, initSession, isLoading } = useAppStore();

  useEffect(() => {
    // Initialize session on mount only
    initSession();
  }, []);

  useEffect(() => {
    // Initialize theme on mount
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-arabic text-2xl">م</span>
          </div>
          <p className="font-body text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - redirect to home if already authenticated */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" replace /> : <SignUp />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/home" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/mosque-info" element={<MosqueInfo />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/parking" element={<Parking />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        
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

