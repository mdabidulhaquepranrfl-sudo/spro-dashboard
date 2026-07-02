'use client';

import { useEffect, useMemo, useState } from 'react';
// import { getReportData } from '@/lib/getReportData';
import PerformanceSummaryTable from './PerformanceSummaryTable';

const PERFORMANCE_TABS = [
  { id: 'thana_wise', label: 'Thana Wise' },
  { id: 'zone_wise', label: 'Zone Wise' },
  { id: 'district_wise', label: 'District Wise' },
];

const THANA_SUMMARY = [
  { id: 'total_thanas', label: 'TOTAL THANAS', value: '-', icon: 'location_pin', theme: { icon_bg: '#E0F2FE', icon_color: '#0284C7', text_color: '#111827' } },
  { id: 'visited_thanas', label: 'VISITED THANAS', value: '-', icon: 'check_circle', theme: { icon_bg: '#DCFCE7', icon_color: '#16A34A', text_color: '#22C55E' } },
  { id: 'pending_thanas', label: 'PENDING THANAS', value: '-', icon: 'warning_triangle', theme: { icon_bg: '#FEE2E2', icon_color: '#DC2626', text_color: '#EF4444' } },
];

const PERFORMANCE_VIEWS = {
  thana_wise: {
    title: 'Thana Performance Summary',
    summaryCards: THANA_SUMMARY,
    table: {
      headers: [
        { id: 'sl', label: 'SL' },
        { id: 'thana_name', label: 'THANA NAME' },
        { id: 'total_shops', label: 'TOTAL SHOPS' },
        { id: 'shops_visited', label: 'VISITED SHOPS' },
        { id: 'avg_shop_visit_duration', label: 'AVG SHOP VISIT DURATION' },
        { id: 'number_of_days', label: 'NUMBER OF DAYS' },
      ],
      rows: [
        {
          sl: 1,
          thana_name: 'Dhanmondi',
          total_shops: 120,
          shops_visited: 98,
          avg_shop_visit_duration: '00:18:25',
          number_of_days: 12,
        },
        {
          sl: 2,
          thana_name: 'Gulshan',
          total_shops: 95,
          shops_visited: 76,
          avg_shop_visit_duration: '00:22:10',
          number_of_days: 10,
        },
        {
          sl: 3,
          thana_name: 'Mirpur',
          total_shops: 150,
          shops_visited: 134,
          avg_shop_visit_duration: '00:15:40',
          number_of_days: 15,
        },
        {
          sl: 4,
          thana_name: 'Uttara',
          total_shops: 88,
          shops_visited: 67,
          avg_shop_visit_duration: '00:19:55',
          number_of_days: 9,
        },
        {
          sl: 5,
          thana_name: 'Mohammadpur',
          total_shops: 110,
          shops_visited: 89,
          avg_shop_visit_duration: '00:17:12',
          number_of_days: 11,
        },
      ],
      emptyMessage: 'No thana data available',
    },
  },
  zone_wise: {
    title: 'Zone Performance Summary',
    summaryCards: [
      {
        id: 'total_zones',
        label: 'TOTAL ZONES',
        value: 188,
        icon: 'location_pin',
        theme: { icon_bg: '#E0F2FE', icon_color: '#0284C7', text_color: '#111827' },
      },
      {
        id: 'visited_zones',
        label: 'VISITED ZONES',
        value: 188,
        icon: 'check_circle',
        theme: { icon_bg: '#DCFCE7', icon_color: '#16A34A', text_color: '#22C55E' },
      },
      {
        id: 'pending_zones',
        label: 'PENDING ZONES',
        value: 0,
        icon: 'warning_triangle',
        theme: { icon_bg: '#FEE2E2', icon_color: '#DC2626', text_color: '#EF4444' },
      },
    ],
    table: {
      headers: [
        { id: 'sl', label: 'SL' },
        { id: 'zone_name', label: 'ZONE NAME' },
        { id: 'total_shops', label: 'TOTAL SHOPS' },
        { id: 'shops_visited', label: 'SHOPS VISITED' },
        { id: 'avg_shop_visit_duration', label: 'AVG SHOP VISIT DURATION' },
        { id: 'number_of_days', label: 'NUMBER OF DAYS' },
      ],
      rows: [
        { sl: 1, zone_name: '9810-OFFICE', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 2, zone_name: '2010-Abu Dhabi', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 3, zone_name: '2022-DUBAI IND', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 4, zone_name: '2024-Sharjah Industrial', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 5, zone_name: '2030-Ajman', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 6, zone_name: '2034-Ras Al Khaimah', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 7, zone_name: '2032-Al Ain', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 8, zone_name: '2040-Umm Al Quwain', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 9, zone_name: '2042-Fujairah', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
        { sl: 10, zone_name: '2044-OVS', total_shops: 3, shops_visited: '1 (33%)', avg_shop_visit_duration: '0s / shop', number_of_days: '0 Days' },
      ],
      rowBgColor: '#F0FDF4',
      borderColor: '#E5E7EB',
    },
  },
  district_wise: {
    title: 'District Performance Summary',
    summaryCards: [
      {
        id: 'total_districts',
        label: 'TOTAL DISTRICTS',
        value: 1,
        icon: 'map_icon',
        theme: { icon_bg: '#E0F2FE', icon_color: '#0284C7', text_color: '#111827' },
      },
      {
        id: 'visited_districts',
        label: 'VISITED DISTRICTS',
        value: 1,
        icon: 'check_circle',
        theme: { icon_bg: '#DCFCE7', icon_color: '#16A34A', text_color: '#22C55E' },
      },
      {
        id: 'pending_districts',
        label: 'PENDING DISTRICTS',
        value: 0,
        icon: 'warning_triangle',
        theme: { icon_bg: '#FEE2E2', icon_color: '#DC2626', text_color: '#EF4444' },
      },
    ],
    table: {
      headers: [
        { id: 'sl', label: 'SL' },
        { id: 'district_name', label: 'DISTRICT NAME' },
        { id: 'total_shops', label: 'TOTAL SHOPS' },
        { id: 'shops_visited', label: 'VISITED SHOPS' },
        { id: 'avg_shop_visit_duration', label: 'AVG SHOP VISIT DURATION' },
        { id: 'number_of_days', label: 'NUMBER OF DAYS' },
      ],
      rows: [
        {
          sl: 1,
          district_name: '98-STF',
          district_badge: { label: 'NON-ASSIGNED', bg_color: '#FEE2E2', text_color: '#EF4444' },
          total_shops: 11,
          shops_visited: '1 (9%)',
          avg_shop_visit_duration: '00:00:00',
          number_of_days: '0 Days',
        },
      ],
      rowBgColor: '#F0FDF4',
      borderColor: '#E5E7EB',
    },
  },
};

const DEFAULT_TTS_DATA = [
  { duration: '0 – 1 minute', value: '0' },
  { duration: '1 – 2 minutes', value: '0' },
  { duration: '2 – 5 minutes', value: '0' },
  { duration: '5 – 10 minutes', value: '0' },
];

const DEFAULT_OUTLET_ACTIVITY = [
  { label: 'CREATED', value: '0', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
  { label: 'UPDATED', value: '0', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { label: 'DELETED', value: '0', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
];

export default function PerformanceAndKPI() {
  const [activeSubTab, setActiveSubTab] = useState('thana_wise');
  const [searchQuery, setSearchQuery] = useState('');
  const [ttsData, setTtsData] = useState(DEFAULT_TTS_DATA);
  const [outletActivity, setOutletActivity] = useState(DEFAULT_OUTLET_ACTIVITY);
  const [performanceData, setPerformanceData] = useState(PERFORMANCE_VIEWS);

  useEffect(() => {
    // API calls — uncomment when ready to integrate

    // Thana Performance
    // async function fetchThanaPerformance() {
    //   try {
    //     const data = await getReportData('thanaPerformance', 'country_id=&staff_id=UAE2704&zone_id=&start_date=2026-06-01&end_date=2026-06-30');
    //     // TODO: set thana performance data from API response
    //   } catch (error) {
    //     console.error('Thana performance fetch error:', error);
    //   }
    // }
    // fetchThanaPerformance();

    // Zone Performance
    // async function fetchZonePerformance() {
    //   try {
    //     const data = await getReportData('zonePerformance', 'country_id=&staff_id=UAE2704&zone_id=&start_date=2026-06-01&end_date=2026-06-30');
    //     // TODO: set zone performance data from API response
    //   } catch (error) {
    //     console.error('Zone performance fetch error:', error);
    //   }
    // }
    // fetchZonePerformance();

    // District Performance
    // async function fetchDistrictPerformance() {
    //   try {
    //     const data = await getReportData('districtPerformance', 'country_id=&staff_id=UAE2704&zone_id=&start_date=2026-06-01&end_date=2026-06-30');
    //     // TODO: set district performance data from API response
    //   } catch (error) {
    //     console.error('District performance fetch error:', error);
    //   }
    // }
    // fetchDistrictPerformance();

    // TTS KPI
    // async function fetchTTSKPI() {
    //   try {
    //     const data = await getReportData('staff/visit-duration-bucket', 'staff_id=UAE2704&start_date=2026-06-01&end_date=2026-06-30');
    //     // TODO: set TTS KPI data from API response
    //     // setTtsData(data);
    //   } catch (error) {
    //     console.error('TTS KPI fetch error:', error);
    //   }
    // }
    // fetchTTSKPI();

    // Outlet Activity
    // async function fetchOutletActivity() {
    //   try {
    //     const data = await getReportData('staff/outlet-activity', 'staff_id=UAE2704&start_date=2026-06-01&end_date=2026-06-30');
    //     // TODO: set outlet activity data from API response
    //     // setOutletActivity(data);
    //   } catch (error) {
    //     console.error('Outlet activity fetch error:', error);
    //   }
    // }
    // fetchOutletActivity();
  }, []);

  const currentView = performanceData[activeSubTab];

  return (
    <div className="grid w-full min-w-0 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Performance Summary</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {PERFORMANCE_TABS.map((tab) => (
              <button key={tab.id} type="button" className={`rounded-full px-3 py-2 text-sm font-medium ${activeSubTab === tab.id ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`} onClick={() => setActiveSubTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
          <label className="relative block w-full max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="bx bx-search text-base" />
            </span>
            {/* <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="text"
              placeholder="Search table content"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            /> */}
          </label>
        </div>

        <div className="w-full min-w-0 p-4 sm:p-6">
          <PerformanceSummaryTable
            title={currentView.title}
            summaryCards={currentView.summaryCards}
            headers={currentView.table.headers}
            rows={currentView.table.rows}
            searchQuery={searchQuery}
            emptyMessage={currentView.table.emptyMessage || 'No data available for this view'}
          />
        </div>
      </section>

      <section className="w-full min-w-0 space-y-4">
        <div className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
                {ttsData.map((row) => (
                  <tr key={row.duration} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-700">{row.duration}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Outlet Activity</h3>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {outletActivity.map((item) => (
              <div key={item.label} className={`rounded-3xl border ${item.border} ${item.bg} p-5 shadow-sm`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${item.text}`}>{item.label}</p>
                <p className={`mt-4 text-3xl font-extrabold ${item.text}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
