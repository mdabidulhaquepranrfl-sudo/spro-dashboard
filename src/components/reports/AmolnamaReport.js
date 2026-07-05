'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';
import SearchableStaffInput from '@/components/profile/SearchableStaffInput';
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

const DAILY_SUMMARY_METRICS = [
  { key: 'activity_days', label: 'ACTIVITY DAY', value: '0', icon: 'calendar', theme: { icon_bg: '#E0E7FF', icon_color: '#312E81', label_color: '#1E3A8A', value_color: '#1E40AF' } },
  { key: 'avg_first_act', label: 'FIRST ACTIVITY', value: '—', icon: 'clock', theme: { icon_bg: '#FDE68A', icon_color: '#9A2C00', label_color: '#92400E', value_color: '#7C2D12' } },
  { key: 'avg_last_act', label: 'LAST ACTIVITY', value: '—', icon: 'clock', theme: { icon_bg: '#FDE68A', icon_color: '#9A2C00', label_color: '#92400E', value_color: '#7C2D12' } },
  { key: 'retail_activity', label: 'TOTAL RETAIL ACT', value: '0', icon: 'briefcase', theme: { icon_bg: '#D1FAE5', icon_color: '#047857', label_color: '#047857', value_color: '#065F46' } },
  { key: 'average_activity', label: 'AVG RETAIL ACT', value: '0', icon: 'briefcase', theme: { icon_bg: '#FDE68A', icon_color: '#9A2C00', label_color: '#92400E', value_color: '#7C2D12' } },
  { key: 'other_activities', label: 'OTHER ACTIVITIES', value: '0', icon: 'calendar_check', theme: { icon_bg: '#BAE6FD', icon_color: '#075985', label_color: '#075985', value_color: '#0C4A6E' } },
  { key: 'avg_tts', label: 'AVG TTS', value: '00:00:00', icon: 'clock', theme: { icon_bg: '#FECACA', icon_color: '#B91C1C', label_color: '#991B1B', value_color: '#7F1D1D' } },
  { key: 'daily_tts', label: 'DAILY TTS', value: '00:00:00', icon: 'clock', theme: { icon_bg: '#DDD6FE', icon_color: '#6D28D9', label_color: '#5B21B6', value_color: '#4C1D95' } },
];

const VISITED_SUMMARY_METRICS = [
  { key: 'total_outlet', label: 'TOTAL OUTLETS', value: '0', icon: 'shopping_bag', theme: { icon_bg: '#F8FAFC', icon_color: '#111827', label_color: '#0F172A', value_color: '#0F172A' } },
  { key: 'total_visits', label: 'TOTAL VISITS', value: '0', icon: 'person', theme: { icon_bg: '#D1FAE5', icon_color: '#166534', label_color: '#166534', value_color: '#14532D' } },
  { key: 'unique_visits', label: 'UNIQUE VISITS', value: '0', icon: 'location_pin', theme: { icon_bg: '#DBEAFE', icon_color: '#1D4ED8', label_color: '#1D4ED8', value_color: '#1E40AF' } },
  { key: 'visit_coverage_pct', label: 'VISIT COVERAGE', value: '0', icon: 'map', theme: { icon_bg: '#FFEDD5', icon_color: '#9A2C00', label_color: '#9A3412', value_color: '#7C2D12' } },
  { key: 'total_order_count', label: 'NO. OF ORDERS', value: '0', icon: 'shopping_cart', theme: { icon_bg: '#FECACA', icon_color: '#BE123C', label_color: '#9F1239', value_color: '#881337' } },
  { key: 'order_value_k', label: 'ORDER VALUE', value: '0', icon: 'dollar_sign', theme: { icon_bg: '#D1FAE5', icon_color: '#065F46', label_color: '#065F46', value_color: '#064E3B' } },
  { key: 'delivery_amount_k', label: 'DEL. AMOUNT', value: '0', icon: 'delivery_truck', theme: { icon_bg: '#BAE6FD', icon_color: '#075985', label_color: '#075985', value_color: '#0C4A6E' } },
  { key: 'lpc', label: 'LPC', value: '0', icon: 'bar_chart', theme: { icon_bg: '#DDD6FE', icon_color: '#6D28D9', label_color: '#5B21B6', value_color: '#4C1D95' } },
  { key: 'nd', label: 'ND', value: '0', icon: 'calendar_cross', theme: { icon_bg: '#FECACA', icon_color: '#B91C1C', label_color: '#B91C1C', value_color: '#991B1B' } },
];

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
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [dailyMetrics, setDailyMetrics] = useState(DAILY_SUMMARY_METRICS);
  const [visitedMetrics, setVisitedMetrics] = useState(VISITED_SUMMARY_METRICS);
  const [isDailyLoading, setIsDailyLoading] = useState(false);
  const [isVisitedLoading, setIsVisitedLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    staffId: '',
    startDate: '',
    endDate: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const formattedStartDate = formatDisplayDate(startDate);
  const formattedEndDate = formatDisplayDate(endDate);
  const selectedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
  const reportHeading = `Insights for ${searchParams.staffId || '—'} ${employeeName}`;

  useEffect(() => {
    if (!hasSearched || !searchParams.staffId) return;

    // Daily Summary
    async function fetchDailySummary() {
      setIsDailyLoading(true);
      try {
        const response = await getReportData('daily-summary', `staff_id=${searchParams.staffId}&zone_id=&start_date=${searchParams.startDate}&end_date=${searchParams.endDate}`);
        const data = response?.data || {};
        setEmployeeName(data?.stuff_name || '');

        setDailyMetrics(
          DAILY_SUMMARY_METRICS.map((item) => ({
            ...item,
            value: data[item.key] ?? '_',
          }))
        );
      } catch (error) { }
      finally { setIsDailyLoading(false); }
    }
    fetchDailySummary();

    // Visited Summary
    async function fetchVisitedSummary() {
      setIsVisitedLoading(true);
      try {
        const response = await getReportData('visited-summary', `staff_id=${searchParams.staffId}&zone_id=&start_date=${searchParams.startDate}&end_date=${searchParams.endDate}`);
        const data = response?.data || {};
        setVisitedMetrics(
          VISITED_SUMMARY_METRICS.map((item) => {
            return { ...item, value: data[item.key] ?? '_' };
          })
        );
      } catch (error) {
        console.error('Visited summary fetch error:', error);
      } finally { setIsVisitedLoading(false); }
    }
    fetchVisitedSummary();
  }, [hasSearched, searchParams, refreshKey]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (!employeeId.trim() || !startDate || !endDate) {
      setSearchError('Please enter employee ID and both dates to load the report.');
      setHasSearched(false);
      return;
    }

    setSearchError('');
    setSearchParams({
      staffId: employeeId,
      startDate: startDate,
      endDate: endDate,
    });
    setHasSearched(true);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      <section className="w-full max-w-full overflow-visible rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
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
            <SearchableStaffInput
              value={employeeId}
              onChange={setEmployeeId}
              placeholder="Enter employee ID"
              disabled={false}
            />
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
              {/* Daily Summary */}
              <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-3 py-2 sm:px-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Daily Summary</p>
                    </div>
                    <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: '#E0E7FF', color: '#2563EB' }}>
                      FIELD PERFORMANCE
                    </span>
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {isDailyLoading
                      ? DAILY_SUMMARY_METRICS.map((_, i) => (
                          <div key={i} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm animate-pulse">
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-2xl bg-slate-200 flex-shrink-0" />
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
                                <div className="h-5 w-1/2 rounded-full bg-slate-200" />
                              </div>
                            </div>
                          </div>
                        ))
                      : dailyMetrics.map((metric) => (
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
                        ))
                    }
                  </div>
                </div>
              </section>

              {/* Visited Summary */}
              <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-3 py-2 sm:px-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Visited Summary</p>
                    </div>
                    <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: '#E0E7FF', color: '#2563EB' }}>
                      OUTLET PERFORMANCE
                    </span>
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {isVisitedLoading
                      ? VISITED_SUMMARY_METRICS.map((_, i) => (
                          <div key={i} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm animate-pulse">
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-9 rounded-2xl bg-slate-200 flex-shrink-0" />
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
                                <div className="h-5 w-1/2 rounded-full bg-slate-200" />
                              </div>
                            </div>
                          </div>
                        ))
                      : visitedMetrics.map((metric) => (
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
                        ))
                    }
                  </div>
                </div>
              </section>
            </div>

            <StepCount key={`step-${refreshKey}`} staffId={searchParams.staffId} startDate={searchParams.startDate} endDate={searchParams.endDate} />
          </div>

          <PerformanceAndKPI key={`kpi-${refreshKey}`} staffId={searchParams.staffId} startDate={searchParams.startDate} endDate={searchParams.endDate} />
          <CoWorkReport key={`cowork-${refreshKey}`} staffId={searchParams.staffId} startDate={searchParams.startDate} endDate={searchParams.endDate} />
          <FieldOperationsSnapshot key={`field-${refreshKey}`} staffId={searchParams.staffId} startDate={searchParams.startDate} endDate={searchParams.endDate} />
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
