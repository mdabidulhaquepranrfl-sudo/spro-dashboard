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
    ],
  },
];
