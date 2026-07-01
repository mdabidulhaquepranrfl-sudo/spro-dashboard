/**
 * Sidebar navigation configuration.
 * Driven by scaleable JSON array structure.
 */
export const SIDEBAR_NAV = [
  {
    id: 'home',
    label: 'Home',
    icon: 'bx bx-home-circle',
    href: '/home',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'bx bx-bar-chart-square',
    badge: null,
    children: [
      {
        id: 'amolnama',
        label: 'Amolnama',
        href: '/report/amolnama',
      },
      {
        id: 'target-vs-achievement',
        label: 'Target vs Achievement',
        href: '/report/target-vs-achievement',
      },
      {
        id: 'half-summery',
        label: 'Half Summery',
        href: '/report/half-summery-report',
      },
    ],
  },
];
