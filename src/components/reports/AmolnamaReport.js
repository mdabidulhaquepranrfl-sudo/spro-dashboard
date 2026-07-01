'use client';

import { useMemo, useState } from 'react';

const DEFAULT_METRICS = [
  { label: 'TOTAL OUTLETS', value: '1844', icon: 'bx-shopping-bag', color: 'primary' },
  { label: 'TOTAL VISITS', value: '99', icon: 'bx-user', color: 'info' },
  { label: 'UNIQUE VISITS', value: '74', icon: 'bx-map-pin', color: 'success' },
  { label: 'VISIT COVERAGE', value: '4.01%', icon: 'bx-map', color: 'warning' },
  { label: 'NO. OF ORDERS', value: '53', icon: 'bx-cart', color: 'danger' },
  { label: 'ORDER VALUE', value: '5.8', icon: 'bx-dollar', color: 'secondary' },
  { label: 'DEL. AMOUNT', value: '3.31', icon: 'bx-truck', color: 'primary' },
  { label: 'LPC', value: '2.85', icon: 'bx-bar-chart-alt-2', color: 'info' },
  { label: 'ND', value: '-17', icon: 'bx-calendar-x', color: 'success' },
];

const METRIC_COLOR_STYLES = {
  primary: { card: 'bg-sky-50/80', badge: 'bg-sky-100 text-sky-700' },
  info: { card: 'bg-cyan-50/80', badge: 'bg-cyan-100 text-cyan-700' },
  success: { card: 'bg-emerald-50/80', badge: 'bg-emerald-100 text-emerald-700' },
  warning: { card: 'bg-amber-50/80', badge: 'bg-amber-100 text-amber-700' },
  danger: { card: 'bg-rose-50/80', badge: 'bg-rose-100 text-rose-700' },
  secondary: { card: 'bg-slate-50', badge: 'bg-slate-200 text-slate-700' },
};

const PERFORMANCE_TABS = [
  { id: 'thana_wise', label: 'Thana Wise' },
  { id: 'zone_wise', label: 'Zone Wise' },
  { id: 'district_wise', label: 'District Wise' },
];

const ICON_MAP = {
  location_pin: 'bx-map-pin',
  check_circle: 'bx-check-circle',
  warning_triangle: 'bx-error-circle',
  map_icon: 'bx-map',
  users_group: 'bx-group',
};

const SUMMARY_ICON_MAP = {
  calendar: 'bx-calendar',
  clock: 'bx-time-five',
  briefcase: 'bx-briefcase',
  calendar_check: 'bx-calendar-check',
  map: 'bx-map',
  shopping_bag: 'bx-shopping-bag',
  person: 'bx-user',
  location_pin: 'bx-map-pin',
  shopping_cart: 'bx-cart',
  dollar_sign: 'bx-dollar',
  delivery_truck: 'bx-truck',
  bar_chart: 'bx-bar-chart-alt-2',
  calendar_cross: 'bx-calendar-x',
};

const DASHBOARD_LAYOUT = {
  left_column: {
    sections: [
      {
        id: 'daily_summary',
        title: 'Daily Summary',
        badge: {
          label: 'FIELD PERFORMANCE',
          bg_color: '#E0E7FF',
          text_color: '#2563EB',
        },
        metrics: [
          { label: 'ACTIVITY DAY', value: '0', icon: 'calendar', theme: { icon_bg: '#EEF2FF', icon_color: '#3730A3', label_color: '#1E3A8A', value_color: '#1E40AF' } },
          { label: 'FIRST / LAST ACTIVITY', value: '—', icon: 'clock', theme: { icon_bg: '#FEF3C7', icon_color: '#B45309', label_color: '#92400E', value_color: '#7C2D12' } },
          { label: 'TOTAL RETAIL ACT', value: '0', icon: 'briefcase', theme: { icon_bg: '#ECFDF5', icon_color: '#059669', label_color: '#047857', value_color: '#065F46' } },
          { label: 'AVG RETAIL ACT', value: '0', icon: 'briefcase', theme: { icon_bg: '#FDE68A', icon_color: '#B45309', label_color: '#92400E', value_color: '#7C2D12' } },
          { label: 'OTHER ACTIVITIES', value: '0', icon: 'calendar_check', theme: { icon_bg: '#E0F2FE', icon_color: '#0369A1', label_color: '#075985', value_color: '#0C4A6E' } },
          { label: 'AVG TTS', value: '00:00:00', icon: 'clock', theme: { icon_bg: '#FEE2E2', icon_color: '#DC2626', label_color: '#991B1B', value_color: '#7F1D1D' } },
          { label: 'DAILY TTS', value: '00:00:00', icon: 'clock', theme: { icon_bg: '#EDE9FE', icon_color: '#7C3AED', label_color: '#5B21B6', value_color: '#4C1D95' } },
        ],
      },
      {
        id: 'visited_summary',
        title: 'Visited Summary',
        badge: {
          label: 'OUTLET PERFORMANCE',
          bg_color: '#E0E7FF',
          text_color: '#2563EB',
        },
        metrics: [
          { label: 'TOTAL OUTLETS', value: '1844', icon: 'shopping_bag', theme: { icon_bg: '#F8FAFC', icon_color: '#0F172A', label_color: '#0F172A', value_color: '#0F172A' } },
          { label: 'TOTAL VISITS', value: '99', icon: 'person', theme: { icon_bg: '#ECFDF5', icon_color: '#15803D', label_color: '#166534', value_color: '#14532D' } },
          { label: 'UNIQUE VISITS', value: '74', icon: 'location_pin', theme: { icon_bg: '#EFF6FF', icon_color: '#2563EB', label_color: '#1D4ED8', value_color: '#1E40AF' } },
          { label: 'VISIT COVERAGE', value: '4.01%', icon: 'map', theme: { icon_bg: '#FFF7ED', icon_color: '#C2410C', label_color: '#9A3412', value_color: '#7C2D12' } },
          { label: 'NO. OF ORDERS', value: '53', icon: 'shopping_cart', theme: { icon_bg: '#FEE2E2', icon_color: '#BE123C', label_color: '#9F1239', value_color: '#881337' } },
          { label: 'ORDER VALUE', value: '5.8', icon: 'dollar_sign', theme: { icon_bg: '#ECFDF5', icon_color: '#047857', label_color: '#065F46', value_color: '#064E3B' } },
          { label: 'DEL. AMOUNT', value: '3.31', icon: 'delivery_truck', theme: { icon_bg: '#E0F2FE', icon_color: '#0369A1', label_color: '#075985', value_color: '#0C4A6E' } },
          { label: 'LPC', value: '2.85', icon: 'bar_chart', theme: { icon_bg: '#EDE9FE', icon_color: '#7C3AED', label_color: '#5B21B6', value_color: '#4C1D95' } },
          { label: 'ND', value: '-17', icon: 'calendar_cross', theme: { icon_bg: '#FEE2E2', icon_color: '#DC2626', label_color: '#B91C1C', value_color: '#991B1B' } },
        ],
      },
    ],
  },
  right_column: {
    sections: [
      {
        id: 'step_count',
        title: 'Step Count',
        badge: {
          label: 'STEP PERFORMANCE',
          bg_color: '#FCE7F3',
          text_color: '#DB2777',
        },
        chart_type: 'vertical_bar_chart',
        y_axis: {
          min: 0,
          max: 3500,
          step: 500,
        },
        x_axis_data: [
          { date: '06-29', steps: 3374, bar_color: '#3498DB' },
          { date: '06-30', steps: 2178, bar_color: '#3498DB' },
          { date: '07-01', steps: 0, bar_color: '#3498DB' },
        ],
      },
    ],
  },
};

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
      rows:  [
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
    coWorkReport: {
      title: 'Co-Work Report',
      badge: { label: 'TEAM COLLABORATION', bg_color: '#EFF6FF', text_color: '#3B82F6' },
      headers: [
        { id: 'sl', label: 'SL' },
        { id: 'date', label: 'DATE' },
        { id: 'co_worker_name', label: 'CO-WORKER NAME' },
        { id: 'status', label: 'STATUS' },
      ],
      rows: [],
      emptyState: { message: 'No co-work activity found', text_color: '#4B5563' },
    },
  },
};

const FIELD_PERFORMANCE_SUMMARY = [
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

const CO_WORK_REPORT = {
  id: 'co_work_report',
  title: 'Co-Work Report',
  icon: 'users_group',
  badge: {
    label: 'TEAM COLLABORATION',
    bg_color: '#EFF6FF',
    text_color: '#3B82F6',
  },
  data_table: {
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
    rows: [
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
    ],
    empty_state: {
      message: 'No co-work activity found',
      text_color: '#000000',
      padding: 'py-6',
    },
    styling: {
      border_color: '#F3F4F6',
      header_text_color: '#1F2937',
      header_font_weight: 'bold',
    },
  },
};

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
  const [activeTab, setActiveTab] = useState('visited_summary');
  const [activeSubTab, setActiveSubTab] = useState('thana_wise');
  const [isThanaExpanded, setIsThanaExpanded] = useState(true);
  const [employeeId, setEmployeeId] = useState('397921');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  const formattedStartDate = formatDisplayDate(startDate);
  const formattedEndDate = formatDisplayDate(endDate);
  const selectedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
  const reportHeading = `Insights for ${employeeId || '—'} - MIS-Dev-Shobuj Mia`;

  const normalizeRow = (row) => {
    return Object.values(row).flatMap((value) => {
      if (value == null) return [];
      if (typeof value === 'object') return Object.values(value).map((nested) => String(nested).toLowerCase());
      return String(value).toLowerCase();
    });
  };

  const filteredPerformanceRows = useMemo(() => {
    const rows = PERFORMANCE_VIEWS[activeSubTab].table.rows;
    if (!searchQuery.trim()) return rows;

    const term = searchQuery.toLowerCase();
    return rows.filter((row) => normalizeRow(row).some((cell) => cell.includes(term)));
  }, [activeSubTab, searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();

    if (!employeeId.trim() || !startDate || !endDate) {
      setSearchError('Please enter employee ID and both dates to load the report.');
      setHasSearched(false);
      return;
    }

    setSearchError('');
    setHasSearched(true);
    setMetrics(DEFAULT_METRICS.map((metric) => ({ ...metric })));
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Amolnama Report</p> */}
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Supervisor Performance Ledger {reportHeading}</h2>
            {/* <p className="mt-2 max-w-2xl break-words text-sm text-slate-500">{reportHeading}</p> */}
          </div>
        </div>

        <form className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-[1.2fr_1fr_1fr_auto]" onSubmit={handleSearch}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Employee ID</label>
            <input type="text" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:bg-white" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} placeholder="Enter employee ID" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Start date</label>
            <input type="date" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-500 focus:bg-white" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">End date</label>
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
            {DASHBOARD_LAYOUT.left_column.sections.map((section) => (
              <section key={section.id} className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-3 py-2 sm:px-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">{section.title}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600" style={{ backgroundColor: section.badge.bg_color, color: section.badge.text_color }}>
                      {section.badge.label}
                    </span>
                  </div>
                </div>
                <div className="p-2 sm:p-3">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    {section.metrics.map((metric) => (
                      <div key={metric.label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ backgroundColor: metric.theme?.icon_bg ?? '#F8FAFC', color: metric.theme?.icon_color ?? '#0F172A' }}>
                            <i className={`bx ${SUMMARY_ICON_MAP[metric.icon] ?? 'bx-stats'} text-base`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: metric.theme?.label_color ?? '#475569' }}>{metric.label}</p>
                            <p className="mt-1 text-lg font-extrabold break-words" style={{ color: metric.theme?.value_color ?? '#0f172a' }}>{metric.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600">{DASHBOARD_LAYOUT.right_column.sections[0].title}</p>
                {/* <h3 className="mt-2 text-xl font-semibold text-slate-900">{DASHBOARD_LAYOUT.right_column.sections[0].title}</h3> */}
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: DASHBOARD_LAYOUT.right_column.sections[0].badge.bg_color, color: DASHBOARD_LAYOUT.right_column.sections[0].badge.text_color }}>
                {DASHBOARD_LAYOUT.right_column.sections[0].badge.label}
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Steps</span>
                  <span>{DASHBOARD_LAYOUT.right_column.sections[0].y_axis.max}</span>
                </div>
                <div className="mt-4 flex items-end gap-3 h-56">
                  {DASHBOARD_LAYOUT.right_column.sections[0].x_axis_data.map((point) => {
                    const height = Math.max((point.steps / DASHBOARD_LAYOUT.right_column.sections[0].y_axis.max) * 100, 4);
                    return (
                      <div key={point.date} className="flex-1 text-center">
                        <div className="relative mx-auto h-48 w-full overflow-hidden rounded-3xl bg-slate-100">
                          <div className="absolute bottom-0 left-0 right-0 rounded-b-3xl" style={{ height: `${height}%`, backgroundColor: point.bar_color }} />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{point.date}</p>
                        <p className="text-xs text-slate-500">{point.steps}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">YAxis scale</p>
                <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
                  {Array.from({ length: (DASHBOARD_LAYOUT.right_column.sections[0].y_axis.max / DASHBOARD_LAYOUT.right_column.sections[0].y_axis.step) + 1 }, (_, index) => (
                    <span key={index} className="rounded-2xl bg-white px-2 py-1 shadow-sm">
                      {index * DASHBOARD_LAYOUT.right_column.sections[0].y_axis.step}
                    </span>
                  ))}
                </div>
              </div> */}
            </div>
          </section>
        </div>
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
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    type="text"
                    placeholder="Search table content"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </label>
              </div>

              <div className="w-full min-w-0 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {PERFORMANCE_VIEWS[activeSubTab].summaryCards.map((card) => (
                    <div key={card.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm" style={{ backgroundColor: card.theme.icon_bg, color: card.theme.icon_color }}>
                          <i className={`bx ${ICON_MAP[card.icon] ?? 'bx-help-circle'}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: card.theme.text_color }}>{card.label}</p>
                          <p className="mt-1 text-2xl font-bold leading-tight" style={{ color: card.theme.text_color }}>{card.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 w-full max-w-full overflow-x-auto rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <h4 className="text-lg font-semibold text-slate-900">{PERFORMANCE_VIEWS[activeSubTab].title}</h4>
                    {activeSubTab === 'district_wise' ? <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: PERFORMANCE_VIEWS.district_wise.coWorkReport.badge.bg_color, color: PERFORMANCE_VIEWS.district_wise.coWorkReport.badge.text_color }}>{PERFORMANCE_VIEWS.district_wise.coWorkReport.badge.label}</span> : null}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                          {PERFORMANCE_VIEWS[activeSubTab].table.headers.map((header) => (
                            <th key={header.id} className="px-4 py-3 font-semibold">{header.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredPerformanceRows.length > 0 ? (
                          filteredPerformanceRows.map((row) => (
                            <tr key={row.sl} className="bg-slate-50/50">
                              <td className="px-4 py-3">{row.sl}</td>
                              <td className="px-4 py-3">{row.district_badge ? <div className="flex items-center gap-2"><span className="rounded-full px-2 py-1 text-xs font-semibold" style={{ backgroundColor: row.district_badge.bg_color, color: row.district_badge.text_color }}>{row.district_badge.label}</span><span>{row.district_name}</span></div> : (row.zone_name || row.district_name)}</td>
                              <td className="px-4 py-3">{row.total_shops}</td>
                              <td className="px-4 py-3">{row.shops_visited}</td>
                              <td className="px-4 py-3">{row.avg_shop_visit_duration}</td>
                              <td className="px-4 py-3">{row.number_of_days}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={PERFORMANCE_VIEWS[activeSubTab].table.headers.length} className="px-4 py-6 text-center text-slate-500">No data available for this view</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {activeSubTab === 'district_wise' ? (
                  <div className="mt-6 w-full max-w-full overflow-x-auto rounded-2xl border border-slate-200">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <h4 className="font-semibold text-slate-900">{PERFORMANCE_VIEWS.district_wise.coWorkReport.title}</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-[620px] divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50 text-left text-slate-600">
                          <tr>
                            {PERFORMANCE_VIEWS.district_wise.coWorkReport.headers.map((header) => (
                              <th key={header.id} className="px-4 py-3 font-semibold">{header.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {PERFORMANCE_VIEWS.district_wise.coWorkReport.rows.length > 0 ? (
                            PERFORMANCE_VIEWS.district_wise.coWorkReport.rows.map((row) => (
                              <tr key={row.sl}>
                                <td className="px-4 py-3">{row.sl}</td>
                                <td className="px-4 py-3">{row.date}</td>
                                <td className="px-4 py-3">{row.co_worker_name}</td>
                                <td className="px-4 py-3">{row.status}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={PERFORMANCE_VIEWS.district_wise.coWorkReport.headers.length} className="px-4 py-6 text-center text-slate-500">{PERFORMANCE_VIEWS.district_wise.coWorkReport.emptyState.message}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
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
                      {[
                        { duration: '0 – 1 minute', value: '0' },
                        { duration: '1 – 2 minutes', value: '0' },
                        { duration: '2 – 5 minutes', value: '0' },
                        { duration: '5 – 10 minutes', value: '0' },
                      ].map((row) => (
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
                  {[
                    { label: 'CREATED', value: '1', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
                    { label: 'UPDATED', value: '0', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                    { label: 'DELETED', value: '0', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-3xl border ${item.border} ${item.bg} p-5 shadow-sm`}>
                      <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${item.text}`}>{item.label}</p>
                      <p className={`mt-4 text-3xl font-extrabold ${item.text}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{CO_WORK_REPORT.title}</h3>
                <p className="mt-1 text-sm text-slate-500">Collaborative visit performance compared with last week.</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: CO_WORK_REPORT.badge.bg_color, color: CO_WORK_REPORT.badge.text_color }}>
                {CO_WORK_REPORT.badge.label}
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm" style={{ borderColor: CO_WORK_REPORT.data_table.styling.border_color }}>
                <thead className="bg-slate-50 text-left" style={{ color: CO_WORK_REPORT.data_table.styling.header_text_color, fontWeight: CO_WORK_REPORT.data_table.styling.header_font_weight === 'bold' ? 700 : 400 }}>
                  <tr>
                    {CO_WORK_REPORT.data_table.headers.map((header) => (
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
                  {CO_WORK_REPORT.data_table.rows.length > 0 ? (
                    CO_WORK_REPORT.data_table.rows.map((row) => (
                      <tr key={row.sl} className="bg-slate-50/50">
                        {CO_WORK_REPORT.data_table.headers.map((header) => (
                          <td key={header.id} className="px-3 py-3 align-top text-slate-700">
                            {row[header.id]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={CO_WORK_REPORT.data_table.headers.length} className={`px-3 ${CO_WORK_REPORT.data_table.empty_state.padding} text-center`} style={{ color: CO_WORK_REPORT.data_table.empty_state.text_color }}>
                        {CO_WORK_REPORT.data_table.empty_state.message}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Field Operations Snapshot</h3>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">Live overview</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
              {FIELD_PERFORMANCE_SUMMARY.map((item) => (
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
