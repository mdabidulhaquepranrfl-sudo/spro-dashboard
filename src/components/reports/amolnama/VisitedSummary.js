'use client';
import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const VISITED_SUMMARY_METRICS = [
  { key: 'total_outlet', label: 'TOTAL OUTLETS', value: '0', icon: 'shopping_bag', theme: {} },
  { key: 'total_visits', label: 'TOTAL VISITS', value: '0', icon: 'person', theme: {} },
  { key: 'unique_visits', label: 'UNIQUE VISITS', value: '0', icon: 'location_pin', theme: {} },
  { key: 'visit_coverage_pct', label: 'VISIT COVERAGE', value: '0', icon: 'map', theme: {} },
  { key: 'total_order_count', label: 'NO. OF ORDERS', value: '0', icon: 'shopping_cart', theme: {} },
  { key: 'order_value_k', label: 'ORDER VALUE', value: '0', icon: 'dollar_sign', theme: {} },
  { key: 'delivery_amount_k', label: 'DEL. AMOUNT', value: '0', icon: 'delivery_truck', theme: {} },
  { key: 'lpc', label: 'LPC', value: '0', icon: 'bar_chart', theme: {} },
  { key: 'nd', label: 'ND', value: '0', icon: 'calendar_cross', theme: {} },
];

const DEFAULT_CARD_THEME = {
  icon_bg: '#F8FAFC',
  icon_color: '#0F172A',
  label_color: '#0F172A',
  value_color: '#0F172A',
};

const SUCCESS_CARD_THEME = {
  icon_bg: '#DCFCE7',
  icon_color: '#047857',
  label_color: '#166534',
  value_color: '#166534',
};

const DANGER_CARD_THEME = {
  icon_bg: '#FEE2E2',
  icon_color: '#B91C1C',
  label_color: '#B91C1C',
  value_color: '#B91C1C',
};

function parseMetricValue(rawValue) {
  if (rawValue === undefined || rawValue === null) return null;
  const numeric = Number(String(rawValue).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(numeric) ? null : numeric;
}

function getVisitedMetricTheme(metric) {
  const value = parseMetricValue(metric.value);
  const positiveKeys = ['total_visits', 'unique_visits', 'total_order_count', 'order_value_k', 'delivery_amount_k'];

  if (metric.key === 'visit_coverage_pct') {
    if (value === null) return DEFAULT_CARD_THEME;
    if (value >= 75) return SUCCESS_CARD_THEME;
    return DANGER_CARD_THEME;
  }

  if (metric.key === 'nd') {
    return value > 0 ? DANGER_CARD_THEME : DEFAULT_CARD_THEME;
  }

  if (positiveKeys.includes(metric.key)) {
    return value > 0 ? SUCCESS_CARD_THEME : DEFAULT_CARD_THEME;
  }

  return DEFAULT_CARD_THEME;
}

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

export default function VisitedSummary({ searchParams }) {

  const [visitedMetrics, setVisitedMetrics] = useState(VISITED_SUMMARY_METRICS);
  const [isVisitedLoading, setIsVisitedLoading] = useState(true);
  useEffect(() => {
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
  }, [searchParams]);

  return (
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
        <div className="flex flex-wrap gap-2">
          {isVisitedLoading
            ? VISITED_SUMMARY_METRICS.map((_, i) => (
              <div
                key={i}
                className="min-w-[110px] flex-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm animate-pulse"
              >
                <div className="flex items-start">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
                    <div className="h-5 w-1/2 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))
            : visitedMetrics.map((metric) => {
              const theme = getVisitedMetricTheme(metric);
              return (
                <div
                  key={metric.label}
                  className="min-w-[110px] w-fit flex-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start">
                    {/*
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-2xl flex-shrink-0"
                      style={{
                        backgroundColor: theme.icon_bg,
                        color: theme.icon_color,
                      }}
                    >
                      <i
                        className={`bx ${SUMMARY_ICON_MAP[metric.icon] ?? 'bx-stats'
                          } text-base`}
                      />
                    </div>
                    */}

                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[9px] font-semibold uppercase tracking-[0.22em] whitespace-wrap"
                        style={{
                          color: theme.label_color,
                        }}
                      >
                        {metric.label}
                      </p>

                      <p
                        className="mt-1 text-lg font-extrabold break-words"
                        style={{
                          color: theme.value_color,
                        }}
                      >
                        {metric.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}