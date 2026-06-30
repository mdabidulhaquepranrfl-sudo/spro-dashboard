'use client';

import { useState } from 'react';

const DEFAULT_METRICS = [
  { label: 'TOTAL OUTLETS', value: '3', icon: 'bx-store-alt', color: 'primary' },
  { label: 'TOTAL VISITS', value: '1', icon: 'bx-user-voice', color: 'info' },
  { label: 'UNIQUE VISITS', value: '1', icon: 'bx-map-pin', color: 'success' },
  { label: 'VISIT COVERAGE', value: '33.33%', icon: 'bx-analyse', color: 'warning' },
  { label: 'NO. OF ORDERS', value: '0', icon: 'bx-shopping-bag', color: 'danger' },
  { label: 'ORDER VALUE', value: '0', icon: 'bx-dollar', color: 'secondary' },
  { label: 'DEL. AMOUNT', value: '0', icon: 'bx-package', color: 'primary' },
  { label: 'LPC', value: '0', icon: 'bx-chart', color: 'info' },
  { label: 'ND', value: '+1', icon: 'bx-calendar-check', color: 'success' },
];

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
      rows: [],
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
    id: 'tts_kpi',
    title: 'TTS KPI',
    icon: 'bx-time-five',
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    badge: {
      label: 'Time Spent Distribution',
      bgColor: '#EFF6FF',
      textColor: '#3B82F6',
    },
    dataTable: {
      headers: [
        { id: 'duration', label: 'DURATION', align: 'left' },
        { id: 'no_of_outlets', label: 'NO. OF OUTLETS', align: 'left' },
      ],
      rows: [
        { duration: '0 – 1 minute', no_of_outlets: 0 },
        { duration: '1 – 2 minutes', no_of_outlets: 0 },
        { duration: '2 – 5 minutes', no_of_outlets: 0 },
        { duration: '5 – 10 minutes', no_of_outlets: 0 },
      ],
    },
  },
  {
    id: 'outlet_activity',
    title: 'Outlet Activity',
    icon: 'bx-store-alt',
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
    metrics: [
      { label: 'CREATED', value: 1, textColor: '#2563EB' },
      { label: 'UPDATED', value: 0, textColor: '#16A34A' },
      { label: 'DELETED', value: 0, textColor: '#DC2626' },
    ],
  },
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
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  const formattedStartDate = formatDisplayDate(startDate);
  const formattedEndDate = formatDisplayDate(endDate);
  const selectedDateRange = `${formattedStartDate} - ${formattedEndDate}`;
  const reportHeading = `Insights for ${employeeId || '—'} - MIS-Dev-Shobuj Mia over the selected period.`;

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
    <div className="container-xxl flex-grow-1 p-0">
      <div className="row g-4 mb-6">
        <div className="col-12">
          <div className="card h-100 border-start border-5 border-primary">
            <div className="card-body d-flex flex-column justify-content-between h-100">
              <div>
                <small className="text-muted text-uppercase fw-semibold" style={{ letterSpacing: '0.4px' }}>
                  Amolnama Report
                </small>
                <h3 className="fw-bold mt-2 mb-1 text-dark">Supervisor Performance Ledger</h3>
                <p className="text-muted mb-0">{reportHeading}</p>
              </div>
              <form className="row g-3 mt-4" onSubmit={handleSearch}>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold text-dark mb-1">Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={employeeId}
                    onChange={(event) => setEmployeeId(event.target.value)}
                    placeholder="Enter employee ID"
                  />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold text-dark mb-1">Start date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold text-dark mb-1">End date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100">Search</button>
                </div>
                {searchError ? (
                  <div className="col-12">
                    <div className="alert alert-warning py-2 px-3 mb-0" role="alert">
                      {searchError}
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>

      </div>
      {hasSearched ? (
        <div className="row g-4">
          <div className="card mb-6">
            <div className="card-header p-0">
              <div className="nav-align-top">
                <ul className="nav nav-tabs border-bottom px-4" role="tablist">
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link py-3 ${activeTab === 'visited_summary' ? 'active' : ''}`}
                      onClick={() => setActiveTab('visited_summary')}
                    >
                      <i className="bx bx-show me-2" />
                      Visited Summary
                    </button>
                  </li>
                  <li className="nav-item">
                    {/* <button
                  type="button"
                  className={`nav-link py-3 ${activeTab === 'outlet_performance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('outlet_performance')}
                >
                  <i className="bx bx-trending-up me-2" />
                  Outlet Performance
                </button> */}
                  </li>
                </ul>
              </div>
            </div>

            <div className="card-body pt-6">
              <div className="row g-4">
                {metrics.map((metric) => (
                  <div key={metric.label} className="col-6 col-sm-6 col-md-4 col-xl-3">
                    <div className="card shadow-none border h-100">
                      <div className="card-body p-4 d-flex align-items-center gap-3">
                        <div className={`avatar flex-shrink-0 bg-label-${metric.color} p-2 rounded`}>
                          <i className={`bx ${metric.icon} fs-3 text-${metric.color}`} />
                        </div>
                        <div>
                          <small className="text-muted d-block fw-semibold text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                            {metric.label}
                          </small>
                          <h4 className="mb-0 fw-bold mt-1 text-dark text-break">{metric.value}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-7">
            <div className="card h-100">
              <div className="card-header border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3 py-4">
                <div>
                  <h5 className="mb-1 fw-bold text-dark">SV Field Performance Summary</h5>
                  <p className="text-muted mb-0">Switch between the active field view to compare performance across levels.</p>
                </div>
                <ul className="nav nav-pills card-header-pills" role="tablist">
                  {PERFORMANCE_TABS.map((tab) => (
                    <li key={tab.id} className="nav-item">
                      <button
                        type="button"
                        className={`nav-link py-2 px-3 ${activeSubTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveSubTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-body pt-6">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="row g-3">
                      {PERFORMANCE_VIEWS[activeSubTab].summaryCards.map((card) => (
                        <div key={card.id} className="col-12 col-sm-6 col-md-4">
                          <div className="card shadow-none border h-100">
                            <div className="card-body d-flex align-items-center gap-3">
                              <div
                                className="rounded-3 d-flex align-items-center justify-content-center"
                                style={{ width: '48px', height: '48px', backgroundColor: card.theme.icon_bg, color: card.theme.icon_color }}
                              >
                                <i className={`bx ${ICON_MAP[card.icon] ?? 'bx-help-circle'} fs-4`} />
                              </div>
                              <div>
                                <small className="d-block fw-semibold text-uppercase" style={{ fontSize: '0.68rem', color: card.theme.text_color, letterSpacing: '0.5px' }}>
                                  {card.label}
                                </small>
                                <h4 className="mb-0 fw-bold" style={{ color: card.theme.text_color }}>
                                  {card.value}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card shadow-none border">
                      <div className="card-header border-bottom d-flex align-items-center justify-content-between py-3">
                        <h6 className="mb-0 fw-bold text-dark">{PERFORMANCE_VIEWS[activeSubTab].title}</h6>
                        {activeSubTab === 'district_wise' && (
                          <span className="badge rounded-pill" style={{ backgroundColor: PERFORMANCE_VIEWS.district_wise.coWorkReport.badge.bg_color, color: PERFORMANCE_VIEWS.district_wise.coWorkReport.badge.text_color }}>
                            {PERFORMANCE_VIEWS.district_wise.coWorkReport.badge.label}
                          </span>
                        )}
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0" style={{ borderColor: PERFORMANCE_VIEWS[activeSubTab].table.borderColor }}>
                            <thead className="table-light">
                              <tr>
                                {PERFORMANCE_VIEWS[activeSubTab].table.headers.map((header) => (
                                  <th key={header.id} className="fw-bold" style={{ fontSize: '0.75rem' }}>
                                    {header.label}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {PERFORMANCE_VIEWS[activeSubTab].table.rows.length > 0 ? (
                                PERFORMANCE_VIEWS[activeSubTab].table.rows.map((row) => (
                                  <tr key={row.sl} style={{ backgroundColor: PERFORMANCE_VIEWS[activeSubTab].table.rowBgColor }}>
                                    <td>{row.sl}</td>
                                    <td>
                                      {row.district_badge ? (
                                        <div className="d-flex flex-column gap-2">
                                          <div className="d-flex align-items-center gap-2">
                                            <span className="rounded-pill px-2 py-1" style={{ backgroundColor: row.district_badge.bg_color, color: row.district_badge.text_color, fontSize: '0.75rem' }}>
                                              {row.district_badge.label}
                                            </span>
                                            <span>{row.district_name}</span>
                                          </div>
                                        </div>
                                      ) : (
                                        row.zone_name || row.district_name
                                      )}
                                    </td>
                                    <td>{row.total_shops}</td>
                                    <td>{row.shops_visited}</td>
                                    <td>{row.avg_shop_visit_duration}</td>
                                    <td>{row.number_of_days}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td className="text-muted py-4 text-center" colSpan={PERFORMANCE_VIEWS[activeSubTab].table.headers.length}>
                                    No data available for this view
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeSubTab === 'district_wise' && (
                    <div className="col-12">
                      <div className="card shadow-none border">
                        <div className="card-header d-flex align-items-center justify-content-between py-3">
                          <div>
                            <h6 className="mb-0 fw-bold text-dark">{PERFORMANCE_VIEWS.district_wise.coWorkReport.title}</h6>
                            <small className="text-muted">A summary of district co-work activity.</small>
                          </div>
                        </div>
                        <div className="card-body p-0">
                          {PERFORMANCE_VIEWS.district_wise.coWorkReport.rows.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-hover mb-0">
                                <thead className="table-light">
                                  <tr>
                                    {PERFORMANCE_VIEWS.district_wise.coWorkReport.headers.map((header) => (
                                      <th key={header.id} className="fw-bold" style={{ fontSize: '0.75rem' }}>
                                        {header.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {PERFORMANCE_VIEWS.district_wise.coWorkReport.rows.map((row) => (
                                    <tr key={row.sl}>
                                      <td>{row.sl}</td>
                                      <td>{row.date}</td>
                                      <td>{row.co_worker_name}</td>
                                      <td>{row.status}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="p-4 text-center">
                              <p className="mb-0" style={{ color: PERFORMANCE_VIEWS.district_wise.coWorkReport.emptyState.text_color }}>
                                {PERFORMANCE_VIEWS.district_wise.coWorkReport.emptyState.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="row g-4">
              <div className="col-12">
                <div className="card h-100 shadow-none border">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div>
                        <h6 className="fw-bold text-dark mb-1">Amolnama Highlights</h6>
                        <p className="text-muted mb-0">Key coverage and field performance metrics.</p>
                      </div>
                      <span className="badge bg-label-success text-success">Live</span>
                    </div>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <div className="p-3 rounded bg-light">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <small className="text-muted text-uppercase fw-semibold">Coverage</small>
                            <strong className="text-dark">33.3%</strong>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: '33%' }} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100" />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="p-3 rounded bg-light">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <small className="text-muted text-uppercase fw-semibold">Average Visit</small>
                            <strong className="text-dark">1</strong>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="p-3 rounded bg-light">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <small className="text-muted text-uppercase fw-semibold">Outlet Reach</small>
                            <strong className="text-dark">100%</strong>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar bg-info" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" />
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <div className="p-3 rounded bg-light">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <small className="text-muted text-uppercase fw-semibold">New Drops</small>
                            <strong className="text-dark">+1</strong>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: '15%' }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card h-100 shadow-none border">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="fw-bold text-dark mb-0">Performance Notes</h6>
                      <span className="badge bg-label-secondary text-secondary">Summary</span>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-start gap-3 mb-3">
                        <span className="badge bg-label-primary rounded-pill p-2 mt-1"><i className="bx bx-check fs-5 text-primary" /></span>
                        <div>
                          <p className="mb-1 fw-semibold text-dark">Supervisor completed all planned visits.</p>
                          <p className="text-muted mb-0">Review next month for additional outlet coverage.</p>
                        </div>
                      </li>
                      <li className="d-flex align-items-start gap-3">
                        <span className="badge bg-label-info rounded-pill p-2 mt-1"><i className="bx bx-trending-up fs-5 text-info" /></span>
                        <div>
                          <p className="mb-1 fw-semibold text-dark">Outlet performance remains stable.</p>
                          <p className="text-muted mb-0">No orders were recorded during the selected range.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4">

            <div className="card mt-4 border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">Field Operations Snapshot</h5>
                    <p className="text-muted mb-0">A responsive overview of coverage, outlet activity, and recent site movement.</p>
                  </div>
                  <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#EFF6FF', color: '#3B82F6' }}>
                    Live overview
                  </span>
                </div>

                <div className="row g-4">
                  {FIELD_PERFORMANCE_SUMMARY.map((item) => (
                    <div key={item.id} className="col-12 col-lg-6 col-xxl-3">
                      <div className="card h-100 shadow-none border" style={{ borderColor: '#E5E7EB' }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                            <div className="d-flex align-items-center gap-3">
                              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', backgroundColor: item.iconBg, color: item.iconColor }}>
                                <i className={`bx ${item.icon} fs-4`} />
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">{item.title}</h6>
                                {item.badge && (
                                  <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: item.badge.bgColor, color: item.badge.textColor, fontSize: '0.72rem' }}>
                                    {item.badge.label}
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.id === 'live_area_coverage' && (
                              <span className="badge rounded-pill" style={{ backgroundColor: item.badge.bgColor, color: item.badge.textColor, border: `1px solid ${item.badge.borderColor}` }}>
                                {item.badge.label}
                              </span>
                            )}
                          </div>

                          {item.id === 'tts_kpi' && (
                            <div className="table-responsive">
                              <table className="table align-middle mb-0">
                                <thead>
                                  <tr>
                                    {item.dataTable.headers.map((header) => (
                                      <th key={header.id} className="fw-semibold text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.4px' }}>
                                        {header.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.dataTable.rows.map((row) => (
                                    <tr key={row.duration}>
                                      <td className="py-2" style={{ color: '#111827' }}>{row.duration}</td>
                                      <td className="py-2 fw-semibold" style={{ color: '#111827' }}>{row.no_of_outlets}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {item.id === 'outlet_activity' && (
                            <div className="d-flex flex-column gap-2">
                              {item.metrics.map((metric) => (
                                <div key={metric.label} className="d-flex align-items-center justify-content-between rounded-3 border px-3 py-2" style={{ borderColor: '#F3F4F6' }}>
                                  <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.4px' }}>{metric.label}</span>
                                  <span className="fw-bold" style={{ color: metric.textColor, fontSize: '1rem' }}>{metric.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.id === 'live_area_coverage' && (
                            <>
                              <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '170px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 48%, #f8fafc 100%)', border: '1px solid #E5E7EB' }}>
                                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 25% 30%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 32%)' }} />
                                <div className="position-absolute" style={{ top: '28%', left: '38%', width: '12px', height: '12px', borderRadius: '50%', background: '#2563EB', boxShadow: '0 0 0 6px rgba(37, 99, 235, 0.16)' }} />
                                <div className="position-absolute" style={{ top: '56%', left: '24%', width: '14px', height: '14px', borderRadius: '50%', background: '#16A34A', boxShadow: '0 0 0 6px rgba(22, 163, 74, 0.14)' }} />
                                <div className="position-absolute" style={{ top: '40%', left: '66%', width: '12px', height: '12px', borderRadius: '50%', background: '#DC2626', boxShadow: '0 0 0 6px rgba(220, 38, 38, 0.14)' }} />
                                <div className="position-absolute bottom-0 start-0 end-0 p-3 d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)' }}>
                                  <span className="badge bg-white text-dark shadow-sm">{item.mapConfig.provider}</span>
                                  <span className="badge bg-white text-dark shadow-sm">{item.mapConfig.zoom}</span>
                                </div>
                              </div>
                              <div className="d-flex flex-column gap-1">
                                <span className="fw-semibold text-dark">{item.mapConfig.center}</span>
                                <small className="text-muted">Map view is ready for live field updates.</small>
                              </div>
                            </>
                          )}

                          {item.id === 'key_locations' && (
                            <div className="d-flex flex-column gap-3">
                              {item.locations.map((location) => (
                                <div key={location.site_name} className="rounded-3 border p-3" style={{ borderColor: '#F3F4F6' }}>
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: location.status_dot_color }} />
                                    <span className="fw-semibold text-dark">{location.site_name}</span>
                                  </div>
                                  <small className="text-muted">{location.last_visited}</small>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border shadow-none mt-4">
          <div className="card-body text-center py-5">
            <i className="bx bx-search fs-1 text-muted" />
            <h5 className="fw-bold text-dark mt-3 mb-2">No report data loaded yet</h5>
            <p className="text-muted mb-0">Enter the employee ID and date range above and click Search to load the dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
}
