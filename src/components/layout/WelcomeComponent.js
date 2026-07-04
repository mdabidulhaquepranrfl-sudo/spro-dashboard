'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const QUICK_CARDS = [
  {
    title: 'Amolnama',
    desc: 'Detailed supervisor analytics and KPIs for the latest report view.',
    link: '/report/amolnama',
    icon: '📊',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    title: 'Target vs Achievement',
    desc: 'Track progress against planned targets and compare outcomes.',
    link: '/report/target-vs-achievement',
    icon: '🎯',
    accent: 'from-emerald-500 to-lime-500',
  },
  {
    title: 'Half Summary',
    desc: 'Review concise half-summary insights and operational highlights.',
    link: '/report/half-summery',
    icon: '📝',
    accent: 'from-amber-500 to-orange-500',
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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-700 p-6 text-white shadow-xl shadow-sky-200 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-sky-50">
              SPRO operations overview
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Welcome to SPRO Dashboard!</h1>
            <p className="mt-3 text-sm text-sky-50/90 sm:text-base">
              Manage and monitor supervisor performance ledger effortlessly. You can check individual performance reports by navigating to the Reports section.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Report shortcuts</h2>
            <p className="text-sm text-slate-500">Search and open the report you need.</p>
          </div>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="text-base">🔎</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search reports"
              className="w-full bg-transparent outline-none placeholder:text-slate-400 sm:w-56"
            />
          </label>
        </div>

        {filteredCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {filteredCards.map((card) => (
              <Link
                key={card.title}
                href={card.link}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`inline-flex rounded-2xl bg-gradient-to-br ${card.accent} px-3 py-3 text-2xl shadow-inner`}>
                  {card.icon}
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-sky-600 transition group-hover:text-sky-700">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No reports matched your search.
          </div>
        )}
      </section>
    </div>
  );
}
