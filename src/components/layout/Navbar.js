'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ onMenuClick, onToggleSidebar, isSidebarCollapsed }) {
  const { auth } = useAuth();
  const pathname = usePathname();
  const user = auth?.user;
  const profilePic = user?.profile_pic || '/assets/img/avatars/profile.png';
  const userName = user?.name || 'User';
  const userRole = user?.role || '';

  const getBreadcrumbs = () => {
    if (!pathname || pathname === '/' || pathname.startsWith('/welcome')) return null;
    const segments = pathname.split('/').filter(Boolean);
    
    return (
      <div className="ml-2 hidden sm:flex items-center gap-2 text-sm font-medium">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const formattedSegment = segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          return (
            <div key={segment} className="flex items-center gap-2">
              <span className={isLast ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                {formattedSegment}
              </span>
              {!isLast && <span className="text-slate-300">/</span>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-2 py-2 backdrop-blur sm:px-2 lg:px-2">
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
          {getBreadcrumbs()}
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">🔔</button>
          <Link href="/profile" className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
            <Image src={profilePic} alt="User avatar" width={36} height={36} className="rounded-full" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
