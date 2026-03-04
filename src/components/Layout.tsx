import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-base">
      <main className="pb-20">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}

