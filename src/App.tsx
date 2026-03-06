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
import AccountSettings from '@/pages/AccountSettings';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  const { isAuthenticated, initSession, isLoading } = useAppStore();

  useEffect(() => {
    // Initialize session + auth listener once on mount
    initSession();
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <img
            src="/assets/v2-SVG.svg"
            alt="JomSolat"
            className="h-12 w-auto mx-auto mb-4"
          />
          <p className="font-body text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes — redirect to home if already authenticated */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" replace /> : <SignUp />} />
      <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/home" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected routes — redirect to landing if not authenticated */}
      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}>
        <Route path="/home" element={<Home />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/mosque-info" element={<MosqueInfo />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/parking" element={<Parking />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        {/* Admin dashboard: always registered; component handles its own access check */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

