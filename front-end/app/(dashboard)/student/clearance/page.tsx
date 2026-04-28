'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export default function StudentClearance() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [clearance, setClearance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      router.push('/login');
      return;
    }

    loadClearance();
  }, [isAuthenticated, user]);

  const loadClearance = async () => {
    try {
      if (token) {
        const response: any = await api.getMyClearance(token);
        setClearance(response.data || response);
      }
    } catch (err) {
      console.error('Failed to load clearance:', err);
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

  const items = [
    { label: 'Finance Cleared', status: clearance?.finance_cleared },
    { label: 'Attendance Cleared', status: clearance?.attendance_cleared },
    { label: 'Products Cleared', status: clearance?.products_cleared },
  ];

  return (
    <DashboardLayout role="student">
      <h1 className="text-3xl font-bold mb-8">Clearance Status</h1>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Clearance Checklist</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-4 bg-gray-50 rounded"
            >
              <span className="font-medium">{item.label}</span>
              {item.status ? (
                <Badge variant="green">✓ Cleared</Badge>
              ) : (
                <Badge variant="red">✗ Pending</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Overall Status</h2>
        {clearance?.is_signed ? (
          <div className="text-center">
            <Badge variant="green">✓ Officially Signed</Badge>
            <p className="text-gray-600 mt-2">
              Signed by: {clearance?.signed_by?.name}
            </p>
            <p className="text-gray-600 text-sm">
              On: {clearance?.signed_at ? formatDate(clearance.signed_at) : 'N/A'}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <Badge variant="yellow">Pending Final Signature</Badge>
            <p className="text-gray-600 mt-2">
              Awaiting administrator signature
            </p>
          </div>
        )}
        {clearance?.notes && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-700">{clearance.notes}</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
