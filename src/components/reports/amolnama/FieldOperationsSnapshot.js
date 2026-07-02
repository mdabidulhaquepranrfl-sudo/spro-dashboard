'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const DEFAULT_FIELD_PERFORMANCE = [
  {
    id: 'live_area_coverage',
    title: 'Live Area Coverage',
    icon: 'bx-wifi',
    iconBg: '#ECFDF3',
    iconColor: '#16A34A',
    badge: { label: 'LIVE', bgColor: '#E6F4EA', textColor: '#137333', borderColor: '#CEEAD6' },
    mapConfig: {
      provider: 'Leaflet / OpenStreetMap',
      zoom: 'Street level',
      center: 'Shahjadpur / Badda, Dhaka',
    },
  },
  {
    id: 'key_locations',
    title: 'Key Locations',
    icon: 'bx-map-pin',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    badge: {
      label: 'LAST THREE VISITED SITE',
      bgColor: '#EFF6FF',
      textColor: '#3B82F6',
    },
    locations: [
      { site_name: 'AL ANAS RESTAURANT', last_visited: 'Last visited at 14:58', status_dot_color: '#10B981' },
      { site_name: 'TEST CASH CUST AD rt', last_visited: 'Last visited at 09:15', status_dot_color: '#10B981' },
    ],
  },
];

export default function FieldOperationsSnapshot({ staffId, startDate, endDate }) {
  const [fieldData, setFieldData] = useState(DEFAULT_FIELD_PERFORMANCE);

  useEffect(() => {
    if (!staffId) return;
    // API call — uncommented as requested
    async function fetchFieldOperations() {
      try {
        const data = await getReportData('field-oparation', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        // TODO: set fieldData from API response
        // setFieldData(data);
      } catch (error) {
        console.error('Field operations fetch error:', error);
      }
    }
    fetchFieldOperations();
  }, [staffId, startDate, endDate]);

  return (
    <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Field Operations Snapshot</h3>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">Live overview</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        {fieldData.map((item) => (
          <div key={item.id} className="w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {item.id === 'live_area_coverage' ? (
              <div className="mt-4">
                <div className="relative h-40 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-sky-100 to-slate-50">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_35%)]" />
                  <div className="absolute left-[38%] top-[30%] h-3 w-3 rounded-full bg-sky-600 shadow-[0_0_0_6px_rgba(37,99,235,0.16)]" />
                  <div className="absolute left-[24%] top-[56%] h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(22,163,74,0.14)]" />
                  <div className="absolute left-[66%] top-[40%] h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_0_6px_rgba(220,38,38,0.14)]" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.mapConfig.center}</p>
                <p className="text-sm text-slate-500">Map view is ready for live field updates.</p>
              </div>
            ) : null}

            {item.id === 'key_locations' ? (
              <div className="mt-4 space-y-3">
                {item.locations.map((location) => (
                  <div key={location.site_name} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: location.status_dot_color }} />
                      <p className="font-medium text-slate-900">{location.site_name}</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{location.last_visited}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
