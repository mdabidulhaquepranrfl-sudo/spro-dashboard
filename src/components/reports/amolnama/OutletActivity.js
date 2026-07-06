'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const DEFAULT_OUTLET_ACTIVITY = [
  { label: 'CREATED', value: '0', bg: 'bg-sky-100', border: 'border-sky-300', text: 'text-sky-800' },
  { label: 'UPDATED', value: '0', bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800' },
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
  }, [staffId, startDate, endDate]);

  return (
    <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Outlet Activity</h3>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: DEFAULT_OUTLET_ACTIVITY.length }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-2 h-8 w-16 animate-pulse rounded-full bg-slate-200" />
            </div>
          ))
        ) : (
          outletActivity.map((item) => (
            <div key={item.label} className={`rounded-3xl border ${item.border} ${item.bg} p-5 shadow-sm`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${item.text}`}>{item.label}</p>
              <p className={`mt-2 text-3xl font-extrabold ${item.text}`}>{item.value}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
