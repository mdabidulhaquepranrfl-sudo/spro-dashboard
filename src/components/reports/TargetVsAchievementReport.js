'use client';

import { useMemo, useState } from 'react';

const REPORT_DATA = {
  dashboard_page: {
    header: {
      title: 'Target vs. Achievement',
      subtitle: 'Real-time tracking of logistics performance metrics.',
    },
    controls: {
      search_bar: {
        placeholder: 'Search representatives, IDs, status...',
        icon: 'search',
      },
      date_picker: {
        selected_value: 'Sep 2024',
        icon: 'calendar',
        dropdown: true,
      },
    },
    main_content: {
      card_title: 'Team Performance',
      badge: {
        label: 'OVERALL',
        bg_color: '#E6F4EA',
        text_color: '#137333',
      },
      metrics: {
        total_target: {
          label: 'TOTAL TARGET',
          value: '10,00,000',
          color: '#991B1B',
        },
        expected: {
          label: 'EXPECTED',
          value: '7,20,000',
          color: '#D97706',
        },
        achieved: {
          label: 'ACHIEVED',
          value: '6,50,000',
          color: '#065F46',
        },
      },
      progress_bar: {
        min_percentage: '0%',
        max_percentage: '100%',
        segments: [
          { type: 'achieved', percentage: 65, color: '#065F46', label: '65% ACHIEVED' },
          { type: 'expected_gap', percentage: 7, color: '#D97706', label: '72% EXPECTED' },
          { type: 'remaining', percentage: 28, color: '#F3E8E6' },
        ],
      },
      status_alert: {
        type: 'warning',
        icon: 'trending_down',
        title: 'Achievement Gap: -70,000',
        description: 'The team is currently 7% behind the expected linear target for today.',
        styling: {
          border_left_color: '#065F46',
          bg_color: '#F3F4F6',
        },
      },
    },
  },
};

const performanceRows = [
  { name: 'Amina Rahman', status: 'Ahead', target: '2,40,000', achieved: '2,55,000', delta: '+15,000' },
  { name: 'Rafiq Hossain', status: 'On Track', target: '2,10,000', achieved: '1,95,000', delta: '-15,000' },
  { name: 'Nadia Islam', status: 'Behind', target: '1,80,000', achieved: '1,50,000', delta: '-30,000' },
];

export default function TargetVsAchievementReport() {
  const [staffId, setStaffId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(REPORT_DATA.dashboard_page.controls.date_picker.selected_value);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [inputError, setInputError] = useState('');

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return performanceRows;

    return performanceRows.filter((row) => {
      return [row.name, row.status, row.target, row.achieved, row.delta].some((value) =>
        String(value).toLowerCase().includes(term),
      );
    });
  }, [searchTerm]);

  const handleShowReport = (event) => {
    event.preventDefault();

    if (!staffId.trim()) {
      setInputError('Please enter a staff ID or representative ID to continue.');
      setShowReport(false);
      return;
    }

    setInputError('');
    setShowReport(true);
  };

  const { header, controls, main_content } = REPORT_DATA.dashboard_page;
  const metrics = main_content.metrics;

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      <section className="w-full max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">{header.title}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{header.subtitle}</h2>
          </div>
        </div>

        <form onSubmit={handleShowReport} className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md">
            <label className="block text-sm font-medium text-slate-700">Staff ID / Representative ID</label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="bx bx-user text-lg" />
              </span>
              <input
                value={staffId}
                onChange={(event) => setStaffId(event.target.value)}
                type="text"
                placeholder={controls.search_bar.placeholder}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
              />
            </div>
            {inputError ? <p className="mt-2 text-sm text-amber-600">{inputError}</p> : null}
          </div>

          <div className="w-full max-w-full lg:max-w-[220px]">
            <label className="block text-sm font-medium text-slate-700">Month</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <i className="bx bx-calendar text-lg text-slate-500" />
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="w-full bg-transparent font-medium outline-none"
              >
                <option>Sep 2024</option>
                <option>Aug 2024</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 lg:w-auto">
            Show
          </button>
        </form>
      </section>

      {showReport ? (
        <>
          <section className="w-full max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{main_content.card_title}</h3>
            <p className="mt-1 text-sm text-slate-500">Performance outlook for the current reporting window.</p>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: main_content.badge.bg_color, color: main_content.badge.text_color }}
          >
            {main_content.badge.label}
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{metrics.total_target.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900" style={{ color: metrics.total_target.color }}>
                  {metrics.total_target.value}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{metrics.expected.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900" style={{ color: metrics.expected.color }}>
                  {metrics.expected.value}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{metrics.achieved.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900" style={{ color: metrics.achieved.color }}>
                  {metrics.achieved.value}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{main_content.progress_bar.min_percentage}</span>
                <span>{main_content.progress_bar.max_percentage}</span>
              </div>
              <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-200">
                {main_content.progress_bar.segments.map((segment) => (
                  <div
                    key={segment.type}
                    className="h-full"
                    style={{ width: `${segment.percentage}%`, backgroundColor: segment.color }}
                    title={segment.label}
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {main_content.progress_bar.segments.map((segment) => (
                  <span key={segment.type} className="flex items-center gap-2 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                    {segment.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-5">
            <div
              className="rounded-2xl border-l-4 bg-slate-100/70 p-4"
              style={{ borderLeftColor: main_content.status_alert.styling.border_left_color, backgroundColor: main_content.status_alert.styling.bg_color }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                  <i className={`bx bx-${main_content.status_alert.icon}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{main_content.status_alert.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{main_content.status_alert.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">PACE STATUS</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">72% Expected</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">CURRENT GAP</p>
                <p className="mt-2 text-xl font-semibold text-amber-600">-70,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

          <section className="w-full max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Representative Breakdown</h3>
                <p className="mt-1 text-sm text-slate-500">A quick view of how the team is tracking against the goal.</p>
              </div>
              <label className="relative block w-full max-w-xs">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <i className="bx bx-search text-base" />
                </span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  type="text"
                  placeholder="Search representatives"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </label>
            </div>

            <div className="grid w-full min-w-0 gap-1 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Representative</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Target</th>
                      <th className="px-4 py-3 font-semibold">Achieved</th>
                      <th className="px-4 py-3 font-semibold">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredRows.length > 0 ? (
                      filteredRows.map((row) => (
                        <tr key={row.name} className="bg-slate-50/40">
                          <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                row.status === 'Ahead'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : row.status === 'On Track'
                                    ? 'bg-sky-50 text-sky-700'
                                    : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{row.target}</td>
                          <td className="px-4 py-3 text-slate-700">{row.achieved}</td>
                          <td className={`px-4 py-3 font-semibold ${row.delta.startsWith('+') ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {row.delta}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-sm text-slate-500">
                          No matches found for your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="w-full max-w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
            <i className="bx bx-bar-chart-alt-2" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No report loaded yet</h3>
          <p className="mt-2 text-sm text-slate-500">Enter a staff ID, choose the month, and click Show to load the performance data.</p>
        </section>
      )}
    </div>
  );
}
