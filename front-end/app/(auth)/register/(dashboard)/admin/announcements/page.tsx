'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function AdminAnnouncements() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_pinned: false,
  });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'officer')) {
      router.push('/login');
      return;
    }

    loadAnnouncements();
  }, [isAuthenticated, user]);

  const loadAnnouncements = async () => {
    try {
      if (token) {
        const response: any = await api.getAnnouncements(token);
        setAnnouncements(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token) {
        await api.createAnnouncement(token, formData);
        setFormData({ title: '', content: '', is_pinned: false });
        setShowForm(false);
        loadAnnouncements();
        alert('Announcement created');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create announcement');
    }
  };

  const handleDelete = async (announcementId: number) => {
    if (confirm('Delete this announcement?')) {
      try {
        if (token) {
          await api.deleteAnnouncement(token, announcementId);
          loadAnnouncements();
          alert('Announcement deleted');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
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
      <h1 className="text-3xl font-bold mb-8">Announcements</h1>

      {!showForm && (
        <Button variant="primary" onClick={() => setShowForm(true)} className="mb-6">
          Post Announcement
        </Button>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Create Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_pinned}
                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
              />
              <span>Pin this announcement</span>
            </label>
            <div className="flex gap-4">
              <Button variant="primary" type="submit">
                Post
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`border rounded-lg p-4 ${
                announcement.is_pinned ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{announcement.title}</h3>
                  <p className="text-sm text-gray-600">
                    {announcement.creator?.name} • {formatDate(announcement.created_at)}
                  </p>
                </div>
                {announcement.is_pinned && (
                  <span className="text-yellow-600 font-bold">📌</span>
                )}
              </div>
              <p className="text-gray-700 mb-3">{announcement.content}</p>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(announcement.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
