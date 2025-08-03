import { useState } from 'react';
import AuthGuard from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { MetricsCards } from '@/components/dashboard/metrics-cards';
import { PayrollWorkflow } from '@/components/dashboard/payroll-workflow';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { StaffOverview } from '@/components/dashboard/staff-overview';
import { PayrollCalendar } from '@/components/dashboard/payroll-calendar';

export default function Dashboard() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const toggleNotifications = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };

  const closeNotifications = () => {
    setNotificationPanelOpen(false);
  };

  return (
    <AuthGuard requiredRole={['Super Admin', 'Account Admin', 'Payroll Admin']}>
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <TopBar
            title="Dashboard"
            subtitle="Overview of payroll operations"
            onNotificationClick={toggleNotifications}
          />

          <div className="p-6 space-y-6">
            {/* Metrics Cards */}
            <MetricsCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payroll Workflow */}
              <PayrollWorkflow />

              {/* Quick Actions */}
              <QuickActions />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <RecentActivity />

              {/* Staff Overview */}
              <StaffOverview />
            </div>

            {/* Payroll Calendar */}
            <PayrollCalendar />
          </div>
        </main>

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={closeNotifications}
        />
      </div>
    </AuthGuard>
  );
}
