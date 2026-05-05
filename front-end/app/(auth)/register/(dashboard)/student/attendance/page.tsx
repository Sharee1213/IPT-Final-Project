'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentAttendance() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
      return;
    }

    loadAttendance();
  }, [isAuthenticated, user]);

  const loadAttendance = async () => {
    try {
      if (token) {
        const response: any = await api.getMyAttendanceHistory(token);
        setAttendance(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  return (
    <DashboardLayout role="student">
      <h1 className="text-3xl font-bold mb-8">Attendance History</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Attendance Rate</h3>
          <p className="text-3xl font-bold">{attendanceRate}%</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Present</h3>
          <p className="text-3xl font-bold text-green-600">{presentCount}</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Absent</h3>
          <p className="text-3xl font-bold text-red-600">{attendance.filter(a => a.status === 'absent').length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Events Attended</h2>
        {attendance.length === 0 ? (
          <p className="text-gray-500">No attendance records</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Event</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Marked At</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{record.event?.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant={record.status === 'present' ? 'green' : record.status === 'absent' ? 'red' : 'yellow'}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{record.marked_at ? new Date(record.marked_at).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
