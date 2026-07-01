'use client';

import Link from 'next/link';

const QUICK_CARDS = [
  {
    title: 'Overview Performance',
    desc: 'Detailed supervisor analytics and KPIs.',
    link: '/report/amolnama',
    icon: '📊',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    title: 'Recent Collaborations',
    desc: 'Monitor zone & district performance checklists.',
    link: '#',
    icon: '👥',
    accent: 'from-emerald-500 to-lime-500',
  },
  {
    title: 'System Settings',
    desc: 'Configure defaults and metadata properties.',
    link: '#',
    icon: '⚙️',
    accent: 'from-amber-500 to-orange-500',
  },
];

export default function WelcomeComponent() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-700 p-6 text-white shadow-xl shadow-sky-200 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-sky-50">
              SPRO operations overview
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Welcome to SPRO Dashboard! 🚀</h1>
            <p className="mt-3 text-sm text-sky-50/90 sm:text-base">
              Manage and monitor supervisor performance ledger effortlessly. You can check individual performance reports by navigating to the Reports section.
            </p>
          </div>
          <Link href="/report/amolnama" className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 font-semibold text-sky-700 transition hover:bg-sky-50">
            Go to Amolnama
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {QUICK_CARDS.map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`inline-flex rounded-2xl bg-gradient-to-br ${card.accent} px-3 py-3 text-2xl shadow-inner`}>{card.icon}</div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
            <Link href={card.link} className="mt-5 inline-flex text-sm font-semibold text-sky-600 hover:text-sky-700">
              Explore →
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
