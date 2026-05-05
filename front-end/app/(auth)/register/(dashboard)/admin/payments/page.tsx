'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminPayments() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'officer')) {
      router.push('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      if (token) {
        const paymentsRes: any = await api.getPayments(token);
        setPayments(paymentsRes.data || paymentsRes);

        const summaryRes: any = await api.getPaymentSummary(token);
        setSummary(summaryRes);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold mb-8">Payment Tracking</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(summary?.total_revenue || 0)}
          </p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Pending Payments</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {formatCurrency(summary?.total_pending || 0)}
          </p>
        </Card>
        <Card>
          <h3 className="text-gray-600 text-sm font-medium">Completed Transactions</h3>
          <p className="text-3xl font-bold">{payments.filter(p => p.status === 'completed').length}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4">All Payments</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500">No payments recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{payment.user?.name}</td>
                    <td className="px-4 py-3">{payment.payable_type}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={payment.status === 'completed' ? 'green' : payment.status === 'pending' ? 'yellow' : 'red'}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{payment.paid_at ? formatDate(payment.paid_at) : 'N/A'}</td>
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
