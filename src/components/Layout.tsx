import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-base">
      {/* Main content with responsive padding */}
      {/* Mobile: pb-20 for bottom nav, Desktop: pt-24 for top nav */}
      <main className="pb-20 md:pb-0 md:pt-24">
        {/* Desktop: centered max-width container */}
        <div className="w-full md:max-w-5xl md:mx-auto">
          <Outlet />
        </div>
      </main>
      <Navbar />
    </div>
  );
}

