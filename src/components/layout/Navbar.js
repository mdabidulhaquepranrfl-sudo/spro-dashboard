'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar({ onMenuClick, onToggleSidebar, isSidebarCollapsed }) {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-8xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>
          <button
            type="button"
            className="hidden rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 md:inline-flex"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? '➡' : '⬅'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">🔔</button>
          <Link href="/profile" className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
            <Image src="/assets/img/avatars/1.png" alt="User avatar" width={36} height={36} className="rounded-full" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">John Doe</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
