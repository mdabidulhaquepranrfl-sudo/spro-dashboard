'use client';

import { useEffect, useState } from 'react';
// import { getReportData } from '@/lib/getReportData';

const ICON_MAP = {
  location_pin: 'bx-map-pin',
  check_circle: 'bx-check-circle',
  warning_triangle: 'bx-error-circle',
  map_icon: 'bx-map',
  users_group: 'bx-group',
};

/**
 * Reusable Performance Summary Table component.
 * Used for Thana Wise, Zone Wise, and District Wise views.
 *
 * Props:
 * - title: string (e.g., "Thana Performance Summary")
 * - summaryCards: array of card objects with { id, label, value, icon, theme }
 * - headers: array of { id, label }
 * - rows: array of row objects
 * - searchQuery: string for filtering
 * - emptyMessage: string (fallback message)
 * - rowRenderer: optional custom row renderer function(row, headers)
 */
export default function PerformanceSummary({
  title,
  summaryCards = [],
  headers = [],
  rows = [],
  searchQuery = '',
  emptyMessage = 'No data available for this view',
  rowRenderer,
}) {
  const normalizeRow = (row) => {
    return Object.values(row).flatMap((value) => {
      if (value == null) return [];
      if (typeof value === 'object') return Object.values(value).map((nested) => String(nested).toLowerCase());
      return String(value).toLowerCase();
    });
  };

  const filteredRows = searchQuery.trim()
    ? rows.filter((row) => normalizeRow(row).some((cell) => cell.includes(searchQuery.toLowerCase())))
    : rows;

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
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
          <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                {headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) =>
                  rowRenderer ? (
                    rowRenderer(row, headers)
                  ) : (
                    <tr key={row.sl} className="bg-slate-50/50">
                      {headers.map((header) => (
                        <td key={header.id} className="px-4 py-3">
                          {header.id === 'thana_name' || header.id === 'zone_name' || header.id === 'district_name'
                            ? row.district_badge
                              ? (
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full px-2 py-1 text-xs font-semibold" style={{ backgroundColor: row.district_badge.bg_color, color: row.district_badge.text_color }}>{row.district_badge.label}</span>
                                  <span>{row[header.id]}</span>
                                </div>
                              )
                              : (row[header.id])
                            : row[header.id]}
                        </td>
                      ))}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-6 text-center text-slate-500">{emptyMessage}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
