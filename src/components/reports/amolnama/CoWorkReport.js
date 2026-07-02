'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const CO_WORK_CONFIG = {
  title: 'Co-Work Report',
  badge: {
    label: 'TEAM COLLABORATION',
    bg_color: '#EFF6FF',
    text_color: '#3B82F6',
  },
  headers: [
    { id: 'sl', label: 'SL', align: 'left' },
    { id: 'co_work_date', label: 'CO-WORK\nDATE', align: 'left' },
    { id: 'last_week_date', label: 'LAST WEEK\nDATE', align: 'left' },
    { id: 'co_worker_sr_id', label: 'CO-WORKER /\nSR ID', align: 'left' },
    { id: 'co_worker_sr_name', label: 'CO-WORKER /\nSR NAME', align: 'left' },
    { id: 'co_work_visit', label: 'CO-WORK\nVISIT', align: 'left' },
    { id: 'last_week_visit', label: 'LAST WEEK\nVISIT', align: 'left' },
    { id: 'co_work_order', label: 'CO-WORK\nORDER', align: 'left' },
    { id: 'last_week_order', label: 'LAST WEEK\nORDER', align: 'left' },
  ],
  styling: {
    border_color: '#F3F4F6',
    header_text_color: '#1F2937',
    header_font_weight: 'bold',
  },
  empty_state: {
    message: 'No co-work activity found',
    text_color: '#000000',
    padding: 'py-6',
  },
};

const DEFAULT_ROWS = [
  {
    sl: 1,
    co_work_date: '2026-06-29',
    last_week_date: '2026-06-22',
    co_worker_sr_id: 'SR-123',
    co_worker_sr_name: 'Shobuj Mia',
    co_work_visit: '5',
    last_week_visit: '4',
    co_work_order: '15',
    last_week_order: '12',
  },
  {
    sl: 2,
    co_work_date: '2026-06-28',
    last_week_date: '2026-06-21',
    co_worker_sr_id: 'SR-456',
    co_worker_sr_name: 'Amina Rahman',
    co_work_visit: '4',
    last_week_visit: '5',
    co_work_order: '11',
    last_week_order: '13',
  },
  {
    sl: 3,
    co_work_date: '2026-06-27',
    last_week_date: '2026-06-20',
    co_worker_sr_id: 'SR-789',
    co_worker_sr_name: 'Rafiq Hossain',
    co_work_visit: '6',
    last_week_visit: '6',
    co_work_order: '18',
    last_week_order: '17',
  },
];

export default function CoWorkReport({ staffId, startDate, endDate }) {
  const [rows, setRows] = useState(DEFAULT_ROWS);

  useEffect(() => {
    if (!staffId) return;
    // API call — uncommented as requested
    async function fetchCoWorkReport() {
      try {
        const data = await getReportData('co-work-report', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        // TODO: set rows from API response
        // setRows(data.rows || []);
      } catch (error) {
        console.error('Co-work report fetch error:', error);
      }
    }
    fetchCoWorkReport();
  }, [staffId, startDate, endDate]);

  return (
    <div className="grid w-full min-w-0 gap-4">
      <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{CO_WORK_CONFIG.title}</h3>
            <p className="mt-1 text-sm text-slate-500">Collaborative visit performance compared with last week.</p>
          </div>
          <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: CO_WORK_CONFIG.badge.bg_color, color: CO_WORK_CONFIG.badge.text_color }}>
            {CO_WORK_CONFIG.badge.label}
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm" style={{ borderColor: CO_WORK_CONFIG.styling.border_color }}>
            <thead className="bg-slate-50 text-left" style={{ color: CO_WORK_CONFIG.styling.header_text_color, fontWeight: CO_WORK_CONFIG.styling.header_font_weight === 'bold' ? 700 : 400 }}>
              <tr>
                {CO_WORK_CONFIG.headers.map((header) => (
                  <th key={header.id} className="px-3 py-3 align-top whitespace-pre-wrap">
                    {header.label.split('\n').map((line, index) => (
                      <span key={index} className="block leading-tight">
                        {line}
                      </span>
                    ))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.sl} className="bg-slate-50/50">
                    {CO_WORK_CONFIG.headers.map((header) => (
                      <td key={header.id} className="px-3 py-3 align-top text-slate-700">
                        {row[header.id]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={CO_WORK_CONFIG.headers.length} className={`px-3 ${CO_WORK_CONFIG.empty_state.padding} text-center`} style={{ color: CO_WORK_CONFIG.empty_state.text_color }}>
                    {CO_WORK_CONFIG.empty_state.message}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
