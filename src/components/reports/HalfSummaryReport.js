'use client';

const REPORT_DATA = {
  page_layout: {
    background_color: '#F8FAFC',
    font_family: 'Inter, system-ui, sans-serif',
    header_section: {
      title: 'Half Summary Report',
      title_style: { font_size: '24px', font_weight: 'bold', color: '#0F172A' },
      subtitle: 'Performance metrics analysis by session',
      subtitle_style: { font_size: '14px', color: '#64748B' },
      action_bar: {
        date_picker: {
          value: 'Jul 1, 2026 ➔ Jul 1, 2026',
          bg_color: '#FFFFFF',
          border: '1px solid #E2E8F0',
          border_radius: '8px',
          padding: '8px 16px',
        },
        reset_button: {
          icon: 'refresh',
          bg_color: '#FFFFFF',
          border: '1px solid #FEE2E2',
          icon_color: '#EF4444',
        },
        search_button: {
          icon: 'search',
          bg_color: '#064E3B',
          icon_color: '#FFFFFF',
        },
        overall_badge: {
          label: 'Overall',
          bg_color: '#064E3B',
          text_color: '#FFFFFF',
          font_weight: 'semi-bold',
        },
      },
    },
    sessions_grid: {
      display: 'grid',
      grid_template_columns: 'repeat(2, minmax(0, 1fr))',
      gap: '24px',
      padding: '20px 0',
      columns: [
        {
          session_id: '1st_half',
          header: {
            indicator_bar: { width: '4px', color: '#4F46E5', height: '100%' },
            title: '1st Half Metrics',
            title_style: { font_size: '18px', font_weight: 'bold', color: '#0F172A' },
            badge: {
              label: 'AM SESSION',
              bg_color: '#EFF6FF',
              text_color: '#2563EB',
              font_size: '11px',
              font_weight: 'bold',
              border_radius: '9999px',
            },
          },
          cards_layout: {
            main_hero_card: {
              bg_color: '#FFFFFF',
              border_radius: '16px',
              box_shadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              padding: '24px',
              margin_bottom: '16px',
              top_row: {
                label: 'ORDER AMOUNT',
                label_style: { font_size: '12px', font_weight: 'bold', color: '#64748B', letter_spacing: '0.05em' },
                icon: 'shopping_bag',
              },
              middle_row: {
                currency_symbol: '৳',
                value: '0.00',
                value_style: { font_size: '36px', font_weight: 'bold', color: '#064E3B' },
              },
              right_aligned_trend: {
                percentage: '0%',
                label: 'CHANGE',
                label_style: { font_size: '10px', color: '#94A3B8' },
                icon: 'trending_neutral_arrow',
                icon_container_bg: '#F1F5F9',
              },
            },
            sub_metrics_grid: {
              display: 'grid',
              grid_template_columns: 'repeat(3, minmax(0, 1fr))',
              gap: '16px',
              cards: [
                { label: 'ORDER COUNT', value: '0', value_color: '#0F172A' },
                { label: 'VISIT COUNT', value: '0', value_color: '#16A34A' },
                {
                  label: 'PROD. OUTLETS',
                  value: '0',
                  denominator: '/ 0',
                  value_color: '#0F172A',
                  underline_bar: { color: '#E2E8F0', height: '2px' },
                },
                {
                  label: 'NON-PROD.',
                  value: '0',
                  denominator: '/ 0',
                  value_color: '#DC2626',
                  underline_bar: { color: '#E2E8F0', height: '2px' },
                },
                { label: 'LPC', value: '0', value_color: '#0F172A' },
                {
                  label: 'STRIKE RATE',
                  value: '0%',
                  value_color: '#16A34A',
                  underline_bar: { color: '#BBF7D0', height: '3px' },
                },
              ],
              card_styling: {
                bg_color: '#FFFFFF',
                border_radius: '12px',
                padding: '16px',
                box_shadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
                label_style: { font_size: '11px', font_weight: 'bold', color: '#64748B' },
                value_style: { font_size: '22px', font_weight: 'bold' },
              },
            },
          },
        },
        {
          session_id: '2nd_half',
          header: {
            indicator_bar: { width: '4px', color: '#4F46E5', height: '100%' },
            title: '2nd Half Metrics',
            title_style: { font_size: '18px', font_weight: 'bold', color: '#0F172A' },
            badge: {
              label: 'PM SESSION',
              bg_color: '#F1F5F9',
              text_color: '#475569',
              font_size: '11px',
              font_weight: 'bold',
              border_radius: '9999px',
            },
          },
          cards_layout: {
            main_hero_card: {
              bg_color: '#FFFFFF',
              border_radius: '16px',
              box_shadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
              padding: '24px',
              margin_bottom: '16px',
              top_row: {
                label: 'ORDER AMOUNT',
                label_style: { font_size: '12px', font_weight: 'bold', color: '#64748B' },
                icon: 'shopping_bag',
              },
              middle_row: {
                currency_symbol: '৳',
                value: '0.00',
                value_style: { font_size: '36px', font_weight: 'bold', color: '#064E3B' },
              },
              right_aligned_trend: {
                percentage: '0%',
                label: 'CHANGE',
                label_style: { font_size: '10px', color: '#94A3B8' },
                icon: 'trending_neutral_arrow',
                icon_container_bg: '#F1F5F9',
              },
            },
            sub_metrics_grid: {
              display: 'grid',
              grid_template_columns: 'repeat(3, minmax(0, 1fr))',
              gap: '16px',
              cards: [
                { label: 'ORDER COUNT', value: '0', value_color: '#0F172A' },
                { label: 'VISIT COUNT', value: '0', value_color: '#16A34A' },
                {
                  label: 'PROD. OUTLETS',
                  value: '0',
                  denominator: '/ 0',
                  value_color: '#0F172A',
                  underline_bar: { color: '#E2E8F0', height: '2px' },
                },
                {
                  label: 'NON-PROD.',
                  value: '0',
                  denominator: '/ 0',
                  value_color: '#DC2626',
                  underline_bar: { color: '#E2E8F0', height: '2px' },
                },
                { label: 'LPC', value: '0', value_color: '#0F172A' },
                {
                  label: 'STRIKE RATE',
                  value: '0%',
                  value_color: '#16A34A',
                  underline_bar: { color: '#BBF7D0', height: '3px' },
                },
              ],
              card_styling: {
                bg_color: '#FFFFFF',
                border_radius: '12px',
                padding: '16px',
                box_shadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
                label_style: { font_size: '11px', font_weight: 'bold', color: '#64748B' },
                value_style: { font_size: '22px', font_weight: 'bold' },
              },
            },
          },
        },
      ],
    },
  },
};

export default function HalfSummaryReport() {
  const { header_section, sessions_grid } = REPORT_DATA.page_layout;

  return (
    <div className="min-h-screen w-full bg-slate-50 px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <section className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-5 lg:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{header_section.title}</h1>
              {/* <p className="mt-2 text-sm text-slate-500 sm:text-base">{header_section.subtitle}</p> */}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                <i className="bx bx-calendar text-base text-slate-400" />
                <span className="font-medium">{header_section.action_bar.date_picker.value}</span>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-500 shadow-sm transition hover:-translate-y-0.5">
                <i className="bx bx-refresh" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-sm transition hover:-translate-y-0.5">
                <i className="bx bx-search" />
              </button>
              <span className="rounded-full bg-emerald-800 px-3 py-1.5 text-sm font-semibold text-white">
                {header_section.action_bar.overall_badge.label}
              </span>
            </div>
          </div>
        </section>

        <section className="grid w-full gap-4 xl:grid-cols-2">
          {sessions_grid.columns.map((session) => (
            <article key={session.session_id} className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-1 rounded-full" style={{ backgroundColor: session.header.indicator_bar.color }} />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{session.header.title}</h2>
                    {/* <p className="text-sm text-slate-500">Session performance overview</p> */}
                  </div>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: session.header.badge.bg_color,
                    color: session.header.badge.text_color,
                  }}
                >
                  {session.header.badge.label}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-[18px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 shadow-sm sm:p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600">
                        {session.cards_layout.main_hero_card.top_row.label}
                      </p>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-3xl font-black text-sky-700 sm:text-4xl">
                          {session.cards_layout.main_hero_card.middle_row.currency_symbol}
                          {session.cards_layout.main_hero_card.middle_row.value}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <i className={`bx bx-${session.cards_layout.main_hero_card.top_row.icon}`} />
                    </div>
                  </div>

                    <div className="mt-3 flex items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 px-2.5 py-2">
                        <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                            {session.cards_layout.main_hero_card.right_aligned_trend.label} {session.cards_layout.main_hero_card.right_aligned_trend.percentage}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {session.cards_layout.sub_metrics_grid.cards.map((card, index) => (
                    <div
                      key={`${session.session_id}-${card.label}-${index}`}
                      className="rounded-[14px] border border-slate-200 bg-slate-50/80 p-2.5 shadow-sm"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
                        {card.label}
                      </p>
                      <div className="mt-1.5 flex items-end gap-1">
                        <span className="text-lg font-black text-slate-900" style={{ color: card.value_color }}>
                          {card.value}
                        </span>
                        {card.denominator ? <span className="pb-0.5 text-sm text-slate-400">{card.denominator}</span> : null}
                      </div>
                      {card.underline_bar ? (
                        <div className="mt-2 h-1.5 rounded-full" style={{ backgroundColor: card.underline_bar.color }} />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
