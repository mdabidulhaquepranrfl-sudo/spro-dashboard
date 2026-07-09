'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const QUICK_CARDS = [
  {
    title: 'Amolnama',
    desc: 'Detailed supervisor analytics and KPIs for the latest report view. Monitor performance trends with precision.',
    link: '/report/amolnama',
    icon: 'bx bx-bar-chart-alt-2',
    iconBackground: '#E6F4EA',
    iconColor: '#059669',
    accentColor: '#10B981',
  },
  {
    title: 'Target vs Achievement',
    desc: 'Track targets, compare outcomes, and optimize resources in real-time. Stay ahead with instant operational insights.',
    link: '/report/target-vs-achievement',
    icon: 'bx bx-target-lock',
    iconBackground: '#E6F4EA',
    iconColor: '#059669',
    accentColor: '#10B981',
  },
  {
    title: 'Half Summery',
    desc: 'Review concise half-summary insights and operational highlights. Perfect for quick executive briefings.',
    link: '/report/half-summery',
    icon: 'bx bx-file',
    iconBackground: '#E6F4EA',
    iconColor: '#059669',
    accentColor: '#10B981',
  },
];

export default function WelcomeComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  const greetingDetails = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { greeting: 'Good Morning!', backgroundImage: '/assets/img/bg_morning.jpeg' };
    }

    if (hour >= 12 && hour < 17) {
      return { greeting: 'Good Afternoon!', backgroundImage: '/assets/img/bg_noon.jpeg' };
    }

    if (hour >= 17 && hour < 20) {
      return { greeting: 'Good Evening!', backgroundImage: '/assets/img/bg_evening.jpeg' };
    }

    return { greeting: 'Good Night!', backgroundImage: '/assets/img/bg_night.jpeg' };
  }, []);

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
    <div className="min-h-screen w-full bg-white px-2 py-2 sm:px-5 sm:py-5">
      <section
        className="relative overflow-hidden rounded-[24px] bg-cover bg-center p-6 text-white sm:p-8 min-h-fit lg:min-h-[180px] xl:min-h-[200px]"
        style={{ backgroundImage: `url(${greetingDetails.backgroundImage})` }}
      >
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full py-1 text-[12px] font-semibold uppercase tracking-[1px] text-[#E6F4EA]">
              OPERATIONS OVERVIEW
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-2xl">{greetingDetails.greeting}</h2>
            <h6 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-2xl">Welcome to the Web Reporting Portal</h6>
          </div>
        </div>
      </section>

      <section className="mt-2 p-1 sm:p-1">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[22px] font-semibold text-slate-900">Report shortcuts</h2>
            <p className="mt-1 text-sm text-[#64748B]">Search and open the report you need.</p>
          </div>

          <label className="ml-auto mt-5 flex w-full max-w-[240px] items-center gap-3 rounded-[12px] bg-[#F0F4F8] px-4 py-3 text-sm text-[#64748B] shadow-sm sm:mt-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#64748B]"
            >
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
                className="group overflow-hidden rounded-[20px] border border-slate-200 bg-white p-0 sm:p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid grid-cols-[56px_1fr] items-start gap-4 border-l-5 border-[#10B981] rounded-[12px] pl-4">
                  <div className="grid h-14 w-14 sm:h-12 sm:w-12 place-items-center rounded-[12px]" style={{ backgroundColor: card.iconBackground }}>
                    <i className={`${card.icon} text-3xl`} style={{ color: card.iconColor }} />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-[#64748B]">{card.desc}</p>
                    <span className="mt-3 inline-flex text-sm font-bold text-[#10B981] transition group-hover:text-[#059669]">
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
