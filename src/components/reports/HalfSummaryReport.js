'use client';

import { useMemo, useState } from 'react';
import { getReportData } from '@/lib/getReportData';

const TODAY = new Date().toISOString().slice(0, 10);

const SESSION_CONFIG = [
  {
    sessionKey: 'first_half',
    sessionId: '1st_half',
    title: '1st Half Metrics',
    badgeLabel: 'AM SESSION',
    badgeBg: '#EFF6FF',
    badgeText: '#2563EB',
    indicatorColor: '#4F46E5',
  },
  {
    sessionKey: 'second_half',
    sessionId: '2nd_half',
    title: '2nd Half Metrics',
    badgeLabel: 'PM SESSION',
    badgeBg: '#F1F5F9',
    badgeText: '#475569',
    indicatorColor: '#4F46E5',
  },
];

const SESSION_METRICS = [
  {
    label: 'ORDER COUNT',
    key: 'order_count',
    valueColor: '#0F172A',
    changeKey: 'order_count_change',
    showChange: true,
  },
  {
    label: 'VISIT COUNT',
    key: 'visit_count',
    valueColor: '#16A34A',
    changeKey: 'visit_count_change',
    showChange: true,
  },
  {
    label: 'TARGET AMOUNT',
    key: 'target_amount',
    valueColor: '#0F172A',
    formatAs: 'currency',
  },
  {
    label: 'TARGET ACHIEVEMENT',
    key: 'target_achievement',
    valueColor: '#0F172A',
    suffix: '%',
  },
  {
    label: 'PRODUCTIVE OUTLETS',
    key: 'productive_outlets',
    valueColor: '#0F172A',
  },
  {
    label: 'NON-PRODUCTIVE OUTLETS',
    key: 'non_productive_outlets',
    valueColor: '#DC2626',
  },
  {
    label: 'PRODUCTIVITY',
    key: 'productivity',
    valueColor: '#0F172A',
    suffix: '%',
    secondaryKey: 'productivity_status',
  },
  {
    label: 'STRIKE RATE',
    key: 'strike_rate',
    valueColor: '#16A34A',
    suffix: '%',
    secondaryKey: 'strike_rate_status',
  },
  {
    label: 'LPC',
    key: 'lpc',
    valueColor: '#0F172A',
  },
  {
    label: 'LINE COUNT',
    key: 'line_count',
    valueColor: '#0F172A',
  },
];

const formatAmount = (value, symbol = '৳') => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return `${symbol}${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return number.toLocaleString('en-US');
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return `${number >= 0 ? '+' : ''}${number.toFixed(2)}%`;
};

const formatChange = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return `${number >= 0 ? '+' : ''}${Number.isInteger(number) ? number : number.toFixed(2)}%`;
};

const buildMetricValue = (metric, sessionSummary, currencySymbol) => {
  const rawValue = sessionSummary?.[metric.key];
  if (metric.formatAs === 'currency') {
    return formatAmount(rawValue, currencySymbol || '৳');
  }
  if (metric.suffix === '%') {
    return formatPercent(rawValue);
  }
  return formatNumber(rawValue);
};

const buildSessionCards = (sessionSummary, currencySymbol) => {
  if (!sessionSummary) {
    return SESSION_METRICS.map((metric) => ({
      ...metric,
      value: '—',
      secondaryText: null,
      changeText: metric.changeKey ? '' : null,
    }));
  }

  return SESSION_METRICS.map((metric) => {
    const value = buildMetricValue(metric, sessionSummary, currencySymbol);
    const secondaryText = metric.secondaryKey ? sessionSummary[metric.secondaryKey] || '—' : null;
    const changeText = metric.showChange ? formatChange(sessionSummary[metric.changeKey]) : null;

    return {
      ...metric,
      value,
      secondaryText,
      changeText,
    };
  });
};

const formatMetaValue = (value, { isPercent = false } = {}) => {
  if (value === null || value === undefined || value === '') return '—';
  if (isPercent) {
    const number = Number(String(value).replace('%', ''));
    if (Number.isNaN(number)) return String(value);
    return `${number.toFixed(2)}%`;
  }
  return formatNumber(value);
};

export default function HalfSummaryReport() {
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState(TODAY);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sessionRows = useMemo(
    () =>
      SESSION_CONFIG.map((session) => {
        const summary = reportData?.summary?.[session.sessionKey] || null;
        return {
          ...session,
          summary,
          cards: buildSessionCards(summary, reportData?.meta?.currency_symbol),
        };
      }),
    [reportData]
  );

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!staffId.trim()) {
      setErrorMessage('Please enter staff ID before searching.');
      return;
    }

    setErrorMessage('');
    setHasSearched(true);
    setIsLoading(true);
    setReportData(null);

    try {
      const response = await getReportData(
        'half-summary-report',
        `staff_id=${encodeURIComponent(staffId.trim())}&date=${encodeURIComponent(date)}&report_type=overall`
      );
      const receiveData = response?.receive_data || null;
      setReportData(receiveData);
      if (!receiveData) {
        setErrorMessage('No report data returned for the selected staff and date.');
      }
    } catch (error) {
      console.error('Half summary report fetch error:', error);
      setErrorMessage('Unable to load report data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
         <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Half Summary Report
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Search staff ID and date to load the half summary report.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                value={staffId}
                onChange={(event) => setStaffId(event.target.value)}
                placeholder="Staff ID"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white sm:w-[220px]"
              />

              <input
                type="date"
                value={date}
                max={TODAY}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
              />

              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span className="font-medium uppercase tracking-[0.12em] text-slate-500">
                  Overall
                </span>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Search
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {errorMessage}
            </div>
          ) : null}
        </section>

        {hasSearched ? (
          <section className="grid w-full gap-4 xl:grid-cols-2">
            {sessionRows.map((session) => (
              <article key={session.sessionId} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-1 rounded-full" style={{ backgroundColor: session.indicatorColor }} />
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{session.title}</h2>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: session.badgeBg, color: session.badgeText }}
                  >
                    {session.badgeLabel}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-[18px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600">ORDER AMOUNT</p>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-3xl font-black text-sky-700 sm:text-4xl">
                            {isLoading ? '—' : formatAmount(session.summary?.order_amount, reportData?.meta?.currency_symbol || '৳')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          CHANGE
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-slate-700">
                          {isLoading ? '0%' : formatChange(session.summary?.order_amount_change)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
                      {Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                          <div className="h-3 w-24 rounded-full bg-slate-200" />
                          <div className="mt-3 h-7 w-16 rounded-full bg-slate-200" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
                      {session.cards.map((card) => (
                        <div key={card.label} className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-3 shadow-sm">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">{card.label}</p>
                          <div className="mt-1.5 flex items-end gap-1">
                            <span className="text-lg font-black" style={{ color: card.valueColor }}>
                              {card.value}
                            </span>
                          </div>
                          {card.secondaryText ? (
                            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{card.secondaryText}</p>
                          ) : null}
                          {card.changeText ? (
                            <p className="mt-2 text-xs font-semibold text-slate-500">{card.changeText}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>
        ) : null}

          {hasSearched ? (
            <section className="grid w-full grid-cols-1">
              <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                  <span className="h-8 w-1 rounded-full" style={{ backgroundColor: '#4F46E5' }} />
                  <h3 className="text-lg font-semibold text-slate-900">Summary Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  <div className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-4 text-center shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">TOTAL SR</p>
                    <p className="mt-3 text-lg font-black text-indigo-600">{formatMetaValue(reportData?.meta?.total_sr)}</p>
                  </div>
                  <div className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-4 text-center shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">TOTAL OUTLETS</p>
                    <p className="mt-3 text-lg font-black text-emerald-600">{formatMetaValue(reportData?.meta?.total_outlet)}</p>
                  </div>
                  <div className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-4 text-center shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">TOTAL VISITED</p>
                    <p className="mt-3 text-lg font-black text-orange-600">{formatMetaValue(reportData?.meta?.total_visited)}</p>
                  </div>
                  <div className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-4 text-center shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">TOTAL NON-VISITED</p>
                    <p className="mt-3 text-lg font-black text-red-600">{formatMetaValue(reportData?.meta?.total_nonvisited)}</p>
                  </div>
                  <div className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-4 text-center shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">SUCCESS RATE</p>
                    <p className="mt-3 text-lg font-black text-amber-700">{formatMetaValue(reportData?.meta?.success_rate, { isPercent: true })}</p>
                  </div>
                  <div className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-4 text-center shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">AVG STEP COUNT</p>
                    <p className="mt-3 text-lg font-black text-sky-700">{formatMetaValue(reportData?.meta?.avg_step_count)}</p>
                  </div>
                </div>
              </article>
            </section>
          ) : null}
        </div>
      </div>
    );
}
