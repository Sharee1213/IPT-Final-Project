'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function StudentFines() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUnpaid, setTotalUnpaid] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
      return;
    }

    loadFines();
  }, [isAuthenticated, user]);

  const loadFines = async () => {
    try {
      if (token) {
        const response: any = await api.getFines(token);
        setFines(response.data || response);
        setTotalUnpaid(
          (response.data || response).reduce(
            (sum: number, fine: any) => fine.status === 'unpaid' ? sum + fine.amount : sum,
            0
          )
        );
      }
    } catch (err) {
      console.error('Failed to load fines:', err);
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

  return (
    <DashboardLayout role="student">
      <h1 className="text-3xl font-bold mb-8">Fines & Payments</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Total Fines</h3>
          <p className="text-3xl font-bold">{formatCurrency(fines.reduce((sum, f) => sum + f.amount, 0))}</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Unpaid</h3>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(totalUnpaid)}</p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Paid</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(fines.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0))}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Your Fines</h2>
        {fines.length === 0 ? (
          <p className="text-gray-500">No fines recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => (
                  <tr key={fine.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{fine.reason}</td>
                    <td className="px-4 py-3">{formatCurrency(fine.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={fine.status === 'paid' ? 'green' : fine.status === 'unpaid' ? 'red' : 'yellow'}>
                        {fine.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{fine.due_date ? formatDate(fine.due_date) : 'N/A'}</td>
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
