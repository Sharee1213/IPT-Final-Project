'use client';

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminClearance() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [clearances, setClearances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [search, setSearch] = useState('');

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
        const studentsRes: any = await api.getUsers(token);
        setStudents(studentsRes.data || studentsRes);

        const clearancesRes: any = await api.getClearanceList(token);
        setClearances(clearancesRes.data || clearancesRes);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClearance = async (studentId: number, updates: any) => {
    try {
      if (token) {
        const clearance = clearances.find(c => c.user_id === studentId);
        if (clearance) {
          await api.updateClearance(token, clearance.id, updates);
          loadData();
          alert('Clearance updated');
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update');
    }
  };

  const handleSign = async (clearanceId: number) => {
    try {
      if (token) {
        await api.updateClearance(token, clearanceId, { is_signed: true });
        loadData();
        alert('Clearance signed');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to sign');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.includes(search)
  );

  return (
    <DashboardLayout role="admin">
      <h1 className="text-3xl font-bold mb-8">Clearance Management</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Students</h2>
          <Input
            placeholder="Search by name or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => {
              const clearance = clearances.find(c => c.user_id === student.id);
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full text-left p-3 rounded border-l-4 hover:bg-gray-50 ${
                    selectedStudent?.id === student.id ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm">{student.name}</p>
                  <p className="text-xs text-gray-600">{student.student_id}</p>
                  {clearance?.is_signed ? (
                    <Badge variant="green">Signed</Badge>
                  ) : (
                    <Badge variant="red">Pending</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {selectedStudent && (
          <Card>
            <h2 className="text-2xl font-bold mb-4">{selectedStudent.name}</h2>
            {(() => {
              const clearance = clearances.find(c => c.user_id === selectedStudent.id);
              return clearance ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={clearance.finance_cleared}
                        onChange={(e) =>
                          handleUpdateClearance(selectedStudent.id, {
                            finance_cleared: e.target.checked,
                          })
                        }
                      />
                      <span>Finance Cleared</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={clearance.attendance_cleared}
                        onChange={(e) =>
                          handleUpdateClearance(selectedStudent.id, {
                            attendance_cleared: e.target.checked,
                          })
                        }
                      />
                      <span>Attendance Cleared</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={clearance.products_cleared}
                        onChange={(e) =>
                          handleUpdateClearance(selectedStudent.id, {
                            products_cleared: e.target.checked,
                          })
                        }
                      />
                      <span>Products Cleared</span>
                    </label>
                  </div>
                  <Button
                    variant={clearance.is_signed ? 'secondary' : 'primary'}
                    className="w-full"
                    onClick={() => handleSign(clearance.id)}
                  >
                    {clearance.is_signed ? 'Revoke Signature' : 'Sign Clearance'}
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">No clearance record</p>
              );
            })()}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
