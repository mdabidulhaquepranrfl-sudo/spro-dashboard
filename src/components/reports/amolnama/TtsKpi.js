'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const DEFAULT_TTS_DATA = [
  { key: 'gt_1', label: '0 - 1 minute', value: '0' },
  { key: 'gt_2', label: '1 - 2 minutes', value: '0' },
  { key: 'gt_5', label: '2 - 5 minutes', value: '0' },
  { key: 'gt_10', label: '5 - 10 minutes', value: '0' },
];

export default function TtsKpi({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [ttsData, setTtsData] = useState(DEFAULT_TTS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!staffId) return;

    async function fetchTTSKPI() {
      setIsLoading(true);
      try {
        const response = await getReportData('visit-duration-bucket', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        const bucketData = response?.data ?? {};
        const mapped = DEFAULT_TTS_DATA.map((item) => ({
          ...item,
          value: String(bucketData[item.key] ?? 0),
        }));
        setTtsData(mapped);
      } catch (error) {
        console.error('TTS KPI fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTTSKPI();
  }, [staffId, startDate, endDate]);

  return (
    <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">TTS KPI</h3>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">DURATION</th>
              <th className="px-4 py-3 font-semibold">NO. OF OUTLETS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: DEFAULT_TTS_DATA.length }).map((_, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 animate-pulse rounded-full bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : (
              ttsData.map((row) => (
                <tr key={row.key} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{row.label}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
