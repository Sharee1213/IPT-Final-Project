'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function AdminEvents() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    venue: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token) {
        await api.createEvent(token, formData);
        setFormData({
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          venue: '',
        });
        setShowForm(false);
        loadEvents();
        alert('Event created successfully');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    }
  };

  const handleDelete = async (eventId: number) => {
    if (confirm('Are you sure?')) {
      try {
        if (token) {
          await api.deleteEvent(token, eventId);
          loadEvents();
          alert('Event deleted');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete event');
      }
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
      <h1 className="text-3xl font-bold mb-8">Events</h1>

      {!showForm && (
        <Button variant="primary" onClick={() => setShowForm(true)} className="mb-6">
          Create New Event
        </Button>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Create Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <Input
              label="Start Date & Time"
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
            <Input
              label="End Date & Time"
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
            />
            <Input
              label="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
            <div className="flex gap-4">
              <Button variant="primary" type="submit">
                Create
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {events.length === 0 ? (
          <p className="text-gray-500">No events</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </Button>
                </div>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <div className="space-y-1 text-sm text-gray-500">
                  <p><strong>Start:</strong> {formatDate(event.start_date)}</p>
                  <p><strong>Venue:</strong> {event.venue || 'TBA'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
