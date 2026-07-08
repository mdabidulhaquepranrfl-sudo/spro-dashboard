'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CountryProvider } from '@/context/CountryContext';
import { AuthProvider } from '@/context/AuthContext';

export default function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('spro-sidebar-collapsed', String(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((current) => !current);
  };

  return (
    <AuthProvider>
      <CountryProvider>
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <div className="flex min-h-screen">
            <Sidebar isOpen={mobileOpen} collapsed={sidebarCollapsed} onClose={() => setMobileOpen(false)} />

          <div
            className={`fixed inset-0 z-20 bg-slate-950/40 transition md:hidden ${mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={() => setMobileOpen(false)}
          />

          <div className={`flex min-h-screen flex-1 flex-col ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-50'}`}>
            <Navbar onMenuClick={() => setMobileOpen(true)} onToggleSidebar={handleToggleSidebar} isSidebarCollapsed={sidebarCollapsed} />
            <main className="flex-1">
              <div className="mx-auto max-w-8xl">{children}</div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </CountryProvider>
  </AuthProvider>
  );
}
