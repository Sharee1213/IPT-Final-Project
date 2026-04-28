'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function AdminFines() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    reason: '',
    amount: '',
  });
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'officer')) {
      router.push('/login');
      return;
    }

    loadFines();
    loadStudents();
  }, [isAuthenticated, user]);

  const loadFines = async () => {
    try {
      if (token) {
        const response: any = await api.getFines(token);
        setFines(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load fines:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      if (token) {
        const response: any = await api.getUsers(token);
        setStudents(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token) {
        await api.createFine(token, {
          user_id: parseInt(formData.user_id),
          reason: formData.reason,
          amount: parseFloat(formData.amount),
        });
        setFormData({ user_id: '', reason: '', amount: '' });
        setShowForm(false);
        loadFines();
        alert('Fine created');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create fine');
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
      <h1 className="text-3xl font-bold mb-8">Fines Management</h1>

      {!showForm && (
        <Button variant="primary" onClick={() => setShowForm(true)} className="mb-6">
          Create Fine
        </Button>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Create Fine</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.student_id})
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Reason</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => (
                <tr key={fine.id} className="border-b">
                  <td className="px-4 py-3">{fine.user?.name}</td>
                  <td className="px-4 py-3">{fine.reason}</td>
                  <td className="px-4 py-3">{formatCurrency(fine.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={fine.status === 'paid' ? 'green' : fine.status === 'unpaid' ? 'red' : 'yellow'}>
                      {fine.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
