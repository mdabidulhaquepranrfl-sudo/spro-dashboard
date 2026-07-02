'use client';

import { useEffect, useState } from 'react';
// import { getReportData } from '@/lib/getReportData';
import StepCount from './amolnama/StepCount';
import PerformanceAndKPI from './amolnama/PerformanceAndKPI';
import CoWorkReport from './amolnama/CoWorkReport';
import FieldOperationsSnapshot from './amolnama/FieldOperationsSnapshot';

const SUMMARY_ICON_MAP = {
  calendar: 'bx-calendar',
  clock: 'bx-time-five',
  briefcase: 'bx-briefcase',
  calendar_check: 'bx-calendar-check',
  map: 'bx-map',
  shopping_bag: 'bx-shopping-bag',
  person: 'bx-user',
  location_pin: 'bx-map-pin',
  shopping_cart: 'bx-cart',
  dollar_sign: 'bx-dollar',
  delivery_truck: 'bx-truck',
  bar_chart: 'bx-bar-chart-alt-2',
  calendar_cross: 'bx-calendar-x',
};

const DASHBOARD_LAYOUT = {
  left_column: {
    sections: [
      {
        id: 'daily_summary',
        title: 'Daily Summary',
        badge: {
          label: 'FIELD PERFORMANCE',
          bg_color: '#E0E7FF',
          text_color: '#2563EB',
        },
        metrics: [
          { label: 'ACTIVITY DAY', value: '0', icon: 'calendar', theme: { icon_bg: '#EEF2FF', icon_color: '#3730A3', label_color: '#1E3A8A', value_color: '#1E40AF' } },
          { label: 'FIRST / LAST ACTIVITY', value: '—', icon: 'clock', theme: { icon_bg: '#FEF3C7', icon_color: '#B45309', label_color: '#92400E', value_color: '#7C2D12' } },
          { label: 'TOTAL RETAIL ACT', value: '0', icon: 'briefcase', theme: { icon_bg: '#ECFDF5', icon_color: '#059669', label_color: '#047857', value_color: '#065F46' } },
          { label: 'AVG RETAIL ACT', value: '0', icon: 'briefcase', theme: { icon_bg: '#FDE68A', icon_color: '#B45309', label_color: '#92400E', value_color: '#7C2D12' } },
          { label: 'OTHER ACTIVITIES', value: '0', icon: 'calendar_check', theme: { icon_bg: '#E0F2FE', icon_color: '#0369A1', label_color: '#075985', value_color: '#0C4A6E' } },
          { label: 'AVG TTS', value: '00:00:00', icon: 'clock', theme: { icon_bg: '#FEE2E2', icon_color: '#DC2626', label_color: '#991B1B', value_color: '#7F1D1D' } },
          { label: 'DAILY TTS', value: '00:00:00', icon: 'clock', theme: { icon_bg: '#EDE9FE', icon_color: '#7C3AED', label_color: '#5B21B6', value_color: '#4C1D95' } },
        ],
      },
      {
        id: 'visited_summary',
        title: 'Visited Summary',
        badge: {
          label: 'OUTLET PERFORMANCE',
          bg_color: '#E0E7FF',
          text_color: '#2563EB',
        },
        metrics: [
          { label: 'TOTAL OUTLETS', value: '0', icon: 'shopping_bag', theme: { icon_bg: '#F8FAFC', icon_color: '#0F172A', label_color: '#0F172A', value_color: '#0F172A' } },
          { label: 'TOTAL VISITS', value: '0', icon: 'person', theme: { icon_bg: '#ECFDF5', icon_color: '#15803D', label_color: '#166534', value_color: '#14532D' } },
          { label: 'UNIQUE VISITS', value: '0', icon: 'location_pin', theme: { icon_bg: '#EFF6FF', icon_color: '#2563EB', label_color: '#1D4ED8', value_color: '#1E40AF' } },
          { label: 'VISIT COVERAGE', value: '0', icon: 'map', theme: { icon_bg: '#FFF7ED', icon_color: '#C2410C', label_color: '#9A3412', value_color: '#7C2D12' } },
          { label: 'NO. OF ORDERS', value: '0', icon: 'shopping_cart', theme: { icon_bg: '#FEE2E2', icon_color: '#BE123C', label_color: '#9F1239', value_color: '#881337' } },
          { label: 'ORDER VALUE', value: '0', icon: 'dollar_sign', theme: { icon_bg: '#ECFDF5', icon_color: '#047857', label_color: '#065F46', value_color: '#064E3B' } },
          { label: 'DEL. AMOUNT', value: '0', icon: 'delivery_truck', theme: { icon_bg: '#E0F2FE', icon_color: '#0369A1', label_color: '#075985', value_color: '#0C4A6E' } },
          { label: 'LPC', value: '0', icon: 'bar_chart', theme: { icon_bg: '#EDE9FE', icon_color: '#7C3AED', label_color: '#5B21B6', value_color: '#4C1D95' } },
          { label: 'ND', value: '0', icon: 'calendar_cross', theme: { icon_bg: '#FEE2E2', icon_color: '#DC2626', label_color: '#B91C1C', value_color: '#991B1B' } },
        ],
      },
    ],
  },
};

const formatDisplayDate = (value) => {
  if (!value) return '';

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

export default function AmolnamaPage() {
  const [employeeId, setEmployeeId] = useState('397921');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [dashboardLayout, setDashboardLayout] = useState(DASHBOARD_LAYOUT);

  const formattedStartDate = formatDisplayDate(startDate);
  const formattedEndDate = formatDisplayDate(endDate);
  const selectedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
  const reportHeading = `Insights for ${employeeId || '—'} - MIS-Dev-Shobuj Mia`;

  useEffect(() => {
    if (!hasSearched) return;

    // API calls — uncomment when ready to integrate

    // Daily Summary
    // async function fetchDailySummary() {
    //   try {
    //     const data = await getReportData('dailySummary', `country_id=&staff_id=${employeeId}&zone_id=&start_date=${startDate}&end_date=${endDate}`);
    //     // TODO: set daily summary metrics from API response
    //   } catch (error) {
    //     console.error('Daily summary fetch error:', error);
    //   }
    // }
    // fetchDailySummary();

    // Visited Summary
    // async function fetchVisitedSummary() {
    //   try {
    //     const data = await getReportData('visitedSummary', `country_id=&staff_id=${employeeId}&zone_id=&start_date=${startDate}&end_date=${endDate}`);
    //     // TODO: set visited summary metrics from API response
    //   } catch (error) {
    //     console.error('Visited summary fetch error:', error);
    //   }
    // }
    // fetchVisitedSummary();
  }, [hasSearched, employeeId, startDate, endDate]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (!employeeId.trim() || !startDate || !endDate) {
      setSearchError('Please enter employee ID and both dates to load the report.');
      setHasSearched(false);
      return;
    }

    setSearchError('');
    setHasSearched(true);
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Amolnama Report</p> */}
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Supervisor Performance Ledger {reportHeading}</h2>
            {/* <p className="mt-2 max-w-2xl break-words text-sm text-slate-500">{reportHeading}</p> */}
          </div>
        </div>

        <form className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-[1.2fr_1fr_1fr_auto]" onSubmit={handleSearch}>
          <div>
            {/* <label className="mb-2 block text-sm font-medium text-slate-700">Employee ID</label> */}
            <input type="text" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:bg-white" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} placeholder="Enter employee ID" />
          </div>
          <div>
            {/* <label className="mb-2 block text-sm font-medium text-slate-700">Start date</label> */}
            <input type="date" placeholder="From Date" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:bg-white" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div>
            {/* <label className="mb-2 block text-sm font-medium text-slate-700">End date</label> */}
            <input type="date" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:bg-white" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700">Search</button>
          </div>
          {searchError ? <div className="md:col-span-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{searchError}</div> : null}
        </form>
      </section>

      {hasSearched ? (
        <div className="w-full min-w-0 space-y-4">

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <div className="grid gap-4">
              {dashboardLayout.left_column.sections.map((section) => (
                <section key={section.id} className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-3 py-2 sm:px-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">{section.title}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600" style={{ backgroundColor: section.badge.bg_color, color: section.badge.text_color }}>
                        {section.badge.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                      {section.metrics.map((metric) => (
                        <div key={metric.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ backgroundColor: metric.theme?.icon_bg ?? '#F8FAFC', color: metric.theme?.icon_color ?? '#0F172A' }}>
                              <i className={`bx ${SUMMARY_ICON_MAP[metric.icon] ?? 'bx-stats'} text-base`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: metric.theme?.label_color ?? '#475569' }}>{metric.label}</p>
                              <p className="mt-1 text-lg font-extrabold break-words" style={{ color: metric.theme?.value_color ?? '#0f172a' }}>{metric.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <StepCount />
          </div>

          <PerformanceAndKPI />
          <CoWorkReport />
          <FieldOperationsSnapshot />
        </div>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">🔎</div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No report data loaded yet</h3>
          <p className="mt-2 text-sm text-slate-500">Enter the employee ID and date range above and click Search to load the dashboard.</p>
        </section>
      )}
    </div>
  );
}
