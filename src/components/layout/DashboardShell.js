'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('spro-sidebar-collapsed') !== 'false';
  });

  const handleToggleSidebar = () => {
    setSidebarCollapsed((current) => {
      const nextValue = !current;
      window.localStorage.setItem('spro-sidebar-collapsed', String(nextValue));
      return nextValue;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={mobileOpen} collapsed={sidebarCollapsed} onClose={() => setMobileOpen(false)} />

        <div
          className={`fixed inset-0 z-20 bg-slate-950/40 transition md:hidden ${mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        <div className={`flex min-h-screen flex-1 flex-col ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
          <Navbar onMenuClick={() => setMobileOpen(true)} onToggleSidebar={handleToggleSidebar} isSidebarCollapsed={sidebarCollapsed} />
          <main className="flex-1 px-2 py-2 sm:px-2 lg:px-2">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
