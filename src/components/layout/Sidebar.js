'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_NAV } from '@/lib/constants/navigation';
import { useCountry } from '@/context/CountryContext';

export default function Sidebar({ isOpen, onClose, collapsed }) {
  const pathname = usePathname();
  const isExpanded = !collapsed || isOpen;
  const { country } = useCountry();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 ${collapsed ? 'w-50 md:w-20' : 'w-50'} border-r border-slate-200 bg-white/95 px-2 py-2 shadow-xl backdrop-blur transition-all duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="relative flex items-center">
        <Link
          href="/home"
          className="flex flex-1 justify-center"
          onClick={onClose}
        >
          <div className="block text-center">
            <img
              src="/assets/img/spro_logo.svg"
              alt="SPRO Logo"
              className="mx-auto h-7 w-auto lg:h-8"
            />
            <p className="mt-1 text-center text-sm text-slate-500">
              {country?.countryName ?? ""}
            </p>
          </div>
        </Link>

        <button
          type="button"
          className="absolute right-0 rounded-full p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className="mt-8 space-y-2 overflow-hidden">
        {SIDEBAR_NAV.map((item) => {
          const hasChildren = item.children?.length;
          const isParentActive = hasChildren
            ? item.children.some((child) => pathname === child.href || pathname.startsWith(child.href + '/'))
            : pathname === item.href;

          return (
            <div key={item.id} className="group relative">
              {hasChildren ? (
                <div>
                  <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} rounded-2xl px-3 py-2.5 ${isParentActive ? 'bg-[#E3FBE8]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <span className="flex items-center gap-3">
                      <i className={`text-lg ${item.icon}`} />
                      <span className={`font-medium transition-all duration-200 ${isExpanded ? 'block' : 'hidden'}`}>{item.label}</span>
                    </span>
                    {!collapsed && item.badge ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">{item.badge}</span> : null}
                  </div>
                  {isExpanded && (
                    <div className="ml-7 mt-1 space-y-1 border-l border-slate-200 pl-3">
                      {item.children.map((child) => {
                        const active = pathname === child.href;
                        return (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={onClose}
                            className={`block rounded-xl px-1 py-1 text-sm transition ${active ? 'bg-[#E3FBE8] font-semibold text-sky-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  {!isExpanded && hasChildren && (
                    <div className="pointer-events-none absolute left-full top-1/2 z-20 hidden -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg group-hover:block">
                      <div className="space-y-1">
                        {item.children.map((child) => {
                          const active = pathname === child.href;
                          return (
                            <Link
                              key={child.id}
                              href={child.href}
                              onClick={onClose}
                              className={`block rounded-xl px-3 py-2 text-sm transition ${active ? 'bg-[#E3FBE8] font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                              {child.icon}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center ${isExpanded ? '' : 'justify-center'} gap-3 rounded-2xl px-3 py-2.5 transition ${pathname === item.href ? 'bg-[#E3FBE8] font-semibold text-sky-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <i className={`text-xl ${item.icon}`} />
                  <span className={`transition-all duration-200 ${isExpanded ? 'block' : 'hidden'}`}>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
