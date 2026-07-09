'use client';

import { useMemo, useState } from 'react';
import SearchableStaffInput from '@/components/profile/SearchableStaffInput';

const TODAY = new Date().toISOString().slice(0, 10);

const REPORT_DATA = {
  dashboard_page: {
    header: {
      title: 'Target vs. Achievement',
      subtitle: 'Real-time tracking of logistics performance metrics.',
    },
    controls: {
      search_bar: {
        placeholder: 'Enter Staff ID',
        icon: 'search',
      },
      date_picker: {
        selected_value: TODAY,
        icon: 'calendar',
        dropdown: true,
      },
    },
    main_content: {
      card_title: 'Team Performance',
      badge: {
        label: 'OVERALL',
        bg_color: '#E6F4EA',
        text_color: '#137333',
      },
      metrics: {
        total_target: {
          label: 'TOTAL TARGET',
          value: '10,00,000',
          color: '#991B1B',
        },
        expected: {
          label: 'EXPECTED',
          value: '7,20,000',
          color: '#D97706',
        },
        achieved: {
          label: 'ACHIEVED',
          value: '6,50,000',
          color: '#065F46',
        },
      },
      progress_bar: {
        min_percentage: '0%',
        max_percentage: '100%',
        segments: [
          { type: 'achieved', percentage: 65, color: '#065F46', label: '65% ACHIEVED' },
          { type: 'expected_gap', percentage: 7, color: '#D97706', label: '72% EXPECTED' },
          { type: 'remaining', percentage: 28, color: '#F3E8E6' },
        ],
      },
      status_alert: {
        type: 'warning',
        icon: 'trending_down',
        title: 'Achievement Gap: -70,000',
        description: 'The team is currently 7% behind the expected linear target for today.',
        styling: {
          border_left_color: '#065F46',
          bg_color: '#F3F4F6',
        },
      },
    },
  },
};

const performanceRows = [
  { name: 'Amina Rahman', status: 'Ahead', target: '2,40,000', achieved: '2,55,000', delta: '+15,000' },
  { name: 'Rafiq Hossain', status: 'On Track', target: '2,10,000', achieved: '1,95,000', delta: '-15,000' },
  { name: 'Nadia Islam', status: 'Behind', target: '1,80,000', achieved: '1,50,000', delta: '-30,000' },
];

export default function TargetVsAchievementReport() {
  const [staffId, setStaffId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(REPORT_DATA.dashboard_page.controls.date_picker.selected_value);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [inputError, setInputError] = useState('');

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return performanceRows;

    return performanceRows.filter((row) => {
      return [row.name, row.status, row.target, row.achieved, row.delta].some((value) =>
        String(value).toLowerCase().includes(term),
      );
    });
  }, [searchTerm]);

  const handleShowReport = (event) => {
    event.preventDefault();

    if (!staffId.trim()) {
      setInputError('Please enter a staff ID or representative ID to continue.');
      setShowReport(false);
      return;
    }

    setInputError('');
    setShowReport(true);
  };

  const { header, controls, main_content } = REPORT_DATA.dashboard_page;
  const metrics = main_content.metrics;

  return (
    <div className="w-full max-w-full">
      <section className="relative w-full max-w-full rounded-[5px] border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {/* Left Side - Header */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              {header.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {header.subtitle}
            </p>
          </div>

          {/* Right Side - Controls */}
          <div className="grid grid-cols-2 gap-3 min-[420px]:flex min-[420px]:flex-wrap min-[420px]:items-end">
            {/* Staff ID Input */}
            <div className="w-full sm:w-[220px]">
              <SearchableStaffInput
                value={staffId}
                onChange={setStaffId}
                placeholder={controls.search_bar.placeholder}
              />
              {inputError && <p className="mt-1.5 text-sm text-amber-600">{inputError}</p>}
            </div>

            {/* Date Select */}
            <div className="w-full min-[420px]:w-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus-within:border-[#59A14F] focus-within:bg-white transition">
                <i className="bx bx-calendar text-lg text-slate-500" />
                <input
                  type="date"
                  max={TODAY}
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="w-full bg-transparent font-medium outline-none"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              onClick={handleShowReport}   // Changed to onClick if not using form submit
              className="h-12 w-full min-[420px]:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#59A14F] px-5 text-sm font-semibold text-white transition hover:bg-[#4B8A42]"
            >
              <i className="bx bx-search text-base" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {showReport ? (
        <div className="flex flex-col gap-1 w-full mt-1">
          {/* Alert Box */}
          <div className="w-full px-4 py-3 bg-white/90 rounded-xl shadow-sm border-l-2 border-red-500 flex justify-between items-center">
            <div className="flex justify-start items-start gap-4">
              <div className="h-10 w-10 bg-red-500/10 rounded-full flex justify-center items-center flex-shrink-0">
                <div className="w-4 h-2.5 bg-red-500 rounded-sm" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-900 text-base font-semibold leading-5">
                  65% Achieved • Expected 72% • Behind by 7%
                </div>
                <div className="text-slate-500 text-sm font-normal leading-5">
                  Need <span className="text-slate-900 font-bold">৳ 70,000</span> to reach today's pace.
                </div>
              </div>
            </div>
          </div>

          {/* Four Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 w-full">
            {/* Target */}
            <div className="flex-1 px-5 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-2.5">
              <div className="w-full flex justify-between items-center">
                <div className="text-slate-500 text-xs font-medium uppercase">Target</div>
                <div className="h-4 w-4 relative overflow-hidden flex items-center justify-center">
                  <div className="h-3.5 w-3.5 outline outline-2 outline-offset-[-1px] outline-slate-500 rounded-full" />
                </div>
              </div>
              <div className="text-slate-900 text-xl font-bold">10,00,000</div>
            </div>
            
            {/* Achieved */}
            <div className="flex-1 px-5 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-2.5">
              <div className="w-full flex justify-between items-center">
                <div className="text-slate-500 text-xs font-medium uppercase">Achieved</div>
                <div className="h-4 w-4 relative overflow-hidden flex items-center justify-center">
                  <div className="w-3 h-2 outline outline-2 outline-offset-[-1px] outline-emerald-500" />
                </div>
              </div>
              <div className="text-emerald-500 text-xl font-bold">7,20,000</div>
            </div>

            {/* Achievement Rate */}
            <div className="flex-1 px-5 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-2.5">
              <div className="w-full flex justify-between items-center">
                <div className="text-slate-500 text-xs font-medium uppercase">Achievement Rate</div>
                <div className="h-4 w-4 relative overflow-hidden flex items-center justify-center">
                  <div className="w-3.5 h-3.5 outline outline-2 outline-offset-[-1px] outline-amber-500 rounded-sm" />
                </div>
              </div>
              <div className="text-amber-500 text-xl font-bold">72%</div>
            </div>

            {/* Gap */}
            <div className="flex-1 px-5 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-2.5">
              <div className="w-full flex justify-between items-center">
                <div className="text-slate-500 text-xs font-medium uppercase">Gap</div>
                <div className="h-4 w-4 relative overflow-hidden flex items-center justify-center">
                  <div className="w-2.5 h-2.5 outline outline-2 outline-offset-[-1px] outline-red-500 rotate-45" />
                </div>
              </div>
              <div className="text-red-500 text-xl font-bold">6,50,000</div>
            </div>
          </div>

          {/* Bottom Layout: Left and Right Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-1 w-full">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-1 w-full min-w-0">
              {/* Target vs Achieved Progress */}
              <div className="w-full px-4 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-3">
                <div className="text-slate-900 text-sm font-semibold">Target vs Achieved Progress</div>
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full h-6 bg-slate-50 rounded-sm flex overflow-hidden">
                    <div className="w-[55%] h-full bg-emerald-500" />
                    <div className="w-[17%] h-full opacity-60 bg-amber-500" />
                  </div>
                  <div className="w-full flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                        <div className="text-slate-500 text-xs font-normal">55% Achieved</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 bg-amber-500 rounded-full" />
                        <div className="text-slate-500 text-xs font-normal">17% Pending Expected</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <div className="text-slate-900 text-xs font-semibold">72% Expected</div>
                      <div className="px-2 py-1 bg-red-500 rounded-sm flex items-center justify-center">
                        <div className="text-white text-[10px] font-bold">-70,000 GAP</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Representative Performance */}
              <div className="w-full bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col">
                <div className="w-full px-4 py-3 flex flex-wrap justify-between items-center gap-3 border-b border-slate-200">
                  <div className="text-slate-900 text-sm font-semibold">Representative Performance</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-500 text-xs font-medium leading-4">Sort by</div>
                      <select className="px-3 py-1.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-300 text-slate-700 text-xs font-medium">
                        <option>Low performance</option>
                        <option>High performance</option>
                      </select>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <i className="bx bx-search" />
                      </span>
                      <input
                        type="text"
                        placeholder="Enter Staff ID"
                        className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-0.50px] outline-slate-200 text-xs text-slate-700 focus:outline-sky-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[700px] w-full">
                    {/* Table Header */}
                    <div className="w-full px-5 py-2.5 bg-slate-50 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 border-b border-slate-200">
                      <div className="text-slate-500 text-[10px] font-semibold uppercase">Representative</div>
                      <div className="text-center text-slate-500 text-[10px] font-semibold uppercase">Status</div>
                      <div className="text-right text-slate-500 text-[10px] font-semibold uppercase">Target</div>
                      <div className="text-right text-slate-500 text-[10px] font-semibold uppercase">Achieved</div>
                      <div className="text-center text-slate-500 text-[10px] font-semibold uppercase">Gap</div>
                      <div className="text-center text-slate-500 text-[10px] font-semibold uppercase">Progress</div>
                    </div>

                    {/* Row 1 */}
                    <div className="w-full px-5 py-3 border-b border-slate-200 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-slate-900 text-xs font-semibold">RK</div>
                        <div className="text-slate-900 text-xs font-medium truncate">Rahul Kumar</div>
                      </div>
                      <div className="flex justify-center">
                        <div className="px-2 py-1 bg-emerald-100 rounded-full">
                          <div className="text-emerald-600 text-[10px] font-semibold">On Track</div>
                        </div>
                      </div>
                      <div className="text-right text-slate-900 text-xs font-normal">2,00,000</div>
                      <div className="text-right text-slate-900 text-xs font-normal">1,85,000</div>
                      <div className="text-center text-emerald-500 text-xs font-semibold">-15,000</div>
                      <div className="flex items-center gap-2 pl-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[74%]" />
                        </div>
                        <div className="text-slate-900 text-xs font-semibold">74%</div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="w-full px-5 py-3 border-b border-slate-200 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-slate-900 text-xs font-semibold">PS</div>
                        <div className="text-slate-900 text-xs font-medium truncate">Priya Sharma</div>
                      </div>
                      <div className="flex justify-center">
                        <div className="px-2 py-1 bg-red-100 rounded-full">
                          <div className="text-red-500 text-[10px] font-semibold">Behind</div>
                        </div>
                      </div>
                      <div className="text-right text-slate-900 text-xs font-normal">3,00,000</div>
                      <div className="text-right text-slate-900 text-xs font-normal">1,90,000</div>
                      <div className="text-center text-red-500 text-xs font-semibold">-60,000</div>
                      <div className="flex items-center gap-2 pl-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 w-[63%]" />
                        </div>
                        <div className="text-slate-900 text-xs font-semibold">63%</div>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="w-full px-5 py-3 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-2 items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-slate-900 text-xs font-semibold">AP</div>
                        <div className="text-slate-900 text-xs font-medium truncate">Amit Patel</div>
                      </div>
                      <div className="flex justify-center">
                        <div className="px-2 py-1 bg-amber-100 rounded-full">
                          <div className="text-amber-600 text-[10px] font-semibold">At Risk</div>
                        </div>
                      </div>
                      <div className="text-right text-slate-900 text-xs font-normal">2,50,000</div>
                      <div className="text-right text-slate-900 text-xs font-normal">1,45,000</div>
                      <div className="text-center text-amber-500 text-xs font-semibold">-55,000</div>
                      <div className="flex items-center gap-2 pl-4">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[58%]" />
                        </div>
                        <div className="text-slate-900 text-xs font-semibold">58%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-1 w-full">
              {/* Achievement Gap Breakdown */}
              <div className="w-full px-4 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col gap-3">
                <div className="text-slate-900 text-sm font-semibold">Achievement Gap Breakdown</div>
                <div className="w-full flex items-center gap-5">
                  <div className="h-24 w-24 relative flex-shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[8px] border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-[8px] border-amber-500 border-t-transparent border-r-transparent rotate-45" />
                    <div className="text-slate-900 text-xl font-bold z-10">72%</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-slate-500 text-xs font-normal">Current Shortfall</div>
                    <div className="text-red-500 text-2xl font-bold">-70,000</div>
                    <div className="text-slate-500 text-xs font-normal leading-4">The team is currently 7% behind the active target.</div>
                  </div>
                </div>
                <div className="w-full flex gap-3 mt-2">
                  <div className="flex-1 px-3 py-2.5 bg-slate-50 rounded-lg flex flex-col gap-1">
                    <div className="text-slate-500 text-[10px] font-semibold uppercase">Expected</div>
                    <div className="text-slate-900 text-base font-bold">72%</div>
                  </div>
                  <div className="flex-1 px-3 py-2.5 bg-slate-50 rounded-lg flex flex-col gap-1">
                    <div className="text-slate-500 text-[10px] font-semibold uppercase">Actual</div>
                    <div className="text-amber-500 text-base font-bold">65%</div>
                  </div>
                </div>
              </div>

              {/* Top & Bottom Performers */}
              <div className="w-full px-5 py-3 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col gap-2.5">
                <div className="text-slate-900 text-sm font-semibold">Top & Bottom Performers</div>
                <div className="w-full flex flex-col gap-2.5">
                  {/* Top Performer */}
                  <div className="w-full px-3 py-2 bg-slate-50 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 bg-emerald-100 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-semibold">RK</div>
                      <div className="text-slate-900 text-xs font-medium">Rahul Kumar</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="bx bx-up-arrow-alt text-emerald-500" />
                      <div className="text-emerald-500 text-xs font-bold">74%</div>
                    </div>
                  </div>
                  {/* Bottom Performer */}
                  <div className="w-full px-3 py-2 bg-slate-50 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 bg-red-200 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-semibold">AP</div>
                      <div className="text-slate-900 text-xs font-medium">Amit Patel</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="bx bx-down-arrow-alt text-red-500" />
                      <div className="text-red-500 text-xs font-bold">58%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section className="min-h-screen w-full max-w-full overflow-hidden rounded-[5px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-500">
            <i className="bx bx-bar-chart-alt-2" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">No report loaded yet</h3>
          <p className="mt-2 text-sm text-slate-500">Enter a staff ID, choose the month, and click Show to load the performance data.</p>
        </section>
      )}
    </div>
  );
}
