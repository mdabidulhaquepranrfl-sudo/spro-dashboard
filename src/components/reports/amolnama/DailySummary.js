'use client';
import { useEffect, useMemo, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

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

export default function DailySummary({ searchParams }) {
  const [isDailyLoading, setIsDailyLoading] = useState(true);
  const [dailyMetrics, setDailyMetrics] = useState(DAILY_SUMMARY_METRICS);
  useEffect(() => {
    if (!searchParams.staffId) return;
    async function fetchDailySummary() {
      setIsDailyLoading(true);
      try {
        const response = await getReportData('daily-summary', `staff_id=${searchParams.staffId}&zone_id=&start_date=${searchParams.startDate}&end_date=${searchParams.endDate}`);
        const data = response?.data || {};

        setDailyMetrics(
          DAILY_SUMMARY_METRICS.map((item) => ({
            ...item,
            value: data[item.key] ?? '_',
          }))
        );
      } catch (error) { console.error('Error fetching daily summary:', error); }
      finally { setIsDailyLoading(false); }
    }
    fetchDailySummary();
  }, [searchParams]);

  return (
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
  );
}