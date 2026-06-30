/**
 * Sidebar navigation configuration.
 * Configured with "Reports" as the header group,
 * and "Amolnama" pointing to /amolnama.
 */
export const SIDEBAR_NAV = [
  {
    id: 'reports',
    label: 'Reports',
    icon: 'bx bx-home-smile',
    badge: null,
    children: [
      {
        id: 'amolnama',
        label: 'Amolnama',
        href: '/amolnama',
      },
    ],
  },
];
