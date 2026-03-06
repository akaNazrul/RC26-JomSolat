import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Bell, Shield, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, setUser, setIsAuthenticated } = useAppStore();
  const [notifications, setNotifications] = useState(true);

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

  const getZoneDisplayName = (zone: string | undefined) => {
    switch (zone) {
      case 'usm': return 'USM Induk';
      case 'gelugor': return 'USM / Gelugor';
      case 'manual': return 'Manual Zone';
      default: return 'USM / Gelugor';
    }
  };

  const settingsSections = [
    { icon: Settings, label: 'Account Settings', onClick: () => navigate('/account-settings') },
    { icon: Bell, label: 'Notifications', type: 'toggle', value: notifications, onChange: setNotifications },
    { icon: Moon, label: 'Dark Mode', type: 'toggle', value: theme === 'dark', onChange: () => toggleTheme() },
  ];

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
            {settingsSections.map((setting, index) => (
              <button
                key={index}
                onClick={setting.type !== 'toggle' ? setting.onClick : undefined}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color"
              >
                <div className="flex items-center gap-3">
                  <setting.icon size={20} className="text-text-muted" />
                  <span className="font-body text-text-primary">{setting.label}</span>
                </div>
                {setting.type === 'toggle' ? (
                  <div 
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      setting.value ? 'bg-accent-warm' : 'bg-border-color'
                    }`}
                    onClick={setting.onChange as () => void}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      setting.value ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                ) : (
                  <ChevronRight size={18} className="text-text-muted" />
                )}
              </button>
            ))}
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
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/20">
            <span className="text-xs font-body font-medium text-accent-primary">KrackedDevs RC26</span>
          </div>
        </div>
      </div>
    </div>
  );
}

