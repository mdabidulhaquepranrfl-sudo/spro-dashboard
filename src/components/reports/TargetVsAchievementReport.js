'use client';

import { useMemo, useState } from 'react';
import SearchableStaffInput from '@/components/profile/SearchableStaffInput';
import { getReportData } from '@/lib/getReportData';

const TODAY = new Date().toISOString().slice(0, 10);
const PAGE_SIZE = 10;

/* ─── helpers ──────────────────────────────────────────────────── */
const fmt = (value, symbol = '') => {
  if (value == null || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  const formatted = n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return symbol ? `${symbol} ${formatted}` : formatted;
};

const initials = (name) => {
  if (!name) return '?';
  const words = String(name).split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

/* ─── status helper ─────────────────────────────────────────────── */
const getStatusConfig = (gapAmount) => {
  if (gapAmount <= 0) return { label: 'Ahead', bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500' };
  if (gapAmount <= 5000) return { label: 'On Track', bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500' };
  if (gapAmount <= 30000) return { label: 'At Risk', bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-500' };
  return { label: 'Behind', bg: 'bg-red-100', text: 'text-red-500', bar: 'bg-red-500' };
};

export default function TargetVsAchievementReport() {
  const [staffId, setStaffId] = useState('');
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('low_to_high');
  const [tablePage, setTablePage] = useState(1);

  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [inputError, setInputError] = useState('');
  const [apiError, setApiError] = useState('');

  /* ─── fetch ─────────────────────────────────────────────────── */
  const handleShowReport = async (event) => {
    event.preventDefault();
    if (!staffId.trim()) {
      setInputError('Please enter a staff ID to continue.');
      return;
    }
    setInputError('');
    setApiError('');
    setHasSearched(true);
    setIsLoading(true);
    setReportData(null);

    try {
      const response = await getReportData(
        'target-vs-achievement',
        `aemp_id=${encodeURIComponent(staffId.trim())}&date=${encodeURIComponent(selectedDate)}`,
      );
      const rd = response?.receive_data || null;
      if (!rd) setApiError('No data returned for the selected staff and date.');
      setReportData(rd);
    } catch (err) {
      console.error('TargetVsAchievement fetch error:', err);
      setApiError('Unable to load report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── derived values ─────────────────────────────────────────── */
  const summary = reportData?.summary;
  const meta = reportData?.meta;
  // const currency = meta?.currency_symbol || '৳';
  const currency = '';
  const daysInMonth = meta?.days_in_month || 30;

  // Monthly figures
  const monthlyTarget = summary?.target || 0;
  const monthlyOrder = summary?.order || 0;
  const monthlyGap = summary?.gap_amount || 0;
  const achievementPercent = summary?.achievement_percent || 0;

  // Daily / today figures
  const todayTarget = summary?.today_target || 0;
  const todayAchievement = summary?.today_achievement || 0;
  const todayGap = todayTarget - todayAchievement;

  // Progress bar calcs (monthly)
  const achievedPct = Math.min(achievementPercent, 100);
  // expected = linear: days elapsed / days in month * 100
  // We derive from (order + gap) / target * 100 which = today_target * elapsed_days_ratio
  // But simpler: expected% = (today_target_cumulative / target) * 100
  // API gives today_target which is daily. Elapsed days = orderPerDay > 0 => order / order_per_day
  const orderPerDay = summary?.order_per_day || 0;
  const elapsedDays = orderPerDay > 0 ? Math.round(monthlyOrder / orderPerDay) : 0;
  const expectedPct = monthlyTarget > 0
    ? Math.min((todayTarget * elapsedDays) / monthlyTarget * 100, 100)
    : 0;
  const gapPct = monthlyTarget > 0 ? (monthlyGap / monthlyTarget) * 100 : 0;
  const isBehind = monthlyGap > 0;
  const dailyIsBehind = todayGap > 0;

  /* ─── table rows ─────────────────────────────────────────────── */
  const filteredRows = useMemo(() => {
    if (!reportData?.data) return [];
    let rows = [...reportData.data];
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      rows = rows.filter(
        (r) =>
          r.sales_representative?.name?.toLowerCase().includes(term) ||
          r.sales_representative?.id?.toLowerCase().includes(term),
      );
    }
    rows.sort((a, b) => {
      const pa = a.progress?.achievement_percent || 0;
      const pb = b.progress?.achievement_percent || 0;
      return sortOrder === 'low_to_high' ? pa - pb : pb - pa;
    });
    return rows;
  }, [reportData, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paginatedRows = useMemo(() => {
    const start = (tablePage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, tablePage]);

  // Reset to page 1 when filter/sort changes
  useMemo(() => { setTablePage(1); }, [searchTerm, sortOrder]);

  const topPerformer = useMemo(() => {
    if (!reportData?.data?.length) return null;
    return [...reportData.data].sort(
      (a, b) => (b.progress?.achievement_percent || 0) - (a.progress?.achievement_percent || 0),
    )[0];
  }, [reportData]);

  const bottomPerformer = useMemo(() => {
    if (!reportData?.data?.length) return null;
    return [...reportData.data].sort(
      (a, b) => (a.progress?.achievement_percent || 0) - (b.progress?.achievement_percent || 0),
    )[0];
  }, [reportData]);

  /* ─── render ─────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-full">
      {/* ── Search bar ── */}
      <section className="relative w-full max-w-full rounded-[5px] border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Target vs. Achievement</h2>
            <p className="mt-1 text-sm text-slate-500">Real-time tracking of logistics performance metrics.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-[420px]:flex min-[420px]:flex-wrap min-[420px]:items-end">
            {/* Staff ID */}
            <div className="w-full sm:w-[220px]">
              <SearchableStaffInput value={staffId} onChange={setStaffId} placeholder="Enter Staff ID" />
              {inputError && <p className="mt-1.5 text-sm text-amber-600">{inputError}</p>}
            </div>

            {/* Date */}
            <div className="w-full min-[420px]:w-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus-within:border-[#59A14F] focus-within:bg-white transition">
                <i className="bx bx-calendar text-lg text-slate-500" />
                <input
                  type="date"
                  max={TODAY}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent font-medium outline-none"
                />
              </div>
            </div>

            {/* Search */}
            <button
              type="button"
              onClick={handleShowReport}
              className="col-span-2 h-12 w-full min-[420px]:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#59A14F] px-5 text-sm font-semibold text-white transition hover:bg-[#4B8A42]"
            >
              <i className="bx bx-search text-base" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {apiError}
          </div>
        )}
      </section>

      {/* ── Report body ── */}
      {!hasSearched ? (
        /* Empty state */
        <section className="min-h-[100vh] w-full max-w-full overflow-hidden rounded-[5px] border border-slate-200 bg-white p-8 text-center shadow-sm mt-1">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
            <i className="bx bx-bar-chart-alt-2" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No report loaded yet</h3>
          <p className="mt-2 text-sm text-slate-500">Enter a staff ID, choose the date, and click Search to load the performance data.</p>
        </section>
      ) : isLoading ? (
        <ReportSkeleton />
      ) : !reportData ? null : (
        <div className="flex flex-col gap-1 w-full mt-1">

          {/* ── Alert row: Daily + Monthly ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
            {/* Daily alert */}
            <div className={`w-full px-4 py-3 bg-white rounded-xl shadow-sm border-l-2 ${dailyIsBehind ? 'border-red-500' : 'border-emerald-500'} flex items-start gap-4`}>
              <div className={`h-10 w-10 flex-shrink-0 ${dailyIsBehind ? 'bg-red-500/10' : 'bg-emerald-500/10'} rounded-full flex items-center justify-center`}>
                <i className={`bx ${dailyIsBehind ? 'bx-trending-down text-red-500' : 'bx-trending-up text-emerald-500'} text-xl`} />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Today's Target</div>
                <div className="text-slate-900 text-sm font-semibold leading-5">
                  {currency} {fmt(todayAchievement)} Achieved • Target {currency} {fmt(todayTarget)}
                </div>
                <div className="text-slate-500 text-xs font-normal leading-5">
                  {dailyIsBehind
                    ? <>Gap: <span className="text-red-500 font-bold">{currency} {fmt(todayGap)}</span> behind today's pace.</>
                    : <span className="text-emerald-600 font-medium">Ahead of today's target! ✓</span>
                  }
                </div>
              </div>
            </div>

            {/* Monthly alert */}
            <div className={`w-full px-4 py-3 bg-white rounded-xl shadow-sm border-l-2 ${isBehind ? 'border-red-500' : 'border-emerald-500'} flex items-start gap-4`}>
              <div className={`h-10 w-10 flex-shrink-0 ${isBehind ? 'bg-red-500/10' : 'bg-emerald-500/10'} rounded-full flex items-center justify-center`}>
                {isBehind ? <div className="w-4 h-2.5 bg-red-500 rounded-sm" /> : <i className="bx bx-check text-emerald-500 text-xl" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Monthly Target</div>
                <div className="text-slate-900 text-sm font-semibold leading-5">
                  {achievementPercent.toFixed(1)}% Achieved • Expected {expectedPct.toFixed(1)}% • {isBehind ? 'Behind' : 'Ahead'} by {Math.abs(achievementPercent - expectedPct).toFixed(1)}%
                </div>
                <div className="text-slate-500 text-xs font-normal leading-5">
                  {isBehind
                    ? <>Need <span className="text-slate-900 font-bold">{currency} {fmt(monthlyGap)}</span> to reach monthly target.</>
                    : <span className="text-emerald-600 font-medium">Team is exceeding the monthly target! ✓</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* ── Monthly stat cards ── */}
          <div className="grid grid-cols-2 xl:grid-cols-2 xl:grid-cols-2 gap-1 bg-white py-2">
            {/* Monthly */}
            <div className="w-full rounded-2xl border border-slate-200 p-2">
              <div className="px-1 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                Monthly Overview
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4  gap-1 w-full">
                <StatCard label="Target" icon={<div className="h-3.5 w-3.5 rounded-full outline outline-2 outline-offset-[-1px] outline-slate-500" />} value={`${currency} ${fmt(monthlyTarget)}`} valueClass="text-slate-900" />
                <StatCard label="Achieved" icon={<div className="h-2 w-3 outline outline-2 outline-offset-[-1px] outline-emerald-500" />} value={`${currency} ${fmt(monthlyOrder)}`} valueClass="text-emerald-500" />
                <StatCard label="Achievement Rate" icon={<div className="h-3.5 w-3.5 rounded-sm outline outline-2 outline-offset-[-1px] outline-amber-500" />} value={`${achievementPercent.toFixed(1)}%`} valueClass="text-amber-500" />
                <StatCard label="Gap" icon={<div className="h-2.5 w-2.5 rotate-45 outline outline-2 outline-offset-[-1px] outline-red-500" />} value={`${currency} ${fmt(monthlyGap)}`} valueClass="text-red-500" />
              </div>
            </div>

            {/* Today's */}
            <div className="w-full rounded-2xl border border-slate-200 p-2">
              <div className="px-1 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                Today's Overview
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-1 w-full">
                <StatCard label="Target" icon={<div className="h-3.5 w-3.5 rounded-full outline outline-2 outline-offset-[-1px] outline-slate-500" />} value={`${currency} ${fmt(todayTarget)}`} valueClass="text-slate-900" />
                <StatCard label="Achievement" icon={<div className="h-2 w-3 outline outline-2 outline-offset-[-1px] outline-emerald-500" />} value={`${currency} ${fmt(todayAchievement)}`} valueClass="text-emerald-500" />
                <StatCard label="Order / Day" icon={<div className="h-3.5 w-3.5 rounded-sm outline outline-2 outline-offset-[-1px] outline-amber-500" />} value={`${currency} ${fmt(orderPerDay)}`} valueClass="text-amber-500" />
                <StatCard label="Gap" icon={<div className="h-2.5 w-2.5 rotate-45 outline outline-2 outline-offset-[-1px] outline-red-500" />} value={`${currency} ${fmt(Math.abs(todayGap))}`} valueClass={todayGap > 0 ? 'text-red-500' : 'text-emerald-500'} />
              </div>
            </div>
          </div>

          {/* ── Bottom: Left + Right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-1 w-full">

            {/* LEFT */}
            <div className="flex flex-col gap-1 w-full min-w-0">

              {/* Progress bar */}
              <div className="w-full px-4 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col gap-3 h-full">
                <div className="text-slate-900 text-sm font-semibold">Target vs Achieved Progress</div>
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full h-6 bg-slate-50 rounded-sm flex overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${achievedPct}%` }} />
                    {isBehind && (
                      <div className="h-full opacity-60 bg-amber-500 transition-all duration-500" style={{ width: `${Math.max(0, Math.min(gapPct, 100 - achievedPct))}%` }} />
                    )}
                  </div>
                  <div className="w-full flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                        <div className="text-slate-500 text-xs font-normal">{achievedPct.toFixed(1)}% Achieved</div>
                      </div>
                      {isBehind && (
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 bg-amber-500 rounded-full" />
                          <div className="text-slate-500 text-xs font-normal">{gapPct.toFixed(1)}% Pending Expected</div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <div className="text-slate-900 text-xs font-semibold">{expectedPct.toFixed(1)}% Expected</div>
                      {isBehind && (
                        <div className="px-2 py-1 bg-red-500 rounded-sm flex items-center justify-center">
                          <div className="text-white text-[10px] font-bold">-{currency} {fmt(monthlyGap)} GAP</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-1 w-full">

              {/* Top & Bottom Performers */}
              <div className="w-full px-5 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col gap-2.5 h-full">
                <div className="text-slate-900 text-sm font-semibold">Top &amp; Bottom Performers</div>
                <div className="w-full flex flex-col gap-2.5">
                  {topPerformer && (
                    <div className="w-full px-3 py-2 bg-slate-50 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-6 w-6 flex-shrink-0 bg-emerald-100 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-semibold">
                          {initials(topPerformer.sales_representative?.name)}
                        </div>
                        <div className="text-slate-900 text-xs font-medium truncate">{topPerformer.sales_representative?.name}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <i className="bx bx-up-arrow-alt text-emerald-500" />
                        <div className="text-emerald-500 text-xs font-bold">{topPerformer.progress?.achievement_percent.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}
                  {bottomPerformer && bottomPerformer.sales_representative?.id !== topPerformer?.sales_representative?.id && (
                    <div className="w-full px-3 py-2 bg-slate-50 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-6 w-6 flex-shrink-0 bg-red-200 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-semibold">
                          {initials(bottomPerformer.sales_representative?.name)}
                        </div>
                        <div className="text-slate-900 text-xs font-medium truncate">{bottomPerformer.sales_representative?.name}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <i className="bx bx-down-arrow-alt text-red-500" />
                        <div className="text-red-500 text-xs font-bold">{bottomPerformer.progress?.achievement_percent.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Representative table */}
          <div className="w-full bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col mt-2">

            {/* Common Header for both Desktop and Mobile */}
            <div className="w-full px-4 py-3 flex flex-wrap justify-between items-center gap-3 border-b border-slate-200">
              <div className="text-slate-900 text-sm font-semibold">Representative Performance</div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                  <div className="text-slate-500 text-xs font-medium leading-4 whitespace-nowrap">Sort by</div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full sm:w-auto px-3 py-1.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-slate-700 text-xs font-medium"
                  >
                    <option value="low_to_high">Low performance</option>
                    <option value="high_to_low">High performance</option>
                  </select>
                </div>
                <div className="relative flex-1 sm:flex-none">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <i className="bx bx-search" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or ID"
                    className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-0.50px] outline-slate-200 text-xs text-slate-700 focus:outline-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto">
              <div className="min-w-[700px] w-full">
                {/* Table header */}
                <div className="w-full px-5 py-2.5 bg-slate-50 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 border-b border-slate-200">
                  {['Representative', 'Status', 'Target', 'Achieved', 'Gap', 'Progress'].map((h, i) => (
                    <div key={h} className={`text-slate-500 text-[10px] font-semibold uppercase ${i === 0 ? '' : i >= 4 ? 'text-center' : i >= 2 ? 'text-right' : 'text-center'}`}>{h}</div>
                  ))}
                </div>

                {paginatedRows.length > 0 ? paginatedRows.map((row) => {
                  const sr = row.sales_representative;
                  const amt = row.amounts;
                  const prog = row.progress;
                  const st = getStatusConfig(prog.gap_amount);

                  return (
                    <div key={sr.id} className="w-full px-5 py-3 border-b border-slate-200 last:border-0 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 items-center hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-8 w-8 flex-shrink-0 ${st.bg} rounded-full flex items-center justify-center text-slate-900 text-xs font-semibold`}>
                          {initials(sr.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="text-slate-900 text-xs font-medium truncate" title={sr.name}>{sr.name}</div>
                          <div className="text-slate-500 text-[10px] truncate">{sr.id}</div>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className={`px-2 py-1 ${st.bg} rounded-full`}>
                          <div className={`${st.text} text-[10px] font-semibold whitespace-nowrap`}>{st.label}</div>
                        </div>
                      </div>
                      <div className="text-right text-slate-900 text-xs font-normal">{fmt(amt.target)}</div>
                      <div className="text-right text-slate-900 text-xs font-normal">{fmt(amt.order)}</div>
                      <div className={`text-center text-xs font-semibold ${prog.gap_amount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {prog.gap_amount > 0 ? `-${fmt(prog.gap_amount)}` : `+${fmt(Math.abs(prog.gap_amount))}`}
                      </div>
                      <div className="flex items-center gap-2 pl-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${st.bar}`} style={{ width: `${Math.min(prog.achievement_percent, 100)}%` }} />
                        </div>
                        <div className="text-slate-900 text-xs font-semibold w-10 text-right">{prog.achievement_percent.toFixed(0)}%</div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-8 text-center text-sm text-slate-500">No representatives found.</div>
                )}
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden w-full flex flex-col">
              {paginatedRows.length > 0 ? paginatedRows.map((row) => {
                const sr = row.sales_representative;
                const amt = row.amounts;
                const prog = row.progress;
                const st = getStatusConfig(prog.gap_amount);

                return (
                  <div key={sr.id} className="self-stretch p-3 bg-white border-b border-slate-200 last:border-0 flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch flex flex-col justify-center items-start gap-2">
                      <div className="self-stretch inline-flex justify-start items-center gap-2">
                        <div className={`h-10 w-10 flex-shrink-0 relative ${st.bg} rounded-[20px] flex justify-center items-center`}>
                          <div className="text-slate-950 text-sm font-semibold font-['Inter'] leading-4">{initials(sr.name)}</div>
                        </div>
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1 min-w-0">
                          <div className="justify-start text-slate-900 text-sm font-semibold font-['Inter'] truncate w-full">{sr.name}</div>
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div className="flex-1 flex justify-start items-center gap-2">
                              <div className={`justify-start ${prog.gap_amount > 0 ? 'text-red-500' : 'text-emerald-500'} text-xs font-medium font-['Inter'] leading-4`}>
                                Gap: {prog.gap_amount > 0 ? `-${fmt(prog.gap_amount)}` : `+${fmt(Math.abs(prog.gap_amount))}`}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 ${st.bg} rounded-[100px] flex justify-start items-start`}>
                          <div className={`justify-start ${st.text} text-[10px] font-bold font-['Inter'] uppercase`}>{st.label}</div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-end gap-1">
                      <div className="justify-start text-slate-700 text-xs font-semibold font-['Inter'] leading-4">{prog.achievement_percent.toFixed(0)}%</div>
                      <div className="self-stretch relative bg-slate-100 rounded-[100px] h-2 overflow-hidden">
                        <div className={`h-full ${st.bar} rounded-[100px]`} style={{ width: `${Math.min(prog.achievement_percent, 100)}%` }} />
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-center mt-1">
                      <div className="inline-flex flex-col justify-center items-start gap-1">
                        <div className="justify-start text-slate-500 text-[11px] font-medium font-['Inter'] uppercase tracking-wider leading-4">Target</div>
                        <div className="justify-start text-slate-900 text-sm font-bold font-['Inter'] leading-5">{currency} {fmt(amt.target)}</div>
                      </div>
                      <div className="inline-flex flex-col justify-center items-end gap-1">
                        <div className="justify-start text-slate-500 text-[11px] font-medium font-['Inter'] uppercase tracking-wider leading-4">Achievement</div>
                        <div className="justify-start text-slate-900 text-sm font-bold font-['Inter'] leading-5">{currency} {fmt(amt.order)}</div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-8 text-center text-sm text-slate-500">No representatives found.</div>
              )}
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
                <p className="text-sm text-slate-600">
                  Page {tablePage} of {totalPages}
                  <span className="ml-2 text-slate-400">({filteredRows.length} total)</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                    disabled={tablePage === 1}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 transition"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
                    disabled={tablePage === totalPages}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reusable stat card ─────────────────────────────────────── */
function StatCard({ label, icon, value, valueClass }) {
  return (
    <div className="flex-1 px-5 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-2.5">
      <div className="w-full flex justify-between items-center">
        <div className="text-slate-500 text-xs font-medium uppercase">{label}</div>
        <div className="h-4 w-4 relative overflow-hidden flex items-center justify-center">{icon}</div>
      </div>
      <div className={`text-xl font-bold ${valueClass}`}>{value}</div>
    </div>
  );
}

/* ─── Skeleton Loading UI ─────────────────────────────────────── */
function ReportSkeleton() {
  return (
    <div className="flex flex-col gap-1 w-full mt-1 animate-pulse">
      {/* Alert Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
        <div className="w-full h-[76px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="w-full h-[76px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Monthly Overview */}
        <div className="w-full mt-2">
          <div className="h-3 w-32 rounded bg-slate-200 mb-2 ml-1" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
                <div className="flex w-full items-center justify-between">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-4 w-4 rounded-full bg-slate-200" />
                </div>
                <div className="mt-auto h-7 w-32 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Today's Overview */}
        <div className="w-full mt-2">
          <div className="h-3 w-32 rounded bg-slate-200 mb-2 ml-1" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3">
                <div className="flex w-full items-center justify-between">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-4 w-4 rounded-full bg-slate-200" />
                </div>
                <div className="mt-auto h-7 w-32 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Layout */}
      {/* Bottom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-1 w-full mt-2">
        {/* Left */}
        <div className="flex flex-col gap-1 w-full">
          <div className="h-[120px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-6 w-full bg-slate-200 rounded" />
            <div className="flex justify-between">
              <div className="h-3 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-1 w-full">
          <div className="h-full min-h-[180px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="flex gap-5 items-center">
              <div className="h-24 w-24 bg-slate-200 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-6 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-48 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-1">
        <div className="h-[400px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-8 w-48 bg-slate-200 rounded" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
              <div className="flex gap-3 items-center">
                <div className="h-8 w-8 bg-slate-200 rounded-full" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                  <div className="h-2 w-20 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-16 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
