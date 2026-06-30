'use client';

import Link from 'next/link';

export default function WelcomeComponent() {
  return (
    <div className="container-xxl flex-grow-1">
      <div className="row">
        {/* Welcome Card */}
        <div className="col-12 mb-6">
          <div className="card bg-label-primary border-0 shadow-sm">
            <div className="card-body p-6 d-flex align-items-center justify-content-between flex-wrap gap-4">
              <div className="d-flex align-items-center gap-4">
                <div className="avatar avatar-xl bg-primary rounded p-2 d-none d-sm-block">
                  <i className="bx bx-confetti fs-1 text-white" />
                </div>
                <div>
                  <h3 className="fw-bold mb-1 text-primary">Welcome to SPRO Dashboard! 🚀</h3>
                  <p className="mb-0 text-muted" style={{ maxWidth: '600px' }}>
                    Manage and monitor supervisor performance ledger effortlessly. You can check individual performance reports by navigating to the Reports section.
                  </p>
                </div>
              </div>
              <div>
                <Link href="/report/amolnama" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5">
                  <i className="bx bx-bar-chart-square" /> Go to Amolnama
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="col-12">
          <div className="row g-4">
            {[
              { title: 'Overview Performance', desc: 'Detailed supervisor analytics and KPIs.', link: '/report/amolnama', icon: 'bx-bar-chart-alt-2', color: 'info' },
              { title: 'Recent Collaborations', desc: 'Monitor zone & district performance checklists.', link: '#', icon: 'bx-group', color: 'success' },
              { title: 'System Settings', desc: 'Configure defaults and metadata properties.', link: '#', icon: 'bx-cog', color: 'warning' }
            ].map((card, i) => (
              <div key={i} className="col-12 col-md-4">
                <div className="card h-100 border shadow-none">
                  <div className="card-body p-5 d-flex flex-column justify-content-between">
                    <div>
                      <div className={`avatar bg-label-${card.color} p-3 rounded mb-4 d-inline-block`}>
                        <i className={`bx ${card.icon} fs-2 text-${card.color}`} />
                      </div>
                      <h5 className="fw-bold text-dark mb-2">{card.title}</h5>
                      <p className="text-muted small mb-4">{card.desc}</p>
                    </div>
                    <div>
                      <Link href={card.link} className={`btn btn-sm btn-outline-${card.color} w-100`}>
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
