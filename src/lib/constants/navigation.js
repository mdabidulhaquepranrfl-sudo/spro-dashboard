/**
 * Sidebar navigation configuration.
 * Add new menu items here to scale the sidebar without touching the component.
 */
export const SIDEBAR_NAV = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: 'bx bx-home-smile',
    badge: null,
    children: [
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/dashboard',
      },
    ],
  },
];
