import { NavLink } from 'react-router-dom';
import { Home, Clock, MapPin, Calendar, User, Building2 } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/prayer-times', icon: Clock, label: 'Prayers' },
  { to: '/mosque-info', icon: Building2, label: 'Mosque' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-elevated border-t border-border-color safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
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
    </nav>
  );
}

