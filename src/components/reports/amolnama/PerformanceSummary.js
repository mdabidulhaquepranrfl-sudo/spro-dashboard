'use client';

import { useEffect, useMemo, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const PERFORMANCE_TABS = [
  { id: 'thana_wise', label: 'Thana Wise' },
  { id: 'zone_wise', label: 'Zone Wise' },
  { id: 'district_wise', label: 'District Wise' },
];

const PAGE_SIZE = 15;

const THANA_SUMMARY_TEMPLATE = [
  { id: 'total_thanas', label: 'TOTAL THANAS', value: '0', icon: 'location_pin', theme: { icon_bg: '#F3F4F6', icon_color: '#111827', text_color: '#111827' } },
  { id: 'visited_thanas', label: 'VISITED THANAS', value: '0', icon: 'check_circle', theme: { icon_bg: '#DCFCE7', icon_color: '#047857', text_color: '#166534' } },
  { id: 'pending_thanas', label: 'PENDING THANAS', value: '0', icon: 'warning_triangle', theme: { icon_bg: '#FEE2E2', icon_color: '#B91C1C', text_color: '#B91C1C' } },
];

const ZONE_SUMMARY_TEMPLATE = [
  { id: 'total_zones', label: 'TOTAL ZONES', value: '0', icon: 'location_pin', theme: { icon_bg: '#F3F4F6', icon_color: '#111827', text_color: '#111827' } },
  { id: 'visited_zones', label: 'VISITED ZONES', value: '0', icon: 'check_circle', theme: { icon_bg: '#DCFCE7', icon_color: '#047857', text_color: '#166534' } },
  { id: 'pending_zones', label: 'PENDING ZONES', value: '0', icon: 'warning_triangle', theme: { icon_bg: '#FEE2E2', icon_color: '#B91C1C', text_color: '#B91C1C' } },
];

const DISTRICT_SUMMARY_TEMPLATE = [
  { id: 'total_districts', label: 'TOTAL DISTRICTS', value: '0', icon: 'map_icon', theme: { icon_bg: '#F3F4F6', icon_color: '#111827', text_color: '#111827' } },
  { id: 'visited_districts', label: 'VISITED DISTRICTS', value: '0', icon: 'check_circle', theme: { icon_bg: '#DCFCE7', icon_color: '#047857', text_color: '#166534' } },
  { id: 'pending_districts', label: 'PENDING DISTRICTS', value: '0', icon: 'warning_triangle', theme: { icon_bg: '#FEE2E2', icon_color: '#B91C1C', text_color: '#B91C1C' } },
];

const ICON_MAP = {
  location_pin: 'bx-map-pin',
  check_circle: 'bx-check-circle',
  warning_triangle: 'bx-error-circle',
  map_icon: 'bx-map',
};

function formatDuration(hhmmss) {
  if (!hhmmss || hhmmss === '00:00:00') return '0sec';
  const parts = String(hhmmss).split(':').map(Number);
  const [h, m, s] = parts;
  const segments = [];
  if (h > 0) segments.push(`${h}hr`);
  if (m > 0) segments.push(`${m}min`);
  if (s > 0) segments.push(`${s}sec`);
  return segments.length ? segments.join(' ') : '0sec';
}

function formatSeconds(totalSec) {
  if (!totalSec) return '0sec';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const segments = [];
  if (h > 0) segments.push(`${h}hr`);
  if (m > 0) segments.push(`${m}min`);
  if (s > 0) segments.push(`${s}sec`);
  return segments.length ? segments.join(' ') : '0sec';
}

function buildThanaSummary(rows) {
  const total = rows.length;
  const visited = rows.filter((r) => (r.visited_shops ?? 0) > 0).length;
  const pending = total - visited;
  return THANA_SUMMARY_TEMPLATE.map((card) => {
    if (card.id === 'total_thanas') return { ...card, value: String(total) };
    if (card.id === 'visited_thanas') return { ...card, value: String(visited) };
    if (card.id === 'pending_thanas') return { ...card, value: String(pending) };
    return card;
  });
}

function buildZoneSummary(summary) {
  const total = summary?.total_zones ?? 0;
  const visited = summary?.visited_zones ?? 0;
  const pending = total - visited;
  return ZONE_SUMMARY_TEMPLATE.map((card) => {
    if (card.id === 'total_zones') return { ...card, value: String(total) };
    if (card.id === 'visited_zones') return { ...card, value: String(visited) };
    if (card.id === 'pending_zones') return { ...card, value: String(pending) };
    return card;
  });
}

function buildDistrictSummary(rows) {
  const total = rows.length;
  const visited = rows.filter((r) => (r.shops_visited ?? 0) > 0).length;
  const pending = total - visited;
  return DISTRICT_SUMMARY_TEMPLATE.map((card) => {
    if (card.id === 'total_districts') return { ...card, value: String(total) };
    if (card.id === 'visited_districts') return { ...card, value: String(visited) };
    if (card.id === 'pending_districts') return { ...card, value: String(pending) };
    return card;
  });
}

function SkeletonSummaryCards({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded-full bg-slate-200" />
              <div className="h-6 w-1/2 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonTableRows({ colCount = 6, rowCount = 6 }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <tr key={i} className="animate-pulse border-t border-slate-100">
          {Array.from({ length: colCount }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 rounded-full bg-slate-200" style={{ width: j === 1 ? '70%' : '50%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function PerformanceSummary({ searchParams }) {
  const { staffId, startDate, endDate } = searchParams;
  const [activeSubTab, setActiveSubTab] = useState('thana_wise');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'sl', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCard, setExpandedCard] = useState(null);

  const [thanaRows, setThanaRows] = useState([]);
  const [thanaSummary, setThanaSummary] = useState(THANA_SUMMARY_TEMPLATE);
  const [zoneRows, setZoneRows] = useState([]);
  const [zoneSummary, setZoneSummary] = useState(ZONE_SUMMARY_TEMPLATE);
  const [districtRows, setDistrictRows] = useState([]);
  const [districtSummary, setDistrictSummary] = useState(DISTRICT_SUMMARY_TEMPLATE);

  const [isThanaLoading, setIsThanaLoading] = useState(false);
  const [isZoneLoading, setIsZoneLoading] = useState(false);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);

  useEffect(() => {
    if (!staffId) return;

    async function fetchThanaPerformance() {
      setIsThanaLoading(true);
      try {
        const response = await getReportData('thana-performance', `staff_id=${staffId}&zone_id=&start_date=${startDate}&end_date=${endDate}`);
        const rows = response?.data ?? [];
        const mapped = rows.map((item, idx) => ({
          sl: idx + 1,
          thana_name: item.thana_name,
          total_shops: item.total_shops ?? 0,
          visited_shops: item.visited_shops ?? 0,
          visited_pct: item.visited_pct ?? 0,
          avg_duration: formatDuration(item.avg_duration),
          number_of_days: item.number_of_days ?? 0,
          is_assigned: item.is_assigned ?? 1,
        }));
        setThanaRows(mapped);
        setThanaSummary(buildThanaSummary(mapped));
      } catch (error) {
        console.error('Thana performance fetch error:', error);
      } finally {
        setIsThanaLoading(false);
      }
    }

    async function fetchZonePerformance() {
      setIsZoneLoading(true);
      try {
        const response = await getReportData('zone-performance', `staff_id=${staffId}&zone_id=&start_date=${startDate}&end_date=${endDate}`);
        const rows = response?.data?.rows ?? [];
        const summary = response?.data?.summary ?? {};
        const mapped = rows.map((item, idx) => ({
          sl: idx + 1,
          zone_name: item.zone_name,
          total_shops: item.total_shops ?? 0,
          shops_visited: item.shops_visited ?? 0,
          visited_pct: item.visited_pct ?? 0,
          avg_shop_visit_duration: formatSeconds(item.avg_visit_sec),
          number_of_days: item.number_of_days ?? 0,
          is_assigned: item.active_flag ?? 1,
        }));
        setZoneRows(mapped);
        setZoneSummary(buildZoneSummary(summary));
      } catch (error) {
        console.error('Zone performance fetch error:', error);
      } finally {
        setIsZoneLoading(false);
      }
    }

    async function fetchDistrictPerformance() {
      setIsDistrictLoading(true);
      try {
        const response = await getReportData('district-performance', `staff_id=${staffId}&zone_id=&start_date=${startDate}&end_date=${endDate}`);
        const rows = response?.data ?? [];
        const mapped = rows.map((item, idx) => ({
          sl: idx + 1,
          district_name: item.district_name,
          total_shops: item.total_shops ?? 0,
          shops_visited: item.shops_visited ?? 0,
          visited_pct: item.visited_pct ?? 0,
          avg_shop_visit_duration: formatDuration(item.total_duration),
          number_of_days: item.number_of_days ?? 0,
          is_assigned: item.is_assigned ?? 1,
        }));
        setDistrictRows(mapped);
        setDistrictSummary(buildDistrictSummary(mapped));
      } catch (error) {
        console.error('District performance fetch error:', error);
      } finally {
        setIsDistrictLoading(false);
      }
    }

    fetchThanaPerformance();
    fetchZonePerformance();
    fetchDistrictPerformance();
  }, [searchParams]);

  const currentConfig = useMemo(() => {
    if (activeSubTab === 'thana_wise') {
      return {
        title: 'Thana Performance Summary',
        summaryCards: thanaSummary,
        headers: [
          { id: 'sl', label: 'SL' },
          { id: 'thana_name', label: 'THANA NAME' },
          { id: 'total_shops', label: 'TOTAL SHOPS' },
          { id: 'visited_shops', label: 'VISITED SHOPS' },
          { id: 'avg_duration', label: 'AVG VISIT DURATION' },
          { id: 'number_of_days', label: 'NO. OF DAYS' },
        ],
        rows: thanaRows,
        nameKey: 'thana_name',
        isLoading: isThanaLoading,
        emptyMessage: 'No thana data available',
      };
    }

    if (activeSubTab === 'zone_wise') {
      return {
        title: 'Zone Performance Summary',
        summaryCards: zoneSummary,
        headers: [
          { id: 'sl', label: 'SL' },
          { id: 'zone_name', label: 'ZONE NAME' },
          { id: 'total_shops', label: 'TOTAL SHOPS' },
          { id: 'shops_visited', label: 'SHOPS VISITED' },
          { id: 'avg_shop_visit_duration', label: 'AVG VISIT DURATION' },
          { id: 'number_of_days', label: 'NO. OF DAYS' },
        ],
        rows: zoneRows,
        nameKey: 'zone_name',
        isLoading: isZoneLoading,
        emptyMessage: 'No zone data available',
      };
    }

    return {
      title: 'District Performance Summary',
      summaryCards: districtSummary,
      headers: [
        { id: 'sl', label: 'SL' },
        { id: 'district_name', label: 'DISTRICT NAME' },
        { id: 'total_shops', label: 'TOTAL SHOPS' },
        { id: 'shops_visited', label: 'SHOPS VISITED' },
        { id: 'avg_shop_visit_duration', label: 'AVG VISIT DURATION' },
        { id: 'number_of_days', label: 'NO. OF DAYS' },
      ],
      rows: districtRows,
      nameKey: 'district_name',
      isLoading: isDistrictLoading,
      emptyMessage: 'No district data available',
    };
  }, [
    activeSubTab,
    thanaSummary,
    thanaRows,
    isThanaLoading,
    zoneSummary,
    zoneRows,
    isZoneLoading,
    districtSummary,
    districtRows,
    isDistrictLoading,
  ]);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return currentConfig.rows;
    const q = searchQuery.toLowerCase();
    return currentConfig.rows.filter((row) =>
      Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q))
    );
  }, [currentConfig.rows, searchQuery]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    if (!sortConfig?.key) return rows;

    rows.sort((a, b) => {
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

    return rows;
  }, [filteredRows, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleCardToggle = (cardId) => {
    setCurrentPage(1);
    setExpandedCard((current) => (current === cardId ? null : cardId));
  };

  // When a summary card is expanded, derive filtered rows for that card.
  const cardFilteredRows = useMemo(() => {
    if (!expandedCard) return [];
    const predicate = (row) => {
      const visited = Number(row.visited_shops ?? row.shops_visited ?? 0);
      if (expandedCard.includes('visited')) return visited > 0;
      if (expandedCard.includes('pending')) return visited === 0;
      return true; // total
    };
    return sortedRows.filter(predicate);
  }, [expandedCard, sortedRows]);

  const cardTotalPages = Math.max(1, Math.ceil(cardFilteredRows.length / PAGE_SIZE));
  const paginatedCardRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return cardFilteredRows.slice(start, start + PAGE_SIZE);
  }, [cardFilteredRows, currentPage]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedRows.slice(start, start + PAGE_SIZE);
  }, [sortedRows, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setExpandedCard(null);
  }, [activeSubTab, searchQuery, sortConfig.key, sortConfig.direction]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 sm:px-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Performance Summary</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERFORMANCE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`rounded-full px-3 py-2 text-sm font-medium ${activeSubTab === tab.id ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              onClick={() => {
                setActiveSubTab(tab.id);
                setSearchQuery('');
                setSortConfig({ key: 'sl', direction: 'asc' });
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full min-w-0 p-2 sm:p-2">
        {currentConfig.isLoading ? (
          <SkeletonSummaryCards count={3} />
        ) : (
         <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {currentConfig.summaryCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardToggle(card.id)}
                className={`relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 shadow-sm ${expandedCard === card.id ? 'ring-2 ring-sky-200' : ''}`}
              >
                <div className="flex items-start">
                  {/*
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                    style={{ backgroundColor: card.theme.icon_bg, color: card.theme.icon_color }}
                  >
                    <i className={`bx ${ICON_MAP[card.icon] ?? 'bx-help-circle'} text-lg`} />
                  </div>
                  */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: card.theme.text_color }}>{card.label}</p>
                    <p className="mt-0.5 text-xl font-bold leading-tight" style={{ color: card.theme.text_color }}>{card.value}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCardToggle(card.id); }}
                  aria-pressed={expandedCard === card.id}
                  className="absolute right-2 top-2 rounded-full p-0.5 text-slate-500 hover:text-slate-700"
                >
                  <i className={`bx ${expandedCard === card.id ? 'bx-chevron-up' : 'bx-chevron-down'}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 w-full max-w-full overflow-x-auto rounded-2xl border border-slate-200">
          {expandedCard ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <h4 className="text-lg font-semibold text-slate-900">{currentConfig.title}</h4>
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      {currentConfig.headers.map((header) => (
                        <th key={header.id} className="whitespace-nowrap px-4 py-3 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleSort(header.id)}
                            className="flex items-center gap-1 text-left text-slate-600 transition hover:text-slate-900"
                          >
                            <span>{header.label}</span>
                            <i className={`bx ${sortConfig?.key === header.id ? (sortConfig.direction === 'asc' ? 'bx-sort-up' : 'bx-sort-down') : 'bx-sort'}`} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {cardFilteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={currentConfig.headers.length} className="px-4 py-6 text-center text-slate-500">
                          No rows for this selection
                        </td>
                      </tr>
                    ) : (
                      paginatedCardRows.map((row) => (
                        <tr key={row.sl} className="bg-slate-50/50 transition-colors hover:bg-slate-50">
                          {currentConfig.headers.map((header) => (
                            <td key={header.id} className="whitespace-nowrap px-4 py-3">
                              {header.id === currentConfig.nameKey ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium text-slate-800">{row[currentConfig.nameKey]}</span>
                                  {row.is_assigned === 0 && (
                                    <span className="inline-block w-fit rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                                      Unassigned
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-700">{row[header.id]}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {cardTotalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
                  <p className="text-sm text-slate-600">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, cardFilteredRows.length)} of {cardFilteredRows.length}
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
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                      Page {currentPage} of {cardTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(cardTotalPages, page + 1))}
                      disabled={currentPage === cardTotalPages}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </section>
  );
}
