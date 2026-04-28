'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function AdminMessages() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'officer')) {
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

  const handleRespond = async () => {
    if (!selectedFeedback || !response.trim()) return;

    try {
      if (token) {
        await api.respondToFeedback(token, selectedFeedback.id, { response });
        setResponse('');
        setSelectedFeedback(null);
        loadFeedback();
        alert('Response sent');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send response');
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
      <h1 className="text-3xl font-bold mb-8">Messages & Feedback</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold">
            {feedback.filter(f => f.status === 'pending').length}
          </p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">In Progress</h3>
          <p className="text-3xl font-bold">
            {feedback.filter(f => f.status === 'in_progress').length}
          </p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Resolved</h3>
          <p className="text-3xl font-bold text-green-600">
            {feedback.filter(f => f.status === 'resolved').length}
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4">All Feedback</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {feedback.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedFeedback(item)}
                className={`w-full text-left p-3 rounded border-l-4 hover:bg-gray-50 ${
                  selectedFeedback?.id === item.id ? 'bg-blue-50 border-blue-500' : ''
                } ${
                  item.status === 'pending' ? 'border-red-500' :
                  item.status === 'in_progress' ? 'border-yellow-500' :
                  'border-green-500'
                }`}
              >
                <div className="flex justify-between">
                  <h4 className="font-semibold text-sm">{item.subject}</h4>
                  <Badge variant={item.status === 'resolved' ? 'green' : item.status === 'in_progress' ? 'yellow' : 'red'}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{item.user?.name}</p>
              </button>
            ))}
          </div>
        </Card>

        {selectedFeedback && (
          <Card>
            <h2 className="text-2xl font-bold mb-4">{selectedFeedback.subject}</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600"><strong>From:</strong> {selectedFeedback.user?.name}</p>
              <p className="text-sm text-gray-600"><strong>Type:</strong> {selectedFeedback.type}</p>
              <p className="text-sm text-gray-600"><strong>Date:</strong> {formatDate(selectedFeedback.created_at)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded mb-4">
              <p className="text-gray-700">{selectedFeedback.message}</p>
            </div>
            {selectedFeedback.response && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
                <p className="text-sm font-semibold mb-1">Previous Response:</p>
                <p className="text-gray-700 text-sm">{selectedFeedback.response}</p>
              </div>
            )}
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <Button variant="primary" onClick={handleRespond} className="w-full">
              Send Response
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
