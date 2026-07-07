'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const DEFAULT_OUTLET_ACTIVITY = [
  { label: 'CREATED', value: '0', bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800' },
  { label: 'UPDATED', value: '0', bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-900' },
  { label: 'DELETED', value: '0', bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-800' },
];

export default function OutletActivity({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [outletActivity, setOutletActivity] = useState(DEFAULT_OUTLET_ACTIVITY);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!staffId) return;

    async function fetchOutletActivity() {
      setIsLoading(true);
      try {
        const response = await getReportData('outlet-activity', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        const activityData = response?.data ?? {};
        const mapped = DEFAULT_OUTLET_ACTIVITY.map((item) => ({
          ...item,
          value: String(activityData[item.label.toLowerCase()] ?? 0),
        }));
        setOutletActivity(mapped);
      } catch (error) {
        console.error('Outlet activity fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOutletActivity();
  }, [searchParams]);

  return (
    <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Outlet Activity</h3>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: DEFAULT_OUTLET_ACTIVITY.length }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <div className="h-2.5 w-16 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-2 h-6 w-12 animate-pulse rounded-full bg-slate-200" />
            </div>
          ))
        ) : (
          outletActivity.map((item) => (
            <div key={item.label} className={`rounded-2xl border ${item.border} ${item.bg} p-3 shadow-sm`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${item.text}`}>{item.label}</p>
              <p className={`mt-1 text-2xl font-extrabold leading-none ${item.text}`}>{item.value}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}