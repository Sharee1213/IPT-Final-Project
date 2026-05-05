'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

interface AdminDashboardData {
  total_students: number;
  upcoming_events: number;
  unpaid_fines: number;
  total_unpaid_amount: number;
  attendance_rate: number;
  pending_concerns: number;
  event_attendance: any[];
}

export default function AdminDashboard() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'officer')) {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      if (token) {
        const data = await api.getAdminDashboard(token);
        setDashboardData(data as AdminDashboardData);
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
      <DashboardLayout role="admin">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold">{dashboardData?.total_students || 0}</p>
        </Card>

        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Upcoming Events</h3>
          <p className="text-3xl font-bold">{dashboardData?.upcoming_events || 0}</p>
        </Card>

        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Unpaid Fines</h3>
          <p className="text-3xl font-bold text-red-600">{dashboardData?.unpaid_fines || 0}</p>
          <p className="text-sm text-gray-500">
            {formatCurrency(dashboardData?.total_unpaid_amount || 0)}
          </p>
        </Card>

        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Pending Concerns</h3>
          <p className="text-3xl font-bold text-yellow-600">{dashboardData?.pending_concerns || 0}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Overall Attendance Rate</h2>
          <p className="text-4xl font-bold text-blue-600">{dashboardData?.attendance_rate || 0}%</p>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Event Attendance Rates</h2>
          <div className="space-y-3">
            {(dashboardData?.event_attendance || []).slice(0, 5).map((event, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span>{event.title}</span>
                <Badge variant={event.rate >= 75 ? 'green' : event.rate >= 50 ? 'yellow' : 'red'}>
                  {event.rate}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
