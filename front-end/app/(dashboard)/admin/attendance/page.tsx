'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAttendance() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'officer')) {
      router.push('/login');
      return;
    }

    loadEvents();
  }, [isAuthenticated, user]);

  const loadEvents = async () => {
    try {
      if (token) {
        const response: any = await api.getEvents(token);
        setEvents(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceForEvent = async (eventId: number) => {
    try {
      if (token) {
        const response: any = await api.getEvents(token, { event_id: eventId });
        // This would be the attendance endpoint when implemented
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token && selectedEvent) {
        await api.markAttendance(token, {
          student_id: studentId,
          event_id: selectedEvent.id,
          status: 'present',
        });
        setStudentId('');
        alert('Attendance marked for ' + studentId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <h1 className="text-3xl font-bold mb-8">Attendance Management</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Select Event</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  loadAttendanceForEvent(event.id);
                }}
                className={`w-full text-left p-3 rounded border-2 hover:bg-gray-50 ${
                  selectedEvent?.id === event.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-600">{new Date(event.start_date).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        </Card>

        {selectedEvent && (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
            <form onSubmit={handleMarkAttendance} className="space-y-4">
              <div>
                <p className="text-lg font-semibold mb-4">{selectedEvent.title}</p>
                <Input
                  label="Student ID (Scan QR or Enter)"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID"
                  autoFocus
                />
              </div>
              <Button variant="primary" type="submit" className="w-full">
                Mark Present
              </Button>
            </form>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
