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
      className={`fixed inset-y-0 left-0 z-[60] ${
        collapsed ? 'w-[260px] md:w-20' : 'w-50'
      } border-r border-slate-200 bg-white/95 px-3 py-4 shadow-l backdrop-blur-xl transition-all duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo Section */}
      <div className="relative flex items-center mb-8 px-2">
        <Link
          href="/home"
          className="flex flex-1 justify-center"
          onClick={onClose}
        >
          <div className="block text-center">
            <img
              src="/assets/img/spro_logo.svg"
              alt="SPRO Logo"
              className="mx-auto h-8 w-auto"
            />
            <p className="text-center text-[12px] font-medium text-slate-600">
              {country?.countryName ?? ""}
            </p>
          </div>
        </Link>

        <button
          type="button"
          className="absolute right-1 rounded-full p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <nav className={`space-y-1.5 h-[calc(100vh-120px)] pr-1 custom-scrollbar ${isExpanded ? 'overflow-y-auto' : 'overflow-visible'}`}>
        {SIDEBAR_NAV.map((item) => {
          const hasChildren = item.children?.length > 0;
          const isParentActive = hasChildren
            ? item.children.some((child) => pathname === child.href || pathname.startsWith(child.href + '/'))
            : pathname === item.href;

          return (
            <div key={item.id} className="group relative">
              {hasChildren ? (
                <>
                  {/* Parent Item */}
                  <div
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                      isParentActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } ${isExpanded ? 'justify-between' : 'justify-center'}`}
                  >
                    <span className="flex items-center gap-3">
                      <i className={`text-xl ${item.icon}`} />
                      <span className={`font-medium text-[15px] transition-all ${isExpanded ? 'block' : 'hidden'}`}>
                        {item.label}
                      </span>
                    </span>

                    {isExpanded && item.badge && (
                      <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Expanded Submenu */}
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-emerald-100 pl-4">
                      {item.children.map((child) => {
                        const active = pathname === child.href;
                        return (
                          <Link
                            key={child.id}
                            href={child.href}
                            onClick={onClose}
                            className={`block rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
                              active
                                ? 'bg-emerald-100 text-emerald-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Collapsed Hover Popup (Rich Design) */}
                  {!isExpanded && (
                    <div className="pointer-events-none group-hover:pointer-events-auto absolute left-full top-1/2 z-50 hidden -translate-y-1/2 rounded-3xl border border-slate-100 bg-white p-4 shadow-l group-hover:block w-60">
                      <div className="mb-3 px-2">
                        <p className="font-semibold text-slate-700">{item.label}</p>
                      </div>
                      <div className="space-y-1">
                        {item.children.map((child) => {
                          const active = pathname === child.href;
                          return (
                            <Link
                              key={child.id}
                              href={child.href}
                              onClick={onClose}
                              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                                active
                                  ? 'bg-emerald-100 text-emerald-700 font-medium'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                              }`}
                            >
                              <i className={child.icon || 'bx bx-circle'} />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Single Menu Item */
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${isExpanded ? '' : 'justify-center'}`}
                >
                  <i className={`text-2xl ${item.icon}`} />
                  <span className={`transition-all ${isExpanded ? 'block' : 'hidden'}`}>
                    {item.label}
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}