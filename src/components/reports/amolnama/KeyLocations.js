'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const DEFAULT_LOCATIONS = [
  { site_name: 'N/A', last_visited: 'Last visited at ??' },
  { site_name: 'N/A', last_visited: 'Last visited at ??' },
];

export default function KeyLocations({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [isLoading, setIsLoading] = useState(Boolean(staffId && startDate && endDate));

  useEffect(() => {
    if (!staffId || !startDate || !endDate) {
      setLocations(DEFAULT_LOCATIONS);
      setIsLoading(false);
      return;
    }

    let active = true;
    async function fetchKeyLocations() {
      setIsLoading(true);
      try {
        const response = await getReportData('key-locations', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        if (active && response?.status === 'success' && Array.isArray(response.data)) {
          setLocations(
            response.data.map((item) => ({
              site_name: item.site_name || 'Unknown location',
              last_visited: item.time || 'Last visited time unavailable',
            }))
          );
        }
      } catch (error) {
        console.error('KeyLocations fetch error:', error);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchKeyLocations();
    return () => {
      active = false;
    };
  }, [staffId, startDate, endDate]);

  return (
    <section>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-slate-900">Key Locations</h4>
          </div>
          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
            Last three visited site
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl bg-white p-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))
          ) : (
            locations.map((location, index) => (
              <div key={`${location.site_name}-${index}`} className="rounded-2xl bg-white p-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="font-medium text-slate-900">{location.site_name}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">{location.last_visited}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
