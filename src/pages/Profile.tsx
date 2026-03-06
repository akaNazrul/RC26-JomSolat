import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Bell, Shield, LogOut, ChevronRight, Lock, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, setUser, setIsAuthenticated } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  const [passwordResetError, setPasswordResetError] = useState('');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setPasswordResetError('No email found. Please sign in again.');
      return;
    }

    setIsSendingPasswordReset(true);
    setPasswordResetError('');
    setPasswordResetMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      setPasswordResetMessage('Password reset link sent to your email!');
    } catch (error) {
      console.error('Error sending password reset:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setPasswordResetError(`Failed to send: ${errorMsg}`);
    } finally {
      setIsSendingPasswordReset(false);
    }
  };

  const getZoneDisplayName = (zone: string | undefined) => {
    switch (zone) {
      case 'usm': return 'USM Induk';
      case 'gelugor': return 'USM / Gelugor';
      case 'manual': return 'Manual Zone';
      default: return 'USM / Gelugor';
    }
  };

  const accountActions = [
    { icon: LogOut, label: 'Sign Out', onClick: handleLogout, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronRight size={24} className="text-text-primary rotate-180" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Profile</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-surface border border-border-color">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-accent-primary"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center">
              <span className="text-2xl font-body font-bold text-white">
                {user?.display_name?.charAt(0).toUpperCase() || 'G'}
              </span>
            </div>
          )}
          <div>
            <h2 className="font-body font-semibold text-text-primary">
              {user?.display_name || 'Guest'}
            </h2>
            <p className="font-body text-sm text-text-secondary">{user?.email || 'Not signed in'}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-accent-primary/20 text-xs text-accent-primary">
              {getZoneDisplayName(user?.zone)} zone
            </span>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="font-body font-semibold text-text-primary mb-3 px-1">Settings</h3>
          <div className="space-y-2">
            {/* Notifications Toggle */}
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-text-muted" />
                <span className="font-body text-text-primary">Notifications</span>
              </div>
              <div 
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  notifications ? 'bg-accent-warm' : 'bg-border-color'
                }`}
                onClick={() => setNotifications(!notifications)}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </button>

            {/* Dark Mode Toggle */}
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-text-muted" />
                <span className="font-body text-text-primary">Dark Mode</span>
              </div>
              <div 
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  theme === 'dark' ? 'bg-accent-warm' : 'bg-border-color'
                }`}
                onClick={() => toggleTheme()}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div>
          <h3 className="font-body font-semibold text-text-primary mb-3 px-1">Security</h3>
          <div className="p-4 rounded-xl bg-bg-surface border border-border-color">
            {/* Success/Error Messages */}
            {passwordResetMessage && (
              <div className="mb-3 p-3 rounded-lg bg-green-500/20 text-green-400 text-sm">
                {passwordResetMessage}
              </div>
            )}
            {passwordResetError && (
              <div className="mb-3 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
                {passwordResetError}
              </div>
            )}
            
            <button
              onClick={handlePasswordReset}
              disabled={isSendingPasswordReset || !user?.email}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-base border border-border-color hover:bg-bg-elevated transition-colors group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-text-muted" />
                <span className="font-body text-text-primary">Change Password</span>
              </div>
              {isSendingPasswordReset ? (
                <Loader2 size={18} className="text-text-muted animate-spin" />
              ) : (
                <span className="text-xs text-accent-warm opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to send reset email →
                </span>
              )}
            </button>
            <p className="font-body text-xs text-text-muted mt-2">
              A password reset link will be sent to your email ({user?.email})
            </p>
          </div>
        </div>

        {/* Admin Link */}
        {user?.role === 'admin' && (
          <div>
            <h3 className="font-body font-semibold text-text-primary mb-3 px-1">Admin</h3>
            <Link
              to="/admin"
              className="flex items-center justify-between p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-accent-primary" />
                <span className="font-body font-semibold text-accent-primary">Admin Dashboard</span>
              </div>
              <ChevronRight size={18} className="text-accent-primary" />
            </Link>
          </div>
        )}

        {/* Account Actions */}
        <div>
          <h3 className="font-body font-semibold text-text-primary mb-3 px-1">Account</h3>
          <div className="space-y-2">
            {accountActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-bg-surface border border-border-color"
              >
                <action.icon size={20} className={action.color} />
                <span className={`font-body ${action.color}`}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="p-4 rounded-xl bg-bg-surface border border-border-color text-center">
          <p className="font-body text-sm text-text-secondary">JomSolat v1.0.0</p>
          <p className="font-body text-xs text-text-muted mt-1">Built for RC26 · Team Murtabug</p>
          <a
            href="https://discord.gg/yNrgex98"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/20 hover:bg-accent-primary/30 transition-colors cursor-pointer"
          >
            <img
              src="/assets/kracked-dev-logo.svg"
              alt="KrackedDevs"
              className="w-4 h-4"
            />
            <span className="text-xs font-body font-medium text-accent-primary">KrackedDevs RC26</span>
          </a>
        </div>
      </div>
    </div>
  );
}

