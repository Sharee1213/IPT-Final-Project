'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, LoadingSpinner } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function StudentEvents() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
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

  if (loading) {
    return (
      <DashboardLayout role="student">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  const upcomingEvents = events.filter(e => new Date(e.start_date) > new Date());
  const pastEvents = events.filter(e => new Date(e.start_date) <= new Date());

  return (
    <DashboardLayout role="student">
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <Card>
            <p className="text-gray-500">No upcoming events</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Date:</strong> {formatDate(event.start_date)}</p>
                  <p><strong>Time:</strong> {new Date(event.start_date).toLocaleTimeString()}</p>
                  <p><strong>Venue:</strong> {event.venue || 'TBA'}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Past Events</h2>
        {pastEvents.length === 0 ? (
          <Card>
            <p className="text-gray-500">No past events</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Date:</strong> {formatDate(event.start_date)}</p>
                  <p><strong>Venue:</strong> {event.venue || 'TBA'}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
