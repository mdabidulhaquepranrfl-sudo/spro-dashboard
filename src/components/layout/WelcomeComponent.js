'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const QUICK_CARDS = [
  {
    title: 'Amolnama',
    desc: 'Detailed supervisor analytics and KPIs for the latest report view. Monitor performance trends with precision.',
    link: '/report/amolnama',
    icon: '📊',
    iconBackground: '#E6F4EA',
    iconColor: '#059669',
    accentColor: '#10B981',
  },
  {
    title: 'Target vs Achievement',
    desc: 'Track targets, compare outcomes, and optimize resources in real-time. Stay ahead with instant operational insights.',
    link: '/report/target-vs-achievement',
    icon: '🎯',
    iconBackground: '#E6F4EA',
    iconColor: '#059669',
    accentColor: '#10B981',
  },
  {
    title: 'Half Summery',
    desc: 'Review concise half-summary insights and operational highlights. Perfect for quick executive briefings.',
    link: '/report/half-summery',
    icon: '📝',
    iconBackground: '#E6F4EA',
    iconColor: '#059669',
    accentColor: '#10B981',
  },
];

export default function WelcomeComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return QUICK_CARDS;
    }

    return QUICK_CARDS.filter((card) =>
      [card.title, card.desc, card.link].some((value) => value.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] px-6 py-6 sm:px-8 sm:py-8">
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#064E3B] via-[#059669] to-[#10B981] p-6 text-white shadow-xl shadow-slate-300 sm:p-8">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-[1.5px] text-[#E6F4EA]">
              OPERATIONS OVERVIEW
            </div>
            <p className="text-base font-semibold uppercase tracking-[0.18em] text-[#E6F4EA]">Good Evening!</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">Welcome to the Web Reporting Portal</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Manage and monitor supervisor performance ledger effortlessly. Explore the most important reports from a single, beautiful dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[24px] bg-white p-5 shadow-sm shadow-slate-200 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[22px] font-bold text-slate-900">Report shortcuts</h2>
            <p className="mt-1 text-sm text-[#64748B]">Search and open the report you need.</p>
          </div>
          <label className="flex w-full max-w-[240px] items-center gap-3 rounded-[12px] bg-[#F0F4F8] px-4 py-3 text-sm text-[#64748B] shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#64748B]">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-[#94A3B8]"
            />
          </label>
        </div>

        {filteredCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {filteredCards.map((card) => (
              <Link
                key={card.title}
                href={card.link}
                className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
<div className="grid grid-cols-[56px_1fr] items-start gap-4 border-l-4 border-[#10B981] pl-4">
  <div className="grid h-14 w-14 place-items-center rounded-[12px]" style={{ backgroundColor: card.iconBackground }}>
    <span className="text-2xl" style={{ color: card.iconColor }}>{card.icon}</span>
  </div>

  <div>
    <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
    <p className="mt-2 text-sm leading-6 text-[#64748B]">{card.desc}</p>
    <span className="mt-6 inline-flex text-sm font-semibold text-[#10B981] transition group-hover:text-[#059669]">
      Explore →
    </span>
  </div>
</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
            No reports matched your search.
          </div>
        )}
      </section>
    </div>
  );
}
