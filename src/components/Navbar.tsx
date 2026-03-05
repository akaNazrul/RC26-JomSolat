import { NavLink } from 'react-router-dom';
import { Home, Clock, Calendar, User, Building2, Bell, Sun, Moon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/prayer-times', icon: Clock, label: 'Prayers' },
  { to: '/mosque-info', icon: Building2, label: 'Mosque' },
  { to: '/events', icon: Calendar, label: 'Events' },
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

// Desktop Top Navigation - Logo, nav items in rounded bar, icons outside
function DesktopNav() {
  const { theme, toggleTheme } = useAppStore();
  
  return (
    <nav className="hidden md:block md:fixed md:top-4 md:left-4 md:right-4 md:z-50 md:py-2 md:h-16">
      <div className="flex items-center gap-4 w-full justify-between">
        {/* Left: Logo (outside the rounded rectangle) */}
        <div className="flex-shrink-0">
          <img
            src="/assets/jomSolat-logo-noBg.svg"
            alt="JomSolat Logo"
            className="h-20 w-auto"
          />
        </div>
        
        {/* Center: Navigation Items (inside rounded rectangle - centered) */}
        <div className="bg-bg-elevated border border-border-color rounded-2xl shadow-lg px-4 py-2 md:h-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    isActive
                      ? 'text-accent-warm bg-accent-warm/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-sm font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
        
        {/* Right: Theme Toggle & Notification (outside the rounded rectangle) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notification Bell */}
          <button className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors">
            <Bell size={20} strokeWidth={2} />
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} strokeWidth={2} />
            ) : (
              <Moon size={20} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
}

