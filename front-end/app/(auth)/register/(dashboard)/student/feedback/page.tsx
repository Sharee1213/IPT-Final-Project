'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function StudentFeedback() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '', type: 'inquiry' });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
      return;
    }

    loadFeedback();
  }, [isAuthenticated, user]);

  const loadFeedback = async () => {
    try {
      if (token) {
        const response: any = await api.getFeedback(token);
        setFeedback(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token) {
        await api.submitFeedback(token, formData);
        setFormData({ subject: '', message: '', type: 'inquiry' });
        setShowForm(false);
        loadFeedback();
        alert('Feedback submitted successfully');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit feedback');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <h1 className="text-3xl font-bold mb-8">Feedback & Inquiries</h1>

      {!showForm && (
        <Button variant="primary" onClick={() => setShowForm(true)} className="mb-6">
          Submit New Feedback
        </Button>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="inquiry">Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex gap-4">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="text-2xl font-bold mb-4">Your Submissions</h2>
        {feedback.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet</p>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.subject}</h3>
                  <Badge variant={item.status === 'resolved' ? 'green' : item.status === 'in_progress' ? 'yellow' : 'red'}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{item.message}</p>
                {item.response && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-blue-900">Response:</p>
                    <p className="text-sm text-blue-800">{item.response}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
