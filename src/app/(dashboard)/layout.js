import DashboardShell from '@/components/layout/DashboardShell';

export const metadata = {
  title: 'Dashboard – SPRO',
  description: 'SPRO Admin Dashboard',
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
