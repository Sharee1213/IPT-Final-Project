'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardData {
  upcoming_events: any[];
  attendance_rate: number;
  present_count: number;
  total_events: number;
  unpaid_fines: any[];
  total_unpaid_amount: number;
  clearance: any;
  notifications: any[];
}

export default function StudentDashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'student') {
      router.push('/admin/dashboard');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      if (token) {
        const data = await api.getStudentDashboard(token);
        setDashboardData(data as DashboardData);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <DashboardLayout role="student">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Attendance Rate</h3>
          <p className="text-3xl font-bold">{dashboardData?.attendance_rate || 0}%</p>
          <p className="text-gray-500 text-sm">
            {dashboardData?.present_count || 0}/{dashboardData?.total_events || 0} events
          </p>
        </Card>

        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Unpaid Fines</h3>
          <p className="text-3xl font-bold text-red-600">
            {dashboardData?.unpaid_fines?.length || 0}
          </p>
          <p className="text-gray-500 text-sm">
            Total: {formatCurrency(dashboardData?.total_unpaid_amount || 0)}
          </p>
        </Card>

        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Clearance Status</h3>
          <p className="text-2xl font-bold">
            {dashboardData?.clearance?.is_signed ? (
              <Badge variant="green">Signed</Badge>
            ) : (
              <Badge variant="red">Pending</Badge>
            )}
          </p>
        </Card>

        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Notifications</h3>
          <p className="text-3xl font-bold">{dashboardData?.notifications?.length || 0}</p>
          <p className="text-gray-500 text-sm">Unread messages</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {(dashboardData?.upcoming_events || []).slice(0, 5).map((event) => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(event.start_date)}
                </p>
              </div>
            ))}
            {(dashboardData?.upcoming_events || []).length === 0 && (
              <p className="text-gray-500">No upcoming events</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Outstanding Fines</h2>
          <div className="space-y-3">
            {(dashboardData?.unpaid_fines || []).slice(0, 5).map((fine) => (
              <div key={fine.id} className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold">{fine.reason}</h4>
                <p className="text-sm text-red-600">
                  {formatCurrency(fine.amount)}
                </p>
              </div>
            ))}
            {(dashboardData?.unpaid_fines || []).length === 0 && (
              <p className="text-green-600 font-semibold">No outstanding fines!</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
