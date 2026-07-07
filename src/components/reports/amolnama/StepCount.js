'use client';

import { useEffect, useMemo, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const STEP_COUNT_CONFIG = {
  title: 'Step Count',
  badge: {
    label: 'STEP PERFORMANCE',
    bg_color: '#FCE7F3',
    text_color: '#000000',
  },
};

const DEFAULT_STEP_DATA = [{ label: 'No Data', steps: 0, bar_color: '#2563EB' }];
const BAR_COLORS = ['#2563EB', '#2563EB', '#2563EB', '#2563EB', '#2563EB'];

function getDateRange(startDate, endDate) {
  if (!startDate || !endDate) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const dates = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' }).format(date);
}

export default function StepCount({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [stepData, setStepData] = useState(DEFAULT_STEP_DATA);
  const [yAxisMax, setYAxisMax] = useState(20000);
  const [isLoading, setIsLoading] = useState(Boolean(staffId && startDate && endDate));

  useEffect(() => {
    if (!staffId) return;

    async function fetchStepCount() {
      setIsLoading(true);
      try {
        const response = await getReportData(
          'step-count-summary',
          `aemp_id=${staffId}&start_date=${startDate}&end_date=${endDate}`
        );

        const items = Array.isArray(response?.data) ? response.data : [];

        if (items.length) {
          const normalized = items.map((item, index) => {
            const steps = Number(item?.total_steps || 0);
            const date = item?.date ? new Date(item.date) : null;

            return {
              label: date && !Number.isNaN(date.getTime()) ? formatDateLabel(date) : 'N/A',
              steps: Math.max(0, steps),
              bar_color: BAR_COLORS[index % BAR_COLORS.length],
              date: item?.date || '',
            };
          });

          setStepData(normalized);
          const maxValue = Math.max(...normalized.map((item) => item.steps));
          const roundedMax = Math.max(1000, Math.ceil(maxValue / 1000) * 1000);
          setYAxisMax(roundedMax);
        } else {
          setStepData(DEFAULT_STEP_DATA);
          setYAxisMax(20000);
        }
      } catch (error) {
        console.error('Step count fetch error:', error);
        setStepData(DEFAULT_STEP_DATA);
        setYAxisMax(20000);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStepCount();
  }, [searchParams]);

  const yTicks = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => Math.round(yAxisMax - (yAxisMax / 4) * index));
  }, [yAxisMax]);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600">{STEP_COUNT_CONFIG.title}</p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: STEP_COUNT_CONFIG.badge.bg_color, color: STEP_COUNT_CONFIG.badge.text_color }}>
          {STEP_COUNT_CONFIG.badge.label}
        </span>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-1">
        {isLoading ? (
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex h-[240px] min-w-[300px] items-end gap-2 sm:h-[280px] sm:gap-3">
              <div className="flex h-full w-7 shrink-0 flex-col justify-between pr-1 text-[8px] text-slate-500 sm:w-8">
                {yTicks.map((tick) => (
                  <div key={tick} className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
                ))}
              </div>

              <div className="flex flex-1 items-end gap-[2px] border-l border-slate-200 pl-1 sm:gap-1 sm:pl-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex min-w-[20px] flex-1 flex-col items-center justify-end">
                    <div className="relative flex h-44 w-full items-end justify-center rounded-none bg-white/70 px-0.5 py-1 shadow-inner sm:h-56 sm:px-1">
                      <div className="h-[55%] w-[85%] animate-pulse bg-slate-300" />
                    </div>
                    <div className="mt-2 h-2.5 w-full animate-pulse rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex h-[240px] min-w-[300px] items-end gap-2 sm:h-[280px] sm:gap-3">
                <div className="flex h-full w-7 shrink-0 flex-col justify-between pr-1 text-[8px] font-medium text-slate-500 sm:w-8">
                  {yTicks.map((tick) => (
                    <span key={tick}>{tick.toLocaleString()}</span>
                  ))}
                </div>

                <div className="flex flex-1 items-end gap-[2px] border-l border-slate-200 pl-1 sm:gap-1 sm:pl-2">
                  {stepData.map((point) => {
                    const height = point.steps === 0 ? 8 : Math.max((point.steps / yAxisMax) * 100, 10);
                    return (
                      <div key={`${point.label}-${point.steps}`} className="group flex min-w-[20px] flex-1 flex-col items-center justify-end">
                        <div className="relative flex h-44 w-full items-end justify-center rounded-none bg-white/70 px-0.5 py-1 shadow-inner sm:h-56 sm:px-1">
                          <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-md border border-slate-200 bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-sm transition group-hover:opacity-100">
                            {point.steps.toLocaleString()}
                          </div>
                          <div className="w-[85%] min-h-[8px] border border-white/40 shadow-sm transition-all duration-300"
                            style={{ height: `${height}%`, backgroundColor: point.bar_color }}
                          />
                        </div>
                        <p className="mt-1.5 flex h-8 items-center justify-center text-center text-[8px] font-semibold leading-none text-slate-600 sm:mt-2 sm:h-9 sm:text-[9px]"
                          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                          {point.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-2 ml-7 border-t border-slate-200 pt-2 text-center text-[9px] font-medium uppercase tracking-[0.25em] text-slate-400 sm:ml-8">
              Day / Month
            </div>
          </>
        )}
      </div>
    </section>
  );
}
