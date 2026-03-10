import { NavLink } from 'react-router-dom';
import { Home, Clock, Building2, User, Rss, Sun, Moon } from 'lucide-react';
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

// Desktop placeholder (kept minimal for now)
function DesktopNav() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
      <div className="w-full md:max-w-5xl md:mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/assets/v2-SVG.svg" alt="JomSolat" className="h-8 w-auto" />
        </div>

        <div className="flex items-center gap-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  isActive ? 'text-accent-warm' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-bg-elevated/60 hover:bg-bg-elevated text-text-primary border border-border-color"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

// Export a default Navbar that composes mobile + desktop variants
export default function Navbar() {
  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
}
