import { NavLink } from 'react-router-dom';
import { Home, Clock, Building2, User, Rss } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/prayer-times', icon: Clock, label: 'Prayers' },
  { to: '/mosque-info', icon: Building2, label: 'Mosque' },
  { to: '/feed', icon: Rss, label: 'Feed' }, // New Feed Item
  { to: '/profile', icon: User, label: 'Profile' },
];

// Mobile Bottom Navigation with rounded corners
function MobileNav() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 safe-area-bottom z-50 md:hidden">
      <div className="bg-bg-elevated border border-border-color rounded-2xl shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive
                    ? 'text-accent-warm'
                    : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-warm" />
                    )}
                  </div>
                  <span className="text-[11px] mt-1">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
