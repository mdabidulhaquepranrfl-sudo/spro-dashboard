'use client';

import { useEffect, useMemo, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const PAGE_SIZE = 15;

const CO_WORK_CONFIG = {
  title: 'Co-Work Report',
  badge: {
    // label: 'TEAM COLLABORATION',
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

export default function CoWorkReport({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'sl', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!staffId) return;
    // API call — uncommented as requested
    async function fetchCoWorkReport() {
      setIsLoading(true);
      try {
        const response = await getReportData('co-work-report', `staff_id=${staffId}&start_date=${startDate}&end_date=${endDate}`);
        const dataRows = response?.data?.rows ?? response?.rows ?? [];
        const mappedRows = dataRows.map((row, index) => ({
          ...row,
          sl: index + 1,
        }));
        setRows(mappedRows.length > 0 ? mappedRows : []);
      } catch (error) {
        console.error('Co-work report fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCoWorkReport();
  }, [searchParams]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(query))
    );
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    const data = [...filteredRows];
    if (!sortConfig?.key) return data;

    data.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      const isNumeric = !Number.isNaN(aNum) && !Number.isNaN(bNum);

      if (isNumeric) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      const aText = String(aValue ?? '');
      const bText = String(bValue ?? '');
      return sortConfig.direction === 'asc'
        ? aText.localeCompare(bText, undefined, { sensitivity: 'base' })
        : bText.localeCompare(aText, undefined, { sensitivity: 'base' });
    });

    return data;
  }, [filteredRows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedRows.slice(start, start + PAGE_SIZE);
  }, [sortedRows, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortConfig.key, sortConfig.direction]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="grid w-full min-w-0 gap-4">
      <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{CO_WORK_CONFIG.title}</h3>
          </div>
          <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: CO_WORK_CONFIG.badge.bg_color, color: CO_WORK_CONFIG.badge.text_color }}>
            {CO_WORK_CONFIG.badge.label}
          </span>
                    <div className="relative w-full sm:w-64">
            <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search table"
              className="w-full rounded-full border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            {sortedRows.length > 0 ? `Showing ${Math.min((currentPage - 1) * PAGE_SIZE + 1, sortedRows.length)}-${Math.min(currentPage * PAGE_SIZE, sortedRows.length)} of ${sortedRows.length}` : ''}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm" style={{ borderColor: CO_WORK_CONFIG.styling.border_color }}>
            <thead className="bg-slate-50 text-left" style={{ color: CO_WORK_CONFIG.styling.header_text_color, fontWeight: CO_WORK_CONFIG.styling.header_font_weight === 'bold' ? 700 : 400 }}>
              <tr>
                {CO_WORK_CONFIG.headers.map((header) => (
                  <th key={header.id} className="px-3 py-3 align-top whitespace-pre-wrap">
                    <button
                      type="button"
                      onClick={() => handleSort(header.id)}
                      className="flex items-center gap-1 text-left transition hover:text-slate-900"
                    >
                      <span>{header.label.split('\n').map((line, index) => (
                        <span key={index} className="block leading-tight">
                          {line}
                        </span>
                      ))}</span>
                      <i className={`bx ${sortConfig?.key === header.id ? (sortConfig.direction === 'asc' ? 'bx-sort-up' : 'bx-sort-down') : 'bx-sort'}`} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="bg-slate-50/50">
                    {CO_WORK_CONFIG.headers.map((header) => (
                      <td key={header.id} className="px-3 py-3">
                        <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedRows.length > 0 ? (
                paginatedRows.map((row) => (
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

        {totalPages > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
            <p className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
