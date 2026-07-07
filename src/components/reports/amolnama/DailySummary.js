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
  { key: 'activity_days', label: 'ACTIVITY DAY', value: '0', icon: 'calendar', theme: {} },
  { key: 'avg_first_act', label: 'FIRST ACTIVITY', value: '—', icon: 'clock', theme: {} },
  { key: 'avg_last_act', label: 'LAST ACTIVITY', value: '—', icon: 'clock', theme: {} },
  { key: 'retail_activity', label: 'TOTAL RETAIL ACT', value: '0', icon: 'briefcase', theme: {} },
  { key: 'average_activity', label: 'AVG RETAIL ACT', value: '0', icon: 'briefcase', theme: {} },
  { key: 'other_activities', label: 'OTHER ACTIVITIES', value: '0', icon: 'calendar_check', theme: {} },
  { key: 'avg_tts', label: 'AVG TTS', value: '00:00:00', icon: 'clock', theme: {} },
  { key: 'daily_tts', label: 'DAILY TTS', value: '00:00:00', icon: 'clock', theme: {} },
];

const DEFAULT_CARD_THEME = {
  icon_bg: '#F8FAFC',
  icon_color: '#0F172A',
  label_color: '#0F172A',
  value_color: '#0F172A',
};

const SUCCESS_CARD_THEME = {
  icon_bg: '#DCFCE7',
  icon_color: '#15803D',
  label_color: '#166534',
  value_color: '#14532D',
};

const DANGER_CARD_THEME = {
  icon_bg: '#FEE2E2',
  icon_color: '#B91C1C',
  label_color: '#991B1B',
  value_color: '#7F1D1D',
};

function parseTimeToMinutes(value) {
  if (!value || typeof value !== 'string') return NaN;
  const parts = value.split(':').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return NaN;
  return parts[0] * 60 + parts[1] + parts[2] / 60;
}

function getDailyMetricTheme(metric) {
  const value = String(metric.value ?? '').trim();
  const numericValue = Number(value.replace(/[^0-9.]/g, ''));

  if (metric.key === 'avg_tts') {
    const minutes = parseTimeToMinutes(value);
    if (!Number.isNaN(minutes)) {
      return minutes > 0 && minutes < 5 ? DANGER_CARD_THEME : SUCCESS_CARD_THEME;
    }
    return DEFAULT_CARD_THEME;
  }

  if (['retail_activity', 'average_activity'].includes(metric.key)) {
    return Number.isNaN(numericValue) ? DEFAULT_CARD_THEME : numericValue > 0 ? SUCCESS_CARD_THEME : DEFAULT_CARD_THEME;
  }

  return DEFAULT_CARD_THEME;
}

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
        <div className="flex flex-wrap gap-2">
          {isDailyLoading
            ? DAILY_SUMMARY_METRICS.map((_, i) => (
              <div key={i} className="min-w-[180px] flex-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm animate-pulse">
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
              <div key={metric.label} className="min-w-[170px] lg:min-w-[140px] xl:min-w-[150px] w-fit flex-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-2">
                  {(() => {
                    const theme = getDailyMetricTheme(metric);
                    return (
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-2xl flex-shrink-0"
                        style={{ backgroundColor: theme.icon_bg, color: theme.icon_color }}
                      >
                        <i className={`bx ${SUMMARY_ICON_MAP[metric.icon] ?? 'bx-stats'} text-base`} />
                      </div>
                    );
                  })()}
                  <div className="min-w-0">
                    {(() => {
                      const theme = getDailyMetricTheme(metric);
                      return (
                        <>
                          <p
                            className="text-[9px] font-semibold uppercase tracking-[0.22em] whitespace-wrap"
                            style={{ color: theme.label_color }}
                          >
                            {metric.label}
                          </p>

                          <p className="mt-1 text-lg font-extrabold break-words"
                            style={{ color: theme.value_color }}
                          >
                            {metric.value}
                          </p>
                        </>
                      );
                    })()}
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