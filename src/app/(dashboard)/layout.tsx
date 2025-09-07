import { DashboardTopNav } from '@/components/layouts/dashboard-topnav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardTopNav />
      <main>{children}</main>
    </div>
  );
}
