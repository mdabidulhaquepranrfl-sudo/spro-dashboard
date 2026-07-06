'use client';

import { useEffect, useState } from 'react';
import { getReportData } from '@/lib/getReportData';
import SearchableStaffInput from '@/components/profile/SearchableStaffInput';
import DailySummary from './amolnama/DailySummary';
import VisitedSummary from './amolnama/VisitedSummary';
import StepCount from './amolnama/StepCount';
import PerformanceAndKPI from './amolnama/PerformanceAndKPI';
import CoWorkReport from './amolnama/CoWorkReport';
import FieldOperationsSnapshot from './amolnama/FieldOperationsSnapshot';

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
  const [employeeId, setEmployeeId] = useState('UAE2704');
  const [employeeName, setEmployeeName] = useState('');
  const [startDate, setStartDate] = useState('2026-06-15');
  const [endDate, setEndDate] = useState('2026-07-05');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchParams, setSearchParams] = useState({
    staffId: 'UAE2704',
    startDate: '2026-06-15',
    endDate: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const formattedStartDate = formatDisplayDate(startDate);
  const formattedEndDate = formatDisplayDate(endDate);
  const selectedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
  const reportHeading = `Insights for ${searchParams.staffId || '—'} ${employeeName}`;

  useEffect(() => {
    if (!hasSearched || !searchParams.staffId) return;
  }, [hasSearched, searchParams, refreshKey]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (!employeeId.trim() || !startDate || !endDate) {
      setSearchError('Please enter employee ID and both dates to load the report.');
      setHasSearched(false);
      return;
    }

    setSearchError('');
    setSearchParams({
      staffId: employeeId,
      startDate: startDate,
      endDate: endDate,
    });
    setHasSearched(true);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      <section className="w-full max-w-full overflow-visible rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Amolnama Report</p> */}
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Supervisor Performance Ledger {reportHeading}</h2>
            {/* <p className="mt-2 max-w-2xl break-words text-sm text-slate-500">{reportHeading}</p> */}
          </div>
        </div>

        <form className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-[1.2fr_1fr_1fr_auto]" onSubmit={handleSearch}>
          <div>
            {/* <label className="mb-2 block text-sm font-medium text-slate-700">Employee ID</label> */}
            <SearchableStaffInput
              value={employeeId}
              onChange={setEmployeeId}
              placeholder="Enter employee ID"
              disabled={false}
            />
          </div>
          <div>
            {/* <label className="mb-2 block text-sm font-medium text-slate-700">Start date</label> */}
            <input type="date" placeholder="From Date" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:bg-white" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div>
            {/* <label className="mb-2 block text-sm font-medium text-slate-700">End date</label> */}
            <input type="date" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:bg-white" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-2xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-700">Search</button>
          </div>
          {searchError ? <div className="md:col-span-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{searchError}</div> : null}
        </form>
      </section>

      {hasSearched ? (
        <div className="w-full min-w-0 space-y-4">

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <div className="grid gap-4">
              <DailySummary key={`daily-${refreshKey}`} searchParams={searchParams} />
              <VisitedSummary key={`visited-${refreshKey}`} searchParams={searchParams} />
            </div>
            <StepCount key={`step-${refreshKey}`} searchParams={searchParams} />
          </div>

          <PerformanceAndKPI key={`kpi-${refreshKey}`} searchParams={searchParams} />
          <CoWorkReport key={`cowork-${refreshKey}`} searchParams={searchParams} />
          <FieldOperationsSnapshot key={`field-${refreshKey}`} searchParams={searchParams} />
        </div>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">🔎</div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No report data loaded yet</h3>
          <p className="mt-2 text-sm text-slate-500">Enter the employee ID and date range above and click Search to load the dashboard.</p>
        </section>
      )}
    </div>
  );
}
