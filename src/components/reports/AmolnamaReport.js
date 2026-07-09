'use client';

import { useEffect, useRef, useState } from 'react';
import { getReportData } from '@/lib/getReportData';
import SearchableStaffInput from '@/components/profile/SearchableStaffInput';
import DailySummary from './amolnama/DailySummary';
import VisitedSummary from './amolnama/VisitedSummary';
import StepCount from './amolnama/StepCount';
import PerformanceSummary from './amolnama/PerformanceSummary';
import TtsKpi from './amolnama/TtsKpi';
import OutletActivity from './amolnama/OutletActivity';
import CoWorkReport from './amolnama/CoWorkReport';
import FieldOperationsSnapshot from './amolnama/FieldOperationsSnapshot';
import KeyLocations from './amolnama/KeyLocations';

const formatDisplayDate = (value) => {
  if (!value) return '';

  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

export default function AmolnamaPage() {
  const todayString = new Date().toISOString().slice(0, 10);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState(todayString);
  const [endDate, setEndDate] = useState(todayString);
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const rangePickerRef = useRef(null);
  const startDateInputRef = useRef(null);
  const [searchError, setSearchError] = useState('');
  const [searchParams, setSearchParams] = useState({
    staffId: '',
    startDate: '',
    endDate: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const formattedStartDate = formatDisplayDate(startDate);
  const formattedEndDate = formatDisplayDate(endDate);
  const selectedDateRange = startDate || endDate
    ? `${formattedStartDate || 'Start'} - ${formattedEndDate || 'End'}`
    : '';
  const reportHeading = `Insights for ${searchParams.staffId || '—'} ${employeeName}`;

  useEffect(() => {
    if (!hasSearched || !searchParams.staffId) return;
  }, [hasSearched, searchParams, refreshKey]);

  useEffect(() => {
    if (!isRangePickerOpen) return;

    const handleClickOutside = (event) => {
      if (rangePickerRef.current && !rangePickerRef.current.contains(event.target)) {
        setIsRangePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRangePickerOpen]);

  const handleRangeButtonClick = () => {
    setIsRangePickerOpen((current) => {
      const next = !current;
      if (next) {
        window.requestAnimationFrame(() => {
          if (startDateInputRef.current?.showPicker) {
            startDateInputRef.current.showPicker();
          } else {
            startDateInputRef.current?.focus();
          }
        });
      }
      return next;
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!employeeId.trim() || !startDate || !endDate) {
      setSearchError('Please enter employee ID and both dates to load the report.');
      setHasSearched(false);
      return;
    }

    setRefreshKey(prev => prev + 1);
    setSearchError('');
    setSearchParams({
      staffId: employeeId,
      startDate: startDate,
      endDate: endDate,
      refreshKey: refreshKey,
    });
    setHasSearched(true);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <section className="w-full max-w-full overflow-visible border border-slate-200 bg-white p-2 shadow-sm sm:p-2">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* <p className="text-sm font-semibold uppercase text-sky-600">Amolnama Report</p> */}
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Supervisor Performance Ledger {reportHeading}</h2>
            {/* <p className="mt-2 max-w-2xl break-words text-sm text-slate-500">{reportHeading}</p> */}
          </div>
        </div>

        <form className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-[1.2fr_1.4fr_auto]" onSubmit={handleSearch}>
          <div>
            {/* <label className="mb-2 block text-sm font-medium text-slate-700">Employee ID</label> */}
            <SearchableStaffInput
              value={employeeId}
              onChange={setEmployeeId}
              placeholder="Enter employee ID"
              disabled={false}
            />
          </div>
          <div className="relative" ref={rangePickerRef}>
            <button
              type="button"
              onClick={handleRangeButtonClick}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 text-left text-sm text-slate-600 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:bg-white"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`truncate ${selectedDateRange ? 'text-slate-900' : 'text-slate-400'}`}>
                  {selectedDateRange || 'Select date range'}
                </span>
                <i className="bx bx-calendar text-lg text-slate-500" />
              </div>
            </button>

            {isRangePickerOpen && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-2 py-2 text-sm text-amber-700 lg:col-span-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-600">
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">From</span>
                    <input
                      ref={startDateInputRef}
                      type="date"
                      max={todayString}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:bg-white"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-600">
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">To</span>
                    <input
                      type="date"
                      max={todayString}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:bg-white"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </label>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsRangePickerOpen(false)}
                    className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-2xl bg-[#59A14F] px-4 py-3 font-semibold text-white transition hover:bg-[#59A14F]">Search</button>
          </div>
          {searchError ? <div className="md:col-span-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{searchError}</div> : null}
        </form>
      </section>

      {hasSearched ? (
        <div className="w-full min-w-0 space-y-1">

          <div className="grid w-full min-w-0 gap-0 items-start xl:grid-cols-[1.2fr_0.8fr] 2xl:grid-cols-[1.25fr_0.75fr]">
            <div className="w-full min-w-0 display contents xl:block">
              <div className="order-1 xl:order-none"><DailySummary searchParams={searchParams} /></div>
              <div className="order-2 xl:order-none"><VisitedSummary searchParams={searchParams} /></div>
              <div className="order-4 xl:order-none"><PerformanceSummary searchParams={searchParams} /></div>
              <div className="order-7 xl:order-none"><CoWorkReport searchParams={searchParams} /></div>
              <div className="order-8 xl:order-none"><FieldOperationsSnapshot searchParams={searchParams} /></div>
            </div>
            <div className="w-full min-w-0 self-start display contents xl:block">
              <div className="order-3 xl:order-none"><StepCount searchParams={searchParams} /></div>
              <div className="order-5 xl:order-none"><TtsKpi searchParams={searchParams} /></div>
              <div className="order-6 xl:order-none"><OutletActivity searchParams={searchParams} /></div>
              <div className="order-9 xl:order-none"><KeyLocations searchParams={searchParams} /></div>
            </div>

          </div>
        </div>
      ) : (
        <section className="min-h-screen rounded-l border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
            <i className="bx bx-search-alt-2 text-3xl text-slate-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No report data loaded yet</h3>
          <p className="mt-2 text-sm text-slate-500">Enter the employee ID and date range above and click Search to load the dashboard.</p>
        </section>
      )}
    </div>
  );
}
