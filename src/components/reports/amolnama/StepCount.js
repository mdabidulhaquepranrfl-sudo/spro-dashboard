'use client';

import { useEffect, useState } from 'react';
// import { getReportData } from '@/lib/getReportData';

const STEP_COUNT_CONFIG = {
  title: 'Step Count',
  badge: {
    label: 'STEP PERFORMANCE',
    bg_color: '#FCE7F3',
    text_color: '#DB2777',
  },
  y_axis: {
    min: 0,
    max: 3500,
    step: 500,
  },
};

const DEFAULT_STEP_DATA = [
  { date: '06-29', steps: 0, bar_color: '#3498DB' },
  { date: '06-30', steps: 0, bar_color: '#3498DB' },
  { date: '07-01', steps: 0, bar_color: '#3498DB' },
];

export default function StepCount() {
  const [stepData, setStepData] = useState(DEFAULT_STEP_DATA);
  const [yAxisMax, setYAxisMax] = useState(STEP_COUNT_CONFIG.y_axis.max);

  useEffect(() => {
    // API call — uncomment when ready to integrate
    // async function fetchStepCount() {
    //   try {
    //     const data = await getReportData('step-count/summary', '');
    //     // TODO: set stepData and yAxisMax from API response
    //     // setStepData(data.x_axis_data);
    //     // setYAxisMax(data.y_axis?.max || 3500);
    //   } catch (error) {
    //     console.error('Step count fetch error:', error);
    //   }
    // }
    // fetchStepCount();
  }, []);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600">{STEP_COUNT_CONFIG.title}</p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: STEP_COUNT_CONFIG.badge.bg_color, color: STEP_COUNT_CONFIG.badge.text_color }}>
          {STEP_COUNT_CONFIG.badge.label}
        </span>
      </div>
      <div className="mt-6 space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Steps</span>
            <span>{yAxisMax}</span>
          </div>
          <div className="mt-4 flex items-end gap-3 h-56">
            {stepData.map((point) => {
              const height = Math.max((point.steps / yAxisMax) * 100, 4);
              return (
                <div key={point.date} className="flex-1 text-center">
                  <div className="relative mx-auto h-48 w-full overflow-hidden rounded-3xl bg-slate-100">
                    <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl" style={{ height: `${height}%`, backgroundColor: point.bar_color }} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{point.date}</p>
                  <p className="text-xs text-slate-500">{point.steps}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
