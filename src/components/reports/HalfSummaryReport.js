'use client';

import { useMemo, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getReportData } from '@/lib/getReportData';
import SearchableStaffInput from '@/components/profile/SearchableStaffInput';

const TODAY = new Date().toISOString().slice(0, 10);

const TEAM_CARD_COLORS = ['#2563EB', '#059669', '#7C3AED', '#DC2626', '#EA580C'];

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
    valueColor: '#1E3A8A', // deep blue
    changeKey: 'order_count_change',
    showChange: true,
  },
  {
    label: 'VISIT COUNT',
    key: 'visit_count',
    valueColor: '#15803D', // deep green
    changeKey: 'visit_count_change',
    showChange: true,
  },
  {
    label: 'TARGET AMOUNT',
    key: 'target_amount',
    valueColor: '#7C3AED', // deep violet
    formatAs: 'currency',
  },
  {
    label: 'TARGET ACHIEVEMENT',
    key: 'target_achievement',
    valueColor: '#0F766E', // deep teal
    suffix: '%',
  },
  {
    label: 'PRODUCTIVE OUTLETS',
    key: 'productive_outlets',
    valueColor: '#166534', // emerald green
  },
  {
    label: 'NON-PRODUCTIVE OUTLETS',
    key: 'non_productive_outlets',
    valueColor: '#B91C1C', // deep red
  },
  {
    label: 'PRODUCTIVITY',
    key: 'productivity',
    valueColor: '#1D4ED8', // royal blue
    suffix: '%',
    secondaryKey: 'productivity_status',
  },
  {
    label: 'STRIKE RATE',
    key: 'strike_rate',
    valueColor: '#047857', // deep emerald
    suffix: '%',
    secondaryKey: 'strike_rate_status',
  },
  {
    label: 'LPC',
    key: 'lpc',
    valueColor: '#9333EA', // purple
  },
  {
    label: 'LINE COUNT',
    key: 'line_count',
    valueColor: '#C2410C', // deep orange
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

const getAvatarInitials = (member) => {
  const source = member?.sr_name || member?.sr_id || member?.emp_id || '';
  const words = String(source).split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (!words.length) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export default function HalfSummaryReport() {
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState(TODAY);
  const [reportType, setReportType] = useState('team_wise');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedMemberId, setExpandedMemberId] = useState(null);

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

  const handleReportTypeChange = (event) => {
    const nextType = event.target.value;
    setReportType(nextType);
    setExpandedMemberId(null);

    if (nextType !== 'team_wise') {
      return;
    }

    if (!reportData?.team_wise?.length) {
      return;
    }

    setExpandedMemberId(reportData.team_wise[0]?.emp_id ?? null);
  };

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
    setExpandedMemberId(null);

    try {
      const response = await getReportData(
        'half-summary-report',
        `staff_id=${encodeURIComponent(staffId.trim())}&date=${encodeURIComponent(date)}&report_type=${encodeURIComponent(reportType)}`
      );
      const receiveData = response?.receive_data || null;
      setReportData(receiveData);
      if (reportType === 'team_wise' && receiveData?.team_wise?.length) {
        setExpandedMemberId(receiveData.team_wise[0]?.emp_id ?? null);
      } else {
        setExpandedMemberId(null);
      }
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
      <div className="mx-auto flex w-full max-w-8xl flex-col gap-1 px-1 py-1 sm:px-1 lg:px-1">
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
              <div className="w-full sm:w-[220px]">
                <SearchableStaffInput
                  value={staffId}
                  onChange={setStaffId}
                  placeholder="Staff ID"
                  disabled={false}
                />
              </div>

              <input
                type="date"
                value={date}
                max={TODAY}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
              />

              <select
                value={reportType}
                onChange={handleReportTypeChange}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
              >
                <option value="team_wise">Team Wise</option>
                <option value="overall">Overall</option>
              </select>

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
          reportType === 'team_wise' ? (
            <div className="mx-auto flex w-full max-w-8xl flex-col gap-4">
              <section className="w-full space-y-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm sm:p-2">
                    <div className="h-3 w-36 rounded-full bg-slate-200" />
                    <div className="mt-3 h-8 w-48 rounded-full bg-slate-200" />
                  </div>
                ))
              ) : reportData?.team_wise?.length ? (
                reportData.team_wise.map((member, index) => {
                  const memberKey = String(member.emp_id ?? member.sr_id ?? `${member.sr_name || 'member'}-${member.sr_mobile || 'unknown'}`);
                  const isExpanded = expandedMemberId === memberKey;
                  const accentColor = TEAM_CARD_COLORS[index % TEAM_CARD_COLORS.length];

                  return (
                    <article key={memberKey} className="rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm sm:p-2">
                      <button
                        type="button"
                        onClick={() => setExpandedMemberId((current) => (current === memberKey ? null : memberKey))}
                        className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[12px] bg-slate-50/80 px-3 py-3 text-left"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: accentColor }}
                          >
                            {getAvatarInitials(member)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900" style={{ color: accentColor }}>
                              {member.sr_name || member.sr_id || 'Team Member'}
                            </p>
                            <p className="mt-1 break-words text-xs text-slate-500">
                              {member.sr_id || '—'}
                              {member.sr_mobile ? ` • ${member.sr_mobile}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="hidden [@media(min-width:974px)]:flex flex-1 items-center justify-center gap-8 border-l border-slate-200 px-4">
                          <div className="text-center">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1st Half Order</p>
                            <p className="text-sm font-bold text-slate-700 mt-0.5">
                              {formatAmount(member?.first_half?.order_amount, reportData?.meta?.currency_symbol || '৳')}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2nd Half Order</p>
                            <p className="text-sm font-bold text-slate-700 mt-0.5">
                              {formatAmount(member?.second_half?.order_amount, reportData?.meta?.currency_symbol || '৳')}
                            </p>
                          </div>
                          <div className="text-center bg-slate-100 rounded-xl px-3 py-1.5">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Order</p>
                            <p className="text-sm font-black text-sky-700 mt-0.5">
                              {formatAmount(
                                (Number(member?.first_half?.order_amount) || 0) + (Number(member?.second_half?.order_amount) || 0),
                                reportData?.meta?.currency_symbol || '৳'
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-2" style={{ color: accentColor }}>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </span>
                          {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </div>
                      </button>

                      {isExpanded ? (
                        <div className="mt-4 grid gap-4 xl:grid-cols-2">
                          {SESSION_CONFIG.map((session) => {
                            const summary = member?.[session.sessionKey] || null;

                            return (
                              <div key={session.sessionId} className="rounded-[18px] border border-slate-200 bg-slate-50/80 p-2 shadow-sm">
                                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                  <div className="flex items-center gap-3">
                                    <span className="h-8 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
                                    <div>
                                      <h3 className="text-base font-semibold text-slate-900">{session.title}</h3>
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
                                  <div className="rounded-[16px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600">ORDER AMOUNT</p>
                                        <div className="mt-2 flex items-end gap-2">
                                          <span className="text-2xl font-black sm:text-3xl" style={{ color: accentColor }}>
                                            {formatAmount(summary?.order_amount, reportData?.meta?.currency_symbol || '৳')}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">CHANGE</p>
                                        <p className="mt-1 text-xl font-extrabold text-slate-700">
                                          {formatChange(summary?.order_amount_change)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
                                    {buildSessionCards(summary, reportData?.meta?.currency_symbol).map((card) => (
                                      <div key={card.label} className="rounded-[14px] border border-slate-200 bg-white/80 p-3 shadow-sm">
                                        <p className="text-[10px] font-bold uppercase text-slate-600" style={{ color: card.valueColor }}>{card.label}</p>
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
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </article>
                  );
                })
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                  No team members found for this selection.
                </div>
              )}
              </section>
            </div>
          ) : (
            <section className="grid w-full gap-4 xl:grid-cols-2">
              {sessionRows.map((session) => (
                <article key={session.sessionId} className="rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm sm:p-2">
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
                            <p className="text-[10px] font-bold uppercase text-slate-600" style={{ color: card.valueColor }}>{card.label}</p>
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
          )
        ) : null}
        </div>
      </div>
    );
}
